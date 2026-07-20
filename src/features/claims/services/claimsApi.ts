import { db } from '@/config/firebase';
import { collection, query, where, getDocs, doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  merchantId: string;
}

export interface Claim {
  orderId: string;
  items: OrderItem[];
  total: number;
  status: 'PENDING' | 'PAID' | 'FAILED' | 'COMPLETED';
  customerDetails: {
    first_name: string;
    email: string;
    phone?: string;
  };
  merchantIds?: string[];
  createdAt: any;
  updatedAt?: any;
}

export const claimsApi = {
  getMerchantClaims: async (merchantId: string): Promise<Claim[]> => {
    try {
      const q = query(
        collection(db, 'orders'),
        where('merchantIds', 'array-contains', merchantId)
      );
      
      const querySnapshot = await getDocs(q);
      const claims: Claim[] = [];
      
      querySnapshot.forEach((doc) => {
        claims.push(doc.data() as Claim);
      });
      
      // Sort in memory by createdAt descending
      return claims.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
        return dateB - dateA;
      });
    } catch (error) {
      console.error("Error fetching merchant claims:", error);
      throw error;
    }
  },

  getClaimById: async (orderId: string): Promise<Claim | null> => {
    try {
      const docRef = doc(db, 'orders', orderId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as Claim;
      }
      return null;
    } catch (error) {
      console.error("Error fetching claim by id:", error);
      throw error;
    }
  },

  completeClaim: async (orderId: string): Promise<void> => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status: 'COMPLETED',
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error completing claim:", error);
      throw error;
    }
  }
};
