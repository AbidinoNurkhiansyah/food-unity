import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';
import type { Product } from '@/features/products/types';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity) =>
        set((state) => {
          const existingItem = state.items.find((item) => item.product.id === product.id);
          if (existingItem) {
            const newQuantity = existingItem.quantity + quantity;
            if (newQuantity > product.stock) {
              toast.error("Maaf, jumlah pesanan melebihi sisa stok!");
              return state;
            }
            toast.success("Produk ditambahkan ke keranjang");
            return {
              items: state.items.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: newQuantity }
                  : item
              ),
            };
          }
          
          if (quantity > product.stock) {
            toast.error("Maaf, jumlah pesanan melebihi sisa stok!");
            return state;
          }
          toast.success("Produk ditambahkan ke keranjang");
          return { items: [...state.items, { product, quantity }] };
        }),
      updateQuantity: (productId, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter((item) => item.product.id !== productId),
            };
          }

          const existingItem = state.items.find((item) => item.product.id === productId);
          if (existingItem && quantity > existingItem.product.stock) {
            toast.error("Maaf, jumlah pesanan melebihi sisa stok!");
            return state;
          }

          return {
            items: state.items.map((item) =>
              item.product.id === productId
                ? { ...item, quantity }
                : item
            ),
          };
        }),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        })),
      clearCart: () => set({ items: [] }),
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          const price = item.product.isDonation ? 0 : (item.product.discountPrice || item.product.originalPrice);
          return total + (price * item.quantity);
        }, 0);
      }
    }),
    {
      name: 'foodunity-cart-storage',
    }
  )
);
