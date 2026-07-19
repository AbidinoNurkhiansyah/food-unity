import { WalletService } from './wallet.service.js';

export class WalletController {
  
  /**
   * Get wallet balance
   * Example query: /api/wallet/balance?merchantId=USER_UID
   */
  static async getBalance(req, res) {
    try {
      const { merchantId } = req.query;
      if (!merchantId) {
        return res.status(400).json({ error: "merchantId query parameter is required" });
      }
      
      const balanceData = await WalletService.getBalance(merchantId);
      res.json(balanceData);
    } catch (error) {
      console.error("Get Balance Error:", error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Request withdrawal
   * Body: { merchantId: "USER_UID", amount: 50000 }
   */
  static async withdraw(req, res) {
    try {
      const { merchantId, amount } = req.body;
      if (!merchantId || !amount) {
        return res.status(400).json({ error: "merchantId and amount are required" });
      }
      
      const parsedAmount = Number(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
         return res.status(400).json({ error: "amount must be a positive number" });
      }

      const result = await WalletService.withdrawBalance(merchantId, parsedAmount);
      res.json(result);
    } catch (error) {
      console.error("Withdrawal Error:", error);
      res.status(400).json({ error: error.message });
    }
  }
}
