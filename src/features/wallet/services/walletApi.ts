import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

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
      const response = await axios.get(`${API_URL}/api/wallet/balance?merchantId=${merchantId}`, {
        headers
      });
      return response.data;
    } catch (error: any) {
      console.error('walletApi.getBalance Error:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch balance');
    }
  },

  /**
   * Fetch wallet history
   */
  getHistory: async (merchantId: string, token?: string) => {
    try {
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const response = await axios.get(`${API_URL}/api/wallet/history?merchantId=${merchantId}`, {
        headers
      });
      return response.data;
    } catch (error: any) {
      console.error('walletApi.getHistory Error:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch history');
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
      const response = await axios.post(`${API_URL}/api/wallet/withdraw`, 
        { merchantId, amount },
        { headers }
      );
      
      return response.data;
    } catch (error: any) {
      console.error('walletApi.withdrawBalance Error:', error);
      throw new Error(error.response?.data?.error || 'Failed to withdraw balance');
    }
  }
};
