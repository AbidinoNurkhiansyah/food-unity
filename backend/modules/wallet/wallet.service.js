import { db, admin } from '../../config/firebase.js';

export class WalletService {
  /**
   * Fetch wallet balance for a merchant
   */
  static async getBalance(merchantId) {
    if (!db) throw new Error("Firebase DB not initialized");

    const walletRef = db.collection('wallets').doc(merchantId);
    const doc = await walletRef.get();
    
    if (!doc.exists) {
      // Wallet hasn't been created yet (no sales), return 0
      return { merchantId, balance: 0 };
    }
    
    return doc.data();
  }

  /**
   * Simulate withdrawal of funds
   */
  static async withdrawBalance(merchantId, amount) {
    if (!db) throw new Error("Firebase DB not initialized");
    if (amount <= 0) throw new Error("Invalid withdrawal amount");

    const walletRef = db.collection('wallets').doc(merchantId);
    
    // We use a transaction to safely read and update the balance
    return await db.runTransaction(async (transaction) => {
      const doc = await transaction.get(walletRef);
      
      if (!doc.exists) {
        throw new Error("Wallet not found or zero balance");
      }
      
      const currentBalance = doc.data().balance || 0;
      
      if (currentBalance < amount) {
        throw new Error(`Insufficient balance. Current balance is ${currentBalance}`);
      }
      
      // Deduct balance
      transaction.update(walletRef, {
        balance: admin.firestore.FieldValue.increment(-amount),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      // Record the withdrawal history
      const withdrawalRef = db.collection('withdrawals').doc();
      transaction.set(withdrawalRef, {
        merchantId,
        amount,
        status: 'SUCCESS', // Simulated instant success
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      return {
        status: 'success',
        withdrawalId: withdrawalRef.id,
        withdrawnAmount: amount,
        remainingBalance: currentBalance - amount
      };
    });
  }
}
