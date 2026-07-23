import { snap, coreApi } from '../../config/midtrans.js';
import { db, admin } from '../../config/firebase.js';

export class PaymentService {
  /**
   * Creates a pending order in Firestore and generates a Snap Token
   */
  static async createCheckoutSession(items, total, customerDetails, userId) {
    const orderId = `ORDER-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

    // 1. Prepare Midtrans Transaction Data
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

    // 2. Create Transaction Token first
    const transaction = await snap.createTransaction(parameter);
    const snapToken = transaction.token;

    // 3. Create Order in Firestore WITH snapToken and userId (stok BELUM dikurangi saat PENDING)
    if (db) {
      const batch = db.batch();
      const orderRef = db.collection('orders').doc(orderId);
      
      // Extract unique merchantIds from items
      const merchantIds = [...new Set(items.map(item => item.merchantId).filter(Boolean))];

      batch.set(orderRef, {
        orderId,
        userId: userId || null,
        items,
        total,
        customerDetails,
        snapToken, // Simpan token agar bisa dibayar ulang
        merchantIds, // Tambahkan merchantIds agar mudah diquery
        status: 'PENDING',
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

      await batch.commit();
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
      
      const batch = db.batch();
      batch.update(orderRef, {
        status: 'FAILED',
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      // Kembalikan stok hanya jika sebelumnya pesanan sudah PAID
      if (orderDoc.exists) {
        const orderData = orderDoc.data();
        if (orderData.status === 'PAID' && orderData.items && Array.isArray(orderData.items)) {
          for (const item of orderData.items) {
            if (item.id && item.merchantId) { // Hindari item fee
              const productRef = db.collection('products').doc(item.id);
              batch.update(productRef, {
                stock: admin.firestore.FieldValue.increment(item.quantity)
              });
            }
          }
        }
      }

      await batch.commit();

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
          if (item.id && item.merchantId) {
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
          if (item.id && item.merchantId) {
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
          if (item.id && item.merchantId) {
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
      console.log(`Order ${orderId} status successfully updated to PAID via client confirmation.`);
    }

    return true;
  }
}
