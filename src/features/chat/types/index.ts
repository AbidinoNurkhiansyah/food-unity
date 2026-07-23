export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  senderRole: 'consumer' | 'merchant';
  text: string;
  productId?: string;
  productTitle?: string;
  productImage?: string;
  createdAt: any; // Firestore Timestamp or Date
}

export interface ChatProductInfo {
  id: string;
  title: string;
  imageUrl?: string;
  price?: number;
}

export interface ChatRoom {
  id: string; // e.g. ${consumerId}_${merchantId}
  consumerId: string;
  consumerName: string;
  consumerEmail?: string;
  merchantId: string;
  merchantName: string;
  lastMessage: string;
  lastMessageSenderId: string;
  updatedAt: any;
  unreadConsumer?: boolean;
  unreadMerchant?: boolean;
  activeProduct?: ChatProductInfo;
}
