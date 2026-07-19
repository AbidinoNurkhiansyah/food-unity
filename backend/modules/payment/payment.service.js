import { snap, coreApi } from '../../config/midtrans.js';
import { db, admin } from '../../config/firebase.js';

export class PaymentService {
  /**
   * Creates a pending order in Firestore and generates a Snap Token
   */
  static async createCheckoutSession(items, total, customerDetails) {
    const orderId = `ORDER-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

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
      customer_details: customerDetails
    };

    // 2. Create Transaction Token first
    const transaction = await snap.createTransaction(parameter);
    const snapToken = transaction.token;

    // 3. Create Order in Firestore WITH snapToken
    if (db) {
      const batch = db.batch();
      const orderRef = db.collection('orders').doc(orderId);
      
      // Extract unique merchantIds from items
      const merchantIds = [...new Set(items.map(item => item.merchantId).filter(Boolean))];

      batch.set(orderRef, {
        orderId,
        items,
        total,
        customerDetails,
        snapToken, // Simpan token agar bisa dibayar ulang
        merchantIds, // Tambahkan merchantIds agar mudah diquery
        status: 'PENDING',
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

      // Kurangi stok (Soft Reservation)
      for (const item of items) {
        if (item.id && item.merchantId) { // Hindari item fee
          const productRef = db.collection('products').doc(item.id);
          batch.update(productRef, {
            stock: admin.firestore.FieldValue.increment(-item.quantity)
          });
        }
      }

      await batch.commit();
    }
    
    return { token: snapToken, orderId };
  }

  /**
   * Fetch orders for a specific user email
   */
  static async getOrdersByEmail(email) {
    if (!db) return [];
    
    // Karena kita tidak memiliki index untuk (customerDetails.email + createdAt DESC),
    // kita fetch data secara sederhana dan urutkan di dalam memori (Node.js).
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

    // Urutkan dari yang paling baru
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
        // Abaikan jika error 404 (transaksi tidak ditemukan/sudah kedaluwarsa di midtrans)
        console.warn("Midtrans cancel warning:", midtransError.message);
      }

      // 2. Update status in Firestore dan kembalikan stok
      const orderRef = db.collection('orders').doc(orderId);
      const orderDoc = await orderRef.get();
      
      const batch = db.batch();
      batch.update(orderRef, {
        status: 'FAILED',
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      if (orderDoc.exists) {
        const orderData = orderDoc.data();
        if (orderData.status !== 'FAILED' && orderData.items && Array.isArray(orderData.items)) {
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
    // Verify & parse the notification via Midtrans SDK
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

    console.log(`Order ${orderId} status updated to ${orderStatus}`);

    // Update status in Firestore
    if (db) {
      const orderRef = db.collection('orders').doc(orderId);
      const orderDoc = await orderRef.get();
      const batch = db.batch();
      
      batch.update(orderRef, {
        status: orderStatus,
        paymentDetails: statusResponse,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      if (orderDoc.exists) {
        const orderData = orderDoc.data();
        const currentStatus = orderData.status;

        // Jika transaksi gagal/expire/batal, kembalikan stok
        if (orderStatus === 'FAILED' && currentStatus !== 'FAILED' && orderData.items && Array.isArray(orderData.items)) {
          for (const item of orderData.items) {
            if (item.id && item.merchantId) { // Hindari item fee
              const productRef = db.collection('products').doc(item.id);
              batch.update(productRef, {
                stock: admin.firestore.FieldValue.increment(item.quantity)
              });
            }
          }
        }

        // SPLIT PAYMENT LOGIC: Jika transaksi sukses/PAID, tambah saldo ke dompet merchant
        if (orderStatus === 'PAID' && currentStatus !== 'PAID' && orderData.items && Array.isArray(orderData.items)) {
          // Kelompokkan total pendapatan per merchant
          const merchantEarnings = {};
          for (const item of orderData.items) {
            const mId = item.merchantId;
            if (mId) {
              if (!merchantEarnings[mId]) {
                merchantEarnings[mId] = 0;
              }
              // Harga diskon (item.price) * quantity
              merchantEarnings[mId] += (item.price * item.quantity);
            }
          }

          // Tambahkan ke koleksi wallets
          for (let [mId, earning] of Object.entries(merchantEarnings)) {
            // Potongan platform fee sebesar Rp 500 per merchant per transaksi
            let finalEarning = earning - 500;
            if (finalEarning < 0) finalEarning = 0; // Hindari minus

            const walletRef = db.collection('wallets').doc(mId);
            batch.set(walletRef, {
               merchantId: mId,
               balance: admin.firestore.FieldValue.increment(finalEarning),
               updatedAt: admin.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
          }
        }
      }

      await batch.commit();
    }

    return statusResponse;
  }
}
