import { db } from '@/config/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc,
  deleteDoc,
  doc,
  query, 
  where, 
  serverTimestamp 
} from 'firebase/firestore';
import type { ProductFormValues, Product } from '../types';

const PRODUCTS_COLLECTION = 'products';

export const productApi = {
  createProduct: async (
    data: ProductFormValues, 
    merchantId: string, 
    merchantName: string,
    imageUrl?: string
  ): Promise<string> => {
    try {
      const productData = {
        ...data,
        merchantId,
        merchantName,
        imageUrl: imageUrl || null,
        status: 'active',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      
      const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), productData);
      return docRef.id;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  getMerchantProducts: async (merchantId: string): Promise<Product[]> => {
    try {
      const q = query(
        collection(db, PRODUCTS_COLLECTION),
        where('merchantId', '==', merchantId)
      );
      
      const querySnapshot = await getDocs(q);
      const products: Product[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        products.push({
          id: doc.id,
          ...data,
          // Convert Firestore Timestamp to ISO string if needed for UI
          createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
          updatedAt: data.updatedAt?.toDate().toISOString() || new Date().toISOString(),
        } as Product);
      });
      
      // Sort products by createdAt descending client-side
      products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      return products;
    } catch (error) {
      console.error('Error fetching merchant products:', error);
      throw error;
    }
  },

  getAllProducts: async (): Promise<Product[]> => {
    try {
      const q = query(
        collection(db, PRODUCTS_COLLECTION),
        where('status', '==', 'active')
      );
      
      const querySnapshot = await getDocs(q);
      const products: Product[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const product = {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
          updatedAt: data.updatedAt?.toDate().toISOString() || new Date().toISOString(),
        } as Product;
        
        // Filter produk yang stoknya habis atau sudah lewat batas waktu (expired)
        const now = new Date().toISOString();
        if (product.stock > 0 && product.pickupDeadline > now) {
          products.push(product);
        }
      });
      
      products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      return products;
    } catch (error) {
      console.error('Error fetching all products:', error);
      throw error;
    }
  },

  updateProduct: async (
    productId: string,
    data: Partial<ProductFormValues>,
    imageUrl?: string
  ): Promise<void> => {
    try {
      const productRef = doc(db, PRODUCTS_COLLECTION, productId);
      const updateData: any = {
        ...data,
        updatedAt: serverTimestamp(),
      };
      
      if (imageUrl !== undefined) {
        updateData.imageUrl = imageUrl || null;
      }

      await updateDoc(productRef, updateData);
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  deleteProduct: async (productId: string): Promise<void> => {
    try {
      const productRef = doc(db, PRODUCTS_COLLECTION, productId);
      await deleteDoc(productRef);
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }
};
