const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const walletApi = {
  /**
   * Fetch merchant's wallet balance
   */
  getBalance: async (merchantId: string, token?: string) => {
    try {
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const response = await fetch(`${API_URL}/api/wallet/balance?merchantId=${merchantId}`, {
        headers
      });
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
  withdrawBalance: async (merchantId: string, amount: number, token?: string) => {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const response = await fetch(`${API_URL}/api/wallet/withdraw`, {
        method: 'POST',
        headers,
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
