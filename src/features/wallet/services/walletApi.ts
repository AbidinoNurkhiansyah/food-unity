const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const walletApi = {
  /**
   * Fetch merchant's wallet balance
   */
  getBalance: async (merchantId: string) => {
    try {
      const response = await fetch(`${API_URL}/api/wallet/balance?merchantId=${merchantId}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch balance');
      }
      return await response.json();
    } catch (error) {
      console.error('walletApi.getBalance Error:', error);
      throw error;
    }
  },

  /**
   * Request withdrawal
   */
  withdrawBalance: async (merchantId: string, amount: number) => {
    try {
      const response = await fetch(`${API_URL}/api/wallet/withdraw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ merchantId, amount }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to withdraw balance');
      }
      return await response.json();
    } catch (error) {
      console.error('walletApi.withdrawBalance Error:', error);
      throw error;
    }
  }
};
