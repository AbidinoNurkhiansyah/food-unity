import { create } from 'zustand';
import type { Product } from '@/features/products/types';

interface ChatStoreState {
  isOpen: boolean;
  activeChatId: string | null;
  activeProduct: Product | null;
  openChatWithProduct: (product: Product, currentUserId?: string) => void;
  openChatWithRoom: (chatId: string) => void;
  closeChat: () => void;
  toggleChat: () => void;
  setChatId: (chatId: string | null) => void;
}

export const useChatStore = create<ChatStoreState>((set) => ({
  isOpen: false,
  activeChatId: null,
  activeProduct: null,
  openChatWithProduct: (product, currentUserId) => {
    const merchantId = product.merchantId || `merchant_${product.merchantName.replace(/\s+/g, '_')}`;
    const calculatedChatId = currentUserId ? `${currentUserId}_${merchantId}` : null;
    set({
      isOpen: true,
      activeProduct: product,
      activeChatId: calculatedChatId,
    });
  },
  openChatWithRoom: (chatId) =>
    set({
      isOpen: true,
      activeChatId: chatId,
      activeProduct: null,
    }),
  closeChat: () =>
    set({
      isOpen: false,
      activeProduct: null,
      activeChatId: null,
    }),
  toggleChat: () =>
    set((state) => ({
      isOpen: !state.isOpen,
    })),
  setChatId: (chatId) => set({ activeChatId: chatId }),
}));
