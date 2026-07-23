import { db } from '@/config/firebase';
import {
  collection,
  doc,
  setDoc,
  addDoc,
  onSnapshot,
  query,
  where,
  serverTimestamp,
  getDoc,
} from 'firebase/firestore';
import type { ChatRoom, ChatMessage } from '../types';
import type { Product } from '@/features/products/types';

export const chatService = {
  /**
   * Get or create a chat room between consumer and merchant
   */
  getOrCreateChatRoom: async (
    consumerId: string,
    consumerName: string,
    consumerEmail: string,
    merchantId: string,
    merchantName: string,
    product?: Product | null
  ): Promise<string> => {
    const safeConsumerId = consumerId || 'anonymous';
    const safeMerchantId = merchantId || 'merchant';
    const chatId = `${safeConsumerId}_${safeMerchantId}`;
    const chatRef = doc(db, 'chats', chatId);

    const productPayload = (product && product.id)
      ? {
          id: product.id,
          title: product.title || 'Produk',
          imageUrl: product.imageUrl || '',
          price: product.discountPrice ?? product.originalPrice ?? 0,
        }
      : null;

    const snap = await getDoc(chatRef);

    if (!snap.exists()) {
      const newRoom: Record<string, any> = {
        id: chatId,
        consumerId: safeConsumerId,
        consumerName: consumerName || 'Konsumen',
        consumerEmail: consumerEmail || '',
        merchantId: safeMerchantId,
        merchantName: merchantName || 'Mitra FoodUnity',
        lastMessage: product ? `Tanya tentang: ${product.title || 'Produk'}` : 'Halo!',
        lastMessageSenderId: safeConsumerId,
        updatedAt: serverTimestamp(),
        unreadConsumer: false,
        unreadMerchant: true,
      };

      if (productPayload) {
        newRoom.activeProduct = productPayload;
      }

      await setDoc(chatRef, newRoom);
    } else if (productPayload) {
      await setDoc(
        chatRef,
        {
          activeProduct: productPayload,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    }

    return chatId;
  },

  /**
   * Subscribe to user's chat rooms (real-time)
   */
  subscribeUserChats: (
    userId: string,
    role: 'consumer' | 'merchant',
    callback: (chats: ChatRoom[]) => void
  ) => {
    if (!userId) {
      callback([]);
      return () => {};
    }

    const fieldName = role === 'consumer' ? 'consumerId' : 'merchantId';
    const q = query(
      collection(db, 'chats'),
      where(fieldName, '==', userId)
    );

    return onSnapshot(
      q,
      (snapshot) => {
        const chats: ChatRoom[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            consumerId: data.consumerId || '',
            consumerName: data.consumerName || 'Konsumen',
            consumerEmail: data.consumerEmail || '',
            merchantId: data.merchantId || '',
            merchantName: data.merchantName || 'Mitra FoodUnity',
            lastMessage: data.lastMessage || '',
            lastMessageSenderId: data.lastMessageSenderId || '',
            updatedAt: data.updatedAt,
            unreadConsumer: data.unreadConsumer || false,
            unreadMerchant: data.unreadMerchant || false,
            activeProduct: data.activeProduct || undefined,
          };
        });

        // Sort descending by updatedAt client-side
        chats.sort((a, b) => {
          const getMillis = (val: any) => {
            if (!val) return Date.now();
            if (typeof val.toMillis === 'function') return val.toMillis();
            if (val instanceof Date) return val.getTime();
            return new Date(val).getTime() || 0;
          };
          return getMillis(b.updatedAt) - getMillis(a.updatedAt);
        });

        callback(chats);
      },
      (error) => {
        console.error('Error listening to chat rooms:', error);
        callback([]);
      }
    );
  },

  /**
   * Subscribe to messages in a specific chat room (real-time)
   */
  subscribeMessages: (
    chatId: string,
    callback: (messages: ChatMessage[]) => void
  ) => {
    if (!chatId) {
      callback([]);
      return () => {};
    }

    const messagesRef = collection(db, 'chats', chatId, 'messages');

    return onSnapshot(
      messagesRef,
      (snapshot) => {
        const messages: ChatMessage[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            chatId,
            senderId: data.senderId || '',
            senderName: data.senderName || '',
            senderRole: data.senderRole || 'consumer',
            text: data.text || '',
            productId: data.productId || undefined,
            productTitle: data.productTitle || undefined,
            productImage: data.productImage || undefined,
            createdAt: data.createdAt,
          };
        });

        // Sort ascending by createdAt client-side
        messages.sort((a, b) => {
          const getMillis = (val: any) => {
            if (!val) return Date.now();
            if (typeof val.toMillis === 'function') return val.toMillis();
            if (val instanceof Date) return val.getTime();
            return new Date(val).getTime() || Date.now();
          };
          return getMillis(a.createdAt) - getMillis(b.createdAt);
        });

        callback(messages);
      },
      (error) => {
        console.error('Error listening to messages:', error);
        callback([]);
      }
    );
  },

  /**
   * Send a message in a chat room
   */
  sendMessage: async (params: {
    chatId: string;
    senderId: string;
    senderName: string;
    senderRole: 'consumer' | 'merchant';
    text: string;
    product?: {
      id?: string;
      title?: string;
      imageUrl?: string;
    } | null;
  }) => {
    const { chatId, senderId, senderName, senderRole, text, product } = params;

    if (!chatId) throw new Error('Chat ID tidak valid');
    if (!senderId) throw new Error('Pengirim tidak terotentikasi');

    const [consumerId, merchantId] = chatId.split('_');

    // 1. Update/create parent chat room summary
    const chatRef = doc(db, 'chats', chatId);
    const roomSummary: Record<string, any> = {
      id: chatId,
      consumerId: consumerId || senderId,
      merchantId: merchantId || '',
      lastMessage: text || '',
      lastMessageSenderId: senderId,
      updatedAt: serverTimestamp(),
      unreadConsumer: senderRole === 'merchant',
      unreadMerchant: senderRole === 'consumer',
    };

    await setDoc(chatRef, roomSummary, { merge: true });

    // 2. Add message document to subcollection
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const messageData: Record<string, any> = {
      chatId,
      senderId: senderId || '',
      senderName: senderName || 'User',
      senderRole: senderRole || 'consumer',
      text: text || '',
      createdAt: serverTimestamp(),
    };

    if (product && product.id) {
      messageData.productId = product.id;
      if (product.title) messageData.productTitle = product.title;
      if (product.imageUrl) messageData.productImage = product.imageUrl;
    }

    await addDoc(messagesRef, messageData);
  },

  /**
   * Mark room as read
   */
  markAsRead: async (chatId: string, role: 'consumer' | 'merchant') => {
    if (!chatId) return;
    try {
      const chatRef = doc(db, 'chats', chatId);
      const updateData = role === 'consumer' ? { unreadConsumer: false } : { unreadMerchant: false };
      await setDoc(chatRef, updateData, { merge: true });
    } catch (err) {
      console.error('Error marking chat read:', err);
    }
  },
};
