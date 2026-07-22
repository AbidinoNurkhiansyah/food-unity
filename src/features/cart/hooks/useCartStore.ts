import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';
import type { Product } from '@/features/products/types';

export const isProductExpired = (product: Product): boolean => {
  if (product.status === "expired") return true;
  if (product.pickupDeadline) {
    const deadlineTime = new Date(product.pickupDeadline).getTime();
    const nowTime = new Date().getTime();
    return deadlineTime <= nowTime;
  }
  return false;
};

export interface CartItem {
  product: Product;
  quantity: number;
  selected?: boolean;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  toggleSelectItem: (productId: string) => void;
  toggleSelectAll: (selected: boolean) => void;
  clearCart: () => void;
  clearExpiredItems: () => void;
  removeSelectedItems: () => void;
  getSelectedItems: () => CartItem[];
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
            const isExpired = isProductExpired(existingItem.product);
            const newQuantity = isExpired ? quantity : existingItem.quantity + quantity;
            
            if (newQuantity > product.stock) {
              toast.error("Maaf, jumlah pesanan melebihi sisa stok!");
              return state;
            }
            toast.success("Produk ditambahkan ke keranjang");
            return {
              items: state.items.map((item) =>
                item.product.id === product.id
                  ? { ...item, product, quantity: newQuantity, selected: true }
                  : item
              ),
            };
          }
          
          if (quantity > product.stock) {
            toast.error("Maaf, jumlah pesanan melebihi sisa stok!");
            return state;
          }
          toast.success("Produk ditambahkan ke keranjang");
          return { items: [...state.items, { product, quantity, selected: true }] };
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
      toggleSelectItem: (productId) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId
              ? { ...item, selected: !(item.selected ?? true) }
              : item
          ),
        })),
      toggleSelectAll: (selected) =>
        set((state) => ({
          items: state.items.map((item) =>
            isProductExpired(item.product) ? item : { ...item, selected }
          ),
        })),
      clearCart: () => set({ items: [] }),
      clearExpiredItems: () =>
        set((state) => ({
          items: state.items.filter((item) => !isProductExpired(item.product)),
        })),
      removeSelectedItems: () =>
        set((state) => ({
          items: state.items.filter(
            (item) => !((item.selected ?? true) && !isProductExpired(item.product))
          ),
        })),
      getSelectedItems: () => {
        return get().items.filter(
          (item) => (item.selected ?? true) && !isProductExpired(item.product)
        );
      },
      getTotalItems: () => {
        return get()
          .getSelectedItems()
          .reduce((total, item) => total + item.quantity, 0);
      },
      getTotalPrice: () => {
        return get()
          .getSelectedItems()
          .reduce((total, item) => {
            const price = item.product.isDonation
              ? 0
              : item.product.discountPrice || item.product.originalPrice;
            return total + price * item.quantity;
          }, 0);
      },
    }),
    {
      name: 'foodunity-cart-storage',
    }
  )
);

