import { snap, coreApi } from '../../config/midtrans.js';
import { db, admin } from '../../config/firebase.js';

export class PaymentService {
  /**
   * Creates a pending order in Firestore and generates a Snap Token with 5-minute stock locking
   */
  static async createCheckoutSession(items, total, customerDetails, userId) {
    const orderId = `ORDER-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

    if (!db) {
      throw new Error("Firebase DB not initialized");
    }

    const productItems = items.filter(item => item.id && item.merchantId && item.id !== "FEE-01");

    // 1. Run Firestore Transaction to check stock availability and write lock entry
    await db.runTransaction(async (transaction) => {
      const nowMs = Date.now();
      const expiresAt = new Date(nowMs + 5 * 60 * 1000); // 5 minutes lock duration

      // Fetch all products in parallel
      const productDocs = await Promise.all(
        productItems.map(item => transaction.get(db.collection('products').doc(item.id)))
      );

      for (let i = 0; i < productItems.length; i++) {
        const item = productItems[i];
        const doc = productDocs[i];

        if (!doc.exists) {
          throw new Error(`Produk ${item.id} tidak ditemukan`);
        }

        const data = doc.data();

        // Clean up expired locks from the locks array
        const locks = data.locks || [];
        const activeLocks = locks.filter(lock => {
          let expTime = 0;
          if (lock.expiresAt) {
            if (typeof lock.expiresAt.toDate === 'function') {
              expTime = lock.expiresAt.toDate().getTime();
            } else {
              expTime = new Date(lock.expiresAt).getTime();
            }
          }
          return expTime > nowMs;
        });

        // Calculate available stock
        const lockedQuantity = activeLocks.reduce((sum, l) => sum + (l.quantity || 0), 0);
        const availableStock = (data.stock || 0) - lockedQuantity;

        if (availableStock < item.quantity) {
          throw new Error(`Stok tidak mencukupi untuk ${data.title || data.name || item.name}. Tersedia: ${availableStock}, Diminta: ${item.quantity}`);
        }

        // Add new lock
        const newLock = {
          orderId,
          quantity: item.quantity,
          expiresAt: admin.firestore.Timestamp.fromDate(expiresAt)
        };

        const updatedLocks = [...activeLocks, newLock];
        transaction.update(doc.ref, {
          locks: updatedLocks,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      }
    });

    // 2. Prepare Midtrans Transaction Data
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: total
      },
      item_details: items.map(item => ({
        id: item.id,
        price: item.price,
        quantity: item.quantity,
        name: item.name
      })),
      customer_details: customerDetails,
      callbacks: {
        finish: `${FRONTEND_URL}/orders`
      }
    };

    let snapToken;
    try {
      const transaction = await snap.createTransaction(parameter);
      snapToken = transaction.token;
    } catch (midtransError) {
      console.error("Midtrans transaction creation failed, rolling back locks...", midtransError);
      try {
        await PaymentService.removeLocksForOrder(productItems, orderId);
      } catch (rollbackError) {
        console.error("Failed to rollback locks:", rollbackError);
      }
      throw new Error(`Gagal membuat sesi pembayaran Midtrans: ${midtransError.message}`);
    }

    // 3. Create Order in Firestore WITH snapToken and userId
    try {
      const orderRef = db.collection('orders').doc(orderId);
      const merchantIds = [...new Set(items.map(item => item.merchantId).filter(Boolean))];

      await orderRef.set({
        orderId,
        userId: userId || null,
        items,
        total,
        customerDetails,
        snapToken,
        merchantIds,
        status: 'PENDING',
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    } catch (dbError) {
      console.error("Failed to save order to Firestore, rolling back locks...", dbError);
      try {
        await PaymentService.removeLocksForOrder(productItems, orderId);
      } catch (rollbackError) {
        console.error("Failed to rollback locks:", rollbackError);
      }
      throw new Error(`Gagal menyimpan data pesanan: ${dbError.message}`);
    }

    return { token: snapToken, orderId };
  }

  /**
   * Fetch orders for a specific user email
   */
  static async getOrdersByEmail(email) {
    if (!db) return [];
    
    const snapshot = await db.collection('orders')
      .where('customerDetails.email', '==', email)
      .get();
      
    const orders = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      orders.push({
        ...data,
        createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : null,
        updatedAt: data.updatedAt ? data.updatedAt.toDate().toISOString() : null,
      });
    });

    return orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  /**
   * Cancel an order in Midtrans and Firestore
   */
  static async cancelOrder(orderId) {
    if (!db) return false;
    
    try {
      // 1. Cancel in Midtrans
      try {
        await coreApi.transaction.cancel(orderId);
      } catch (midtransError) {
        console.warn("Midtrans cancel warning:", midtransError.message);
      }

      // 2. Update status in Firestore
      const orderRef = db.collection('orders').doc(orderId);
      const orderDoc = await orderRef.get();
      
      if (!orderDoc.exists) return false;
      const orderData = orderDoc.data();
      const currentStatus = orderData.status;
      
      const batch = db.batch();
      batch.update(orderRef, {
        status: 'FAILED',
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      // Kembalikan stok hanya jika sebelumnya pesanan sudah PAID
      if (currentStatus === 'PAID' && orderData.items && Array.isArray(orderData.items)) {
        for (const item of orderData.items) {
          if (item.id && item.merchantId && item.id !== "FEE-01") { // Hindari item fee
            const productRef = db.collection('products').doc(item.id);
            batch.update(productRef, {
              stock: admin.firestore.FieldValue.increment(item.quantity)
            });
          }
        }
      }

      await batch.commit();

      // Clean up locks!
      if (orderData.items) {
        await PaymentService.removeLocksForOrder(orderData.items, orderId);
      }

      return true;
    } catch (error) {
      console.error("Cancel Order Error:", error);
      throw error;
    }
  }

  /**
   * Handles the Midtrans Notification (Webhook)
   */
  static async processWebhookNotification(notificationBody) {
    const statusResponse = await snap.transaction.notification(notificationBody);
    
    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;
    
    let orderStatus = 'PENDING';

    if (transactionStatus == 'capture') {
        if (fraudStatus == 'challenge'){
            orderStatus = 'CHALLENGE';
        } else if (fraudStatus == 'accept'){
            orderStatus = 'PAID';
        }
    } else if (transactionStatus == 'settlement'){
        orderStatus = 'PAID';
    } else if (transactionStatus == 'cancel' || transactionStatus == 'deny' || transactionStatus == 'expire'){
        orderStatus = 'FAILED';
    } else if (transactionStatus == 'pending'){
        orderStatus = 'PENDING';
    }

    if (db) {
      const orderRef = db.collection('orders').doc(orderId);
      const orderDoc = await orderRef.get();
      
      if (!orderDoc.exists) return statusResponse;
      
      const orderData = orderDoc.data();
      const currentStatus = orderData.status;

      // Hindari downgrade: Jangan biarkan pesanan yang sudah PAID diubah kembali ke PENDING oleh webhook yang terlambat/out-of-order
      if (currentStatus === 'PAID' && orderStatus === 'PENDING') {
        console.log(`Order ${orderId} is already PAID. Ignoring stale PENDING webhook notification.`);
        return statusResponse;
      }

      console.log(`Order ${orderId} status updated to ${orderStatus}`);

      const batch = db.batch();
      
      batch.update(orderRef, {
        status: orderStatus,
        paymentDetails: statusResponse,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      // Jika transaksi gagal/expire/batal dari status PAID, kembalikan stok
      if (orderStatus === 'FAILED' && currentStatus === 'PAID' && orderData.items && Array.isArray(orderData.items)) {
        for (const item of orderData.items) {
          if (item.id && item.merchantId && item.id !== "FEE-01") {
            const productRef = db.collection('products').doc(item.id);
            batch.update(productRef, {
              stock: admin.firestore.FieldValue.increment(item.quantity)
            });
          }
        }
      }

      // SPLIT PAYMENT LOGIC & STOCK DEDUCTION: Baru kurangi stok saat transaksi menjadi PAID
      if (orderStatus === 'PAID' && currentStatus !== 'PAID' && orderData.items && Array.isArray(orderData.items)) {
        // 1. Kurangi stok produk secara resmi setelah pembayaran berhasil
        for (const item of orderData.items) {
          if (item.id && item.merchantId && item.id !== "FEE-01") {
            const productRef = db.collection('products').doc(item.id);
            batch.update(productRef, {
              stock: admin.firestore.FieldValue.increment(-item.quantity)
            });
          }
        }

        // 2. Tambahkan saldo ke dompet merchant
        const merchantEarnings = {};
        for (const item of orderData.items) {
          const mId = item.merchantId;
          if (mId) {
            if (!merchantEarnings[mId]) {
              merchantEarnings[mId] = 0;
            }
            merchantEarnings[mId] += (item.price * item.quantity);
          }
        }

        for (let [mId, earning] of Object.entries(merchantEarnings)) {
          let finalEarning = earning - 500;
          if (finalEarning < 0) finalEarning = 0;

          const walletRef = db.collection('wallets').doc(mId);
          batch.set(walletRef, {
             merchantId: mId,
             balance: admin.firestore.FieldValue.increment(finalEarning),
             updatedAt: admin.firestore.FieldValue.serverTimestamp()
          }, { merge: true });
        }
      }

      await batch.commit();

      // Clean up locks on transition to PAID or FAILED
      if ((orderStatus === 'PAID' && currentStatus !== 'PAID') || (orderStatus === 'FAILED' && currentStatus === 'PENDING') || (orderStatus === 'FAILED' && currentStatus === 'PAID')) {
        if (orderData.items) {
          await PaymentService.removeLocksForOrder(orderData.items, orderId);
        }
      }
    }

    return statusResponse;
  }

  /**
   * Confirm Payment from client (fallback for local dev when webhook cannot reach localhost)
   */
  static async confirmPayment(orderId, paymentDetails = {}) {
    if (!db) return false;
    
    const orderRef = db.collection('orders').doc(orderId);
    const orderDoc = await orderRef.get();
    
    if (!orderDoc.exists) return false;
    
    const orderData = orderDoc.data();
    
    if (orderData.status !== 'PAID') {
      const batch = db.batch();
      
      batch.update(orderRef, {
        status: 'PAID',
        paymentDetails,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      if (orderData.items && Array.isArray(orderData.items)) {
        for (const item of orderData.items) {
          if (item.id && item.merchantId && item.id !== "FEE-01") {
            const productRef = db.collection('products').doc(item.id);
            batch.update(productRef, {
              stock: admin.firestore.FieldValue.increment(-item.quantity)
            });
          }
        }

        const merchantEarnings = {};
        for (const item of orderData.items) {
          const mId = item.merchantId;
          if (mId) {
            if (!merchantEarnings[mId]) {
              merchantEarnings[mId] = 0;
            }
            merchantEarnings[mId] += (item.price * item.quantity);
          }
        }

        for (let [mId, earning] of Object.entries(merchantEarnings)) {
          let finalEarning = earning - 500;
          if (finalEarning < 0) finalEarning = 0;

          const walletRef = db.collection('wallets').doc(mId);
          batch.set(walletRef, {
             merchantId: mId,
             balance: admin.firestore.FieldValue.increment(finalEarning),
             updatedAt: admin.firestore.FieldValue.serverTimestamp()
          }, { merge: true });
        }
      }

      await batch.commit();

      // Clean up locks!
      if (orderData.items) {
        await PaymentService.removeLocksForOrder(orderData.items, orderId);
      }
      console.log(`Order ${orderId} status successfully updated to PAID via client confirmation.`);
    }

    return true;
  }

  /**
   * Helper to clean up locks for a given orderId on all items in the order
   */
  static async removeLocksForOrder(items, orderId) {
    if (!db || !items || !Array.isArray(items)) return;

    const productItems = items.filter(item => item.id && item.merchantId && item.id !== "FEE-01");
    if (productItems.length === 0) return;

    try {
      await db.runTransaction(async (transaction) => {
        const productDocs = await Promise.all(
          productItems.map(item => transaction.get(db.collection('products').doc(item.id)))
        );

        const nowMs = Date.now();

        productDocs.forEach((doc) => {
          if (!doc.exists) return;

          const data = doc.data();
          const locks = data.locks || [];

          // Filter out locks for this orderId and also any expired locks
          const updatedLocks = locks.filter(lock => {
            let expTime = 0;
            if (lock.expiresAt) {
              if (typeof lock.expiresAt.toDate === 'function') {
                expTime = lock.expiresAt.toDate().getTime();
              } else {
                expTime = new Date(lock.expiresAt).getTime();
              }
            }
            const isExpired = expTime <= nowMs;
            const isCurrentOrder = lock.orderId === orderId;
            return !isExpired && !isCurrentOrder;
          });

          transaction.update(doc.ref, {
            locks: updatedLocks,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          });
        });
      });
      console.log(`[Locks] Successfully cleaned up locks for order ${orderId}`);
    } catch (error) {
      console.error(`[Locks] Error removing locks for order ${orderId}:`, error);
    }
  }
}
