import { useState, useEffect } from "react";
import { db } from "@/config/firebase";
import { collection, query, where, onSnapshot, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { useAuthStore } from "@/features/auth";
import { toast } from "sonner";
import type { Order } from "../components/OrderCard";

interface SnapResult {
  order_id?: string;
}

interface SnapOptions {
  onSuccess?: (result: SnapResult) => void;
  onPending?: (result: SnapResult) => void;
  onError?: (result: SnapResult) => void;
  onClose?: () => void;
}

declare global {
  interface Window {
    snap: {
      pay: (token: string, options: SnapOptions) => void;
    };
  }
}

const BACKEND_URL = import.meta.env.VITE_API_URL;

export const useOrders = () => {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"ALL" | "PENDING" | "PAID" | "FAILED">("ALL");
  const [orderToCancel, setOrderToCancel] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.uid) return;
    
    // Real-time listener ke Firestore berdasarkan userId
    const q = query(
      collection(db, 'orders'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData: Order[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        ordersData.push({
          orderId: data.orderId,
          items: data.items,
          total: data.total,
          status: data.status,
          snapToken: data.snapToken,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString()
        });
      });
      
      // Urutkan dari yang terbaru
      ordersData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      setOrders(ordersData);
      setIsLoading(false);
    }, (error) => {
      console.error("Failed to listen to orders:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleCancelOrder = async () => {
    if (!orderToCancel) return;
    try {
      if (!user) {
        toast.error("Silakan login terlebih dahulu.");
        return;
      }

      // Update Firestore langsung untuk respon instan di UI
      const orderRef = doc(db, 'orders', orderToCancel);
      await updateDoc(orderRef, {
        status: 'FAILED',
        updatedAt: serverTimestamp()
      });

      // Panggil backend untuk membatalkan di Midtrans (asinkron)
      const token = await user.getIdToken();
      fetch(`${BACKEND_URL}/api/orders/${orderToCancel}/cancel`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      }).catch(err => console.warn("Backend cancel error:", err));

      toast.success("Pesanan berhasil dibatalkan.");
    } catch (error) {
      console.error("Cancel Order Error:", error);
      toast.error("Gagal membatalkan pesanan.");
    } finally {
      setOrderToCancel(null);
    }
  };

  const handlePayNow = (snapToken: string | undefined) => {
    if (!snapToken) {
      alert("Token pembayaran tidak ditemukan. Tidak dapat melanjutkan.");
      return;
    }
    
    if (window.snap) {
      window.snap.pay(snapToken, {
        onSuccess: async function (result) {
          console.log('Success:', result);
          try {
            const orderId = result?.order_id;
            if (orderId && user) {
              const userToken = await user.getIdToken();
              await fetch(`${BACKEND_URL}/api/orders/${orderId}/confirm-payment`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${userToken}`,
                },
                body: JSON.stringify(result),
              });
            }
          } catch (err) {
            console.error("Confirm Payment Error:", err);
          }
          toast.success("Pembayaran Berhasil!");
        },
        onPending: function (result) {
          console.log('Pending:', result);
          toast.info("Menunggu pembayaran...");
        },
        onError: function (result) {
          console.log('Error:', result);
          toast.error("Pembayaran gagal!");
        },
        onClose: function () {
          console.log('Customer closed the popup');
        }
      });
    } else {
      alert("Sistem pembayaran belum siap.");
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "ALL") return true;
    return order.status === activeTab;
  });

  return {
    orders: filteredOrders,
    isLoading,
    activeTab,
    setActiveTab,
    orderToCancel,
    setOrderToCancel,
    handleCancelOrder,
    handlePayNow
  };
};

