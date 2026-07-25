import { useState, useEffect } from 'react';
import { db } from '@/config/firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
} from 'firebase/firestore';
import { useAuthStore } from '@/features/auth';

export interface EcoStats {
  /** Total makanan diselamatkan dalam Kg */
  foodSavedKg: number;
  /** Estimasi pengurangan emisi CO₂ dalam Kg (foodSavedKg × 2.5) */
  co2ReducedKg: number;
  /** Jumlah porsi donasi yang berhasil disalurkan */
  donationPortions: number;
  /** Jumlah total order yang berhasil COMPLETED */
  completedOrders: number;
}

const DEFAULT_WEIGHT_GRAMS = 250; // fallback jika produk tidak memiliki weightInGrams
const CO2_FACTOR = 2.5; // kg CO₂ per kg makanan diselamatkan

// Cache in-memory sederhana agar tidak fetch produk yang sama berulang kali
const productWeightCache = new Map<string, { weightInGrams: number; isDonation: boolean }>();

async function getProductMeta(
  productId: string
): Promise<{ weightInGrams: number; isDonation: boolean }> {
  if (productWeightCache.has(productId)) {
    return productWeightCache.get(productId)!;
  }
  try {
    const docSnap = await getDoc(doc(db, 'products', productId));
    if (docSnap.exists()) {
      const data = docSnap.data();
      const meta = {
        weightInGrams: data.weightInGrams ?? DEFAULT_WEIGHT_GRAMS,
        isDonation: data.isDonation ?? false,
      };
      productWeightCache.set(productId, meta);
      return meta;
    }
  } catch {
    // Gagal fetch produk – gunakan fallback
  }
  const fallback = { weightInGrams: DEFAULT_WEIGHT_GRAMS, isDonation: false };
  productWeightCache.set(productId, fallback);
  return fallback;
}

/**
 * useMerchantStats — Hook real-time untuk menghitung metrik dampak lingkungan merchant.
 *
 * Formula:
 *   foodSavedKg   = Σ (item.quantity × product.weightInGrams) ÷ 1000
 *   co2ReducedKg  = foodSavedKg × 2.5
 *   donationPortions = Σ item.quantity (untuk item.price === 0 / isDonation)
 *
 * Sumber data: koleksi `orders` di Firestore, difilter status === 'COMPLETED'
 * dan merchantIds array-contains merchantId.
 */
export function useMerchantStats() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<EcoStats>({
    foodSavedKg: 0,
    co2ReducedKg: 0,
    donationPortions: 0,
    completedOrders: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) {
      setIsLoading(false);
      return;
    }

    const merchantId = user.uid;

    // Gunakan onSnapshot agar dashboard otomatis update ketika ada klaim baru yang selesai
    const q = query(
      collection(db, 'orders'),
      where('merchantIds', 'array-contains', merchantId),
      where('status', '==', 'COMPLETED')
    );

    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        setIsLoading(true);

        // Kumpulkan semua productId unik dari seluruh order yang COMPLETED
        // Hindari N+1 query: fetch semua produk unik sekali, bukan per-item
        const uniqueProductIds = new Set<string>();
        snapshot.forEach((orderDoc) => {
          const order = orderDoc.data();
          const items: Array<{ id: string; quantity: number; price: number }> =
            order.items ?? [];
          items.forEach((item) => {
            // Abaikan item biaya layanan (FEE-01) dan item tanpa merchantId
            if (item.id && item.id !== 'FEE-01') {
              uniqueProductIds.add(item.id);
            }
          });
        });

        // Fetch semua produk unik secara paralel (tidak N+1, karena di-batch dalam Promise.all)
        await Promise.all(
          Array.from(uniqueProductIds).map((pid) => getProductMeta(pid))
        );

        // Hitung metrik setelah semua produk tersedia di cache
        let totalWeightGrams = 0;
        let donationPortions = 0;
        let completedOrders = 0;

        snapshot.forEach((orderDoc) => {
          const order = orderDoc.data();
          const items: Array<{ id: string; quantity: number; price: number }> =
            order.items ?? [];

          completedOrders++;

          items.forEach((item) => {
            if (!item.id || item.id === 'FEE-01') return;

            const meta = productWeightCache.get(item.id) ?? {
              weightInGrams: DEFAULT_WEIGHT_GRAMS,
              isDonation: false,
            };

            totalWeightGrams += item.quantity * meta.weightInGrams;

            // Anggap donasi jika isDonation===true dari produk ATAU harga item === 0
            if (meta.isDonation || item.price === 0) {
              donationPortions += item.quantity;
            }
          });
        });

        const foodSavedKg = totalWeightGrams / 1000;
        const co2ReducedKg = foodSavedKg * CO2_FACTOR;

        setStats({
          foodSavedKg: Math.round(foodSavedKg * 10) / 10,
          co2ReducedKg: Math.round(co2ReducedKg * 10) / 10,
          donationPortions,
          completedOrders,
        });
        setIsLoading(false);
      },
      (error) => {
        console.error('[useMerchantStats] Firestore error:', error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

  return { stats, isLoading };
}
