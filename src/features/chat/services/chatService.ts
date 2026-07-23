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

// In-memory cache for user & merchant account names to avoid redundant Firestore lookups
const userNamesCache: Record<string, string> = {};
const merchantNamesCache: Record<string, string> = {};

/**
 * Helper to resolve actual consumer account name from Firestore users collection
 */
const resolveConsumerName = async (
  userId: string,
  fallbackName?: string,
  email?: string
): Promise<string> => {
  if (
    fallbackName &&
    fallbackName !== 'Konsumen' &&
    fallbackName !== 'Customer Account' &&
    fallbackName !== 'User' &&
    !fallbackName.startsWith('User (')
  ) {
    return fallbackName;
  }

  if (userId) {
    if (userNamesCache[userId]) {
      return userNamesCache[userId];
    }

    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const data = userDoc.data();
        const resolved =
          data.name ||
          data.displayName ||
          data.email?.split('@')[0] ||
          `User (${userId.slice(0, 6)})`;

        userNamesCache[userId] = resolved;
        return resolved;
      }
    } catch (err) {
      console.warn('Error fetching user profile for chat:', err);
    }
  }

  if (email) {
    const resolved = email.split('@')[0];
    if (userId) userNamesCache[userId] = resolved;
    return resolved;
  }

  return userId ? `User (${userId.slice(0, 6)})` : 'Customer Account';
};

/**
 * Helper to resolve actual merchant store/account name from Firestore users collection
 */
const resolveMerchantName = async (
  merchantId: string,
  fallbackName?: string
): Promise<string> => {
  if (
    fallbackName &&
    fallbackName !== 'Merchant Partner' &&
    fallbackName !== 'Mitra Merchant' &&
    fallbackName !== 'Mitra FoodUnity' &&
    fallbackName !== 'Mitra' &&
    fallbackName !== 'Merchant'
  ) {
    return fallbackName;
  }

  if (merchantId) {
    if (merchantNamesCache[merchantId]) {
      return merchantNamesCache[merchantId];
    }

    try {
      const userDoc = await getDoc(doc(db, 'users', merchantId));
      if (userDoc.exists()) {
        const data = userDoc.data();
        const resolved =
          data.profile?.storeName ||
          data.name ||
          data.displayName ||
          data.email?.split('@')[0] ||
          'Merchant Partner';

        merchantNamesCache[merchantId] = resolved;
        return resolved;
      }
    } catch (err) {
      console.warn('Error fetching merchant profile for chat:', err);
    }
  }

  return fallbackName || 'Merchant Partner';
};

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

    const resolvedConsumerName = await resolveConsumerName(
      safeConsumerId,
      consumerName,
      consumerEmail
    );
    const resolvedMerchantName = await resolveMerchantName(
      safeMerchantId,
      merchantName
    );

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
        consumerName: resolvedConsumerName,
        consumerEmail: consumerEmail || '',
        merchantId: safeMerchantId,
        merchantName: resolvedMerchantName,
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
    } else {
      const updatePayload: Record<string, any> = {
        consumerName: resolvedConsumerName,
        merchantName: resolvedMerchantName,
        updatedAt: serverTimestamp(),
      };
      if (consumerEmail) updatePayload.consumerEmail = consumerEmail;
      if (productPayload) updatePayload.activeProduct = productPayload;

      await setDoc(chatRef, updatePayload, { merge: true });
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
      async (snapshot) => {
        const chatsPromises = snapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();
          const rawConsumerName = data.consumerName;
          const rawMerchantName = data.merchantName;
          const consumerId = data.consumerId || '';
          const merchantId = data.merchantId || '';

          const resolvedConsumer = await resolveConsumerName(
            consumerId,
            rawConsumerName,
            data.consumerEmail
          );
          const resolvedMerchant = await resolveMerchantName(
            merchantId,
            rawMerchantName
          );

          // Update Firestore room document if any name was previously generic
          const updatePayload: Record<string, any> = {};
          if (resolvedConsumer !== rawConsumerName) updatePayload.consumerName = resolvedConsumer;
          if (resolvedMerchant !== rawMerchantName) updatePayload.merchantName = resolvedMerchant;

          if (Object.keys(updatePayload).length > 0) {
            setDoc(docSnap.ref, updatePayload, { merge: true }).catch(() => {});
          }

          return {
            id: docSnap.id,
            consumerId,
            consumerName: resolvedConsumer,
            consumerEmail: data.consumerEmail || '',
            merchantId,
            merchantName: resolvedMerchant,
            lastMessage: data.lastMessage || '',
            lastMessageSenderId: data.lastMessageSenderId || '',
            updatedAt: data.updatedAt,
            unreadConsumer: data.unreadConsumer || false,
            unreadMerchant: data.unreadMerchant || false,
            activeProduct: data.activeProduct || undefined,
          };
        });

        const chats = await Promise.all(chatsPromises);

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

    let resolvedSenderName = senderName;
    if (senderRole === 'consumer') {
      resolvedSenderName = await resolveConsumerName(senderId, senderName);
    } else if (senderRole === 'merchant') {
      resolvedSenderName = await resolveMerchantName(senderId, senderName);
    }

    // 1. Update/create parent chat room summary
    const chatRef = doc(db, 'chats', chatId);
    const roomSummary: Record<string, any> = {
      id: chatId,
      consumerId: consumerId || '',
      merchantId: merchantId || '',
      lastMessage: text || '',
      lastMessageSenderId: senderId,
      updatedAt: serverTimestamp(),
      unreadConsumer: senderRole === 'merchant',
      unreadMerchant: senderRole === 'consumer',
    };

    if (senderRole === 'consumer' || resolvedSenderName) {
      if (senderRole === 'consumer') roomSummary.consumerName = resolvedSenderName;
      if (senderRole === 'merchant') roomSummary.merchantName = resolvedSenderName;
    }

    await setDoc(chatRef, roomSummary, { merge: true });

    // 2. Add message document to subcollection
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const messageData: Record<string, any> = {
      chatId,
      senderId: senderId || '',
      senderName: resolvedSenderName || 'User',
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
