import { db, admin } from '../../config/firebase.js';
import { coreApi } from '../../config/midtrans.js';

export class CleanupService {
  /**
   * Main routine to perform periodic background cleanup
   */
  static async runCleanup() {
    if (!db) {
      console.warn("⚠️ Firestore database not initialized. Cleanup skipped.");
      return;
    }

    console.log(`[Cleanup] Background cleanup job started at ${new Date().toISOString()}`);

    try {
      await this.cleanupExpiredProducts();
      await this.cleanupStalePendingOrders();
      await this.cleanupExpiredPaidOrders();
    } catch (error) {
      console.error("[Cleanup] Error during background cleanup:", error);
    }
  }

  /**
   * 1. Pembersihan Produk Kedaluwarsa:
   * Query produk berstatus 'active' yang pickupDeadline sudah lampau.
   * Ubah status menjadi 'expired'.
   */
  static async cleanupExpiredProducts() {
    const now = new Date();
    
    // Ambil semua produk yang berstatus 'active'
    const snapshot = await db.collection('products')
      .where('status', '==', 'active')
      .get();

    if (snapshot.empty) {
      return;
    }

    const batch = db.batch();
    let expiredCount = 0;

    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.pickupDeadline) {
        const deadline = new Date(data.pickupDeadline);
        if (deadline.getTime() <= now.getTime()) {
          const productRef = db.collection('products').doc(doc.id);
          batch.update(productRef, {
            status: 'expired',
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          });
          expiredCount++;
        }
      }
    });

    if (expiredCount > 0) {
      await batch.commit();
      console.log(`[Cleanup] Successfully marked ${expiredCount} expired products.`);
    }
  }

  /**
   * 2. Pembersihan Pesanan Menggantung:
   * Query pesanan berstatus 'PENDING' yang berumur > 5 menit.
   * Ubah status pesanan menjadi 'FAILED', batalkan di Midtrans, dan bersihkan kunci stok terkait.
   */
  static async cleanupStalePendingOrders() {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    // Ambil semua order berstatus 'PENDING'
    const snapshot = await db.collection('orders')
      .where('status', '==', 'PENDING')
      .get();

    if (snapshot.empty) {
      return;
    }

    let staleCount = 0;

    for (const docSnapshot of snapshot.docs) {
      const orderData = docSnapshot.data();
      let createdAtDate;

      if (orderData.createdAt) {
        // Handle Firestore Timestamp or standard ISO String
        createdAtDate = typeof orderData.createdAt.toDate === 'function'
          ? orderData.createdAt.toDate()
          : new Date(orderData.createdAt);
      } else {
        createdAtDate = new Date();
      }

      // Check if order is older than 5 minutes
      if (createdAtDate.getTime() <= fiveMinutesAgo.getTime()) {
        const orderId = orderData.orderId || docSnapshot.id;
        console.log(`[Cleanup] Cleaning up stale pending order: ${orderId} (Created at: ${createdAtDate.toISOString()})`);
        
        // 1. Coba batalkan transaksi di Midtrans
        try {
          await coreApi.transaction.cancel(orderId);
          console.log(`[Cleanup] Midtrans transaction cancelled for order: ${orderId}`);
        } catch (midtransError) {
          // Abaikan error jika transaksi sudah expired/batal/tidak ditemukan di Midtrans
          console.warn(`[Cleanup] Midtrans cancel warning for order ${orderId}:`, midtransError.message);
        }

        // 2. Gunakan transaction atau batch untuk mengupdate order dan produk secara atomik
        const batch = db.batch();
        
        // Update status order ke FAILED
        const orderRef = db.collection('orders').doc(orderId);
        batch.update(orderRef, {
          status: 'FAILED',
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        // 3. Bersihkan locks di produk
        if (orderData.items && Array.isArray(orderData.items)) {
          for (const item of orderData.items) {
            if (item.id) {
              const productRef = db.collection('products').doc(item.id);
              
              // Karena kita menggunakan batch update, kita perlu membaca data produk terlebih dahulu 
              // atau menggunakan FieldValue untuk mengolah array.
              // Untuk keandalan, kita ambil datanya dulu.
              try {
                const productSnap = await productRef.get();
                if (productSnap.exists) {
                  const productData = productSnap.data();
                  if (productData.locks && Array.isArray(productData.locks)) {
                    // Filter out locks associated with this order
                    const updatedLocks = productData.locks.filter(lock => lock.orderId !== orderId);
                    
                    batch.update(productRef, {
                      locks: updatedLocks,
                      updatedAt: admin.firestore.FieldValue.serverTimestamp()
                    });
                  }
                }
              } catch (prodError) {
                console.error(`[Cleanup] Error retrieving product ${item.id} for lock cleanup:`, prodError);
              }
            }
          }
        }

        await batch.commit();
        staleCount++;
      }
    }

    if (staleCount > 0) {
      console.log(`[Cleanup] Successfully cleaned up ${staleCount} stale pending orders.`);
    }
  }

  /**
   * 3. Pembersihan Pesanan PAID yang Melewati Batas Pengambilan:
   * Query pesanan berstatus 'PAID'.
   * Jika semua item dalam pesanan memiliki pickupDeadline yang sudah lampau,
   * ubah status pesanan menjadi 'FAILED' (Batal/Kedaluwarsa).
   * Catatan: Stok TIDAK dikembalikan dan saldo dompet merchant TIDAK ditarik kembali.
   */
  static async cleanupExpiredPaidOrders() {
    const now = new Date();
    
    // Ambil semua order berstatus 'PAID'
    const snapshot = await db.collection('orders')
      .where('status', '==', 'PAID')
      .get();

    if (snapshot.empty) {
      return;
    }

    const batch = db.batch();
    let expiredPaidCount = 0;

    for (const docSnapshot of snapshot.docs) {
      const orderData = docSnapshot.data();
      let isAllExpired = true;
      let hasDeadline = false;

      // Cek apakah semua items dalam order sudah melewati deadline pengambilan
      if (orderData.items && Array.isArray(orderData.items)) {
        for (const item of orderData.items) {
          let deadlineStr = item.pickupDeadline;
          
          // Fallback: Jika order lama tidak menyimpan pickupDeadline di item-nya,
          // kita coba ambil pickupDeadline langsung dari produk di database.
          if (!deadlineStr && item.id && item.id !== "FEE-01") {
            try {
              const productSnap = await db.collection('products').doc(item.id).get();
              if (productSnap.exists) {
                deadlineStr = productSnap.data().pickupDeadline;
              }
            } catch (err) {
              console.error(`[Cleanup] Failed to fetch fallback deadline for item ${item.id}:`, err);
            }
          }

          if (deadlineStr) {
            hasDeadline = true;
            const deadline = new Date(deadlineStr);
            if (deadline.getTime() > now.getTime()) {
              // Jika ada minimal satu item yang belum melewati batas, jangan tandai expired dulu
              isAllExpired = false;
              break;
            }
          }
        }
      }

      // Jika order memiliki batas waktu pengambilan dan semuanya sudah lampau
      if (hasDeadline && isAllExpired) {
        const orderRef = db.collection('orders').doc(docSnapshot.id);
        batch.update(orderRef, {
          status: 'FAILED',
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        expiredPaidCount++;
      }
    }

    if (expiredPaidCount > 0) {
      await batch.commit();
      console.log(`[Cleanup] Successfully marked ${expiredPaidCount} expired PAID orders as FAILED (uncollected).`);
    }
  }
}
