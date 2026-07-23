import React, { useState, useEffect, useRef } from "react";
import { Send, ArrowLeft, Store, User as UserIcon, ShoppingBag, X } from "lucide-react";
import { toast } from "sonner";
import { chatService } from "../services/chatService";
import { presenceService } from "../services/presenceService";
import type { ChatMessage, ChatRoom, ChatProductInfo } from "../types";
import type { Product } from "@/features/products/types";

interface ChatWindowProps {
  chatId: string;
  currentUserId: string;
  currentUserName: string;
  currentUserRole: "consumer" | "merchant";
  chatRoom?: ChatRoom;
  activeProduct?: Product | ChatProductInfo | null;
  onBack?: () => void;
  onClose?: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  chatId,
  currentUserId,
  currentUserName,
  currentUserRole,
  chatRoom,
  activeProduct,
  onBack,
  onClose,
}) => {
  const [consumerId, merchantId] = (chatId || "").split("_");
  const recipientId =
    currentUserRole === "consumer"
      ? chatRoom?.merchantId || merchantId
      : chatRoom?.consumerId || consumerId;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isRecipientOnline, setIsRecipientOnline] = useState(() =>
    presenceService.getCachedPresence(recipientId)
  );
  const [attachedProduct, setAttachedProduct] = useState<Product | ChatProductInfo | null>(
    activeProduct || null
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Subscribe to real-time recipient online/offline presence
  useEffect(() => {
    if (!recipientId) return;

    const unsubscribe = presenceService.subscribeUserPresence(
      recipientId,
      (isOnline) => {
        setIsRecipientOnline(isOnline);
      }
    );

    return () => unsubscribe();
  }, [recipientId]);

  useEffect(() => {
    if (activeProduct) {
      setAttachedProduct(activeProduct);
      if (messages.length === 0 && !inputText) {
        setInputText(`Halo, apakah ${activeProduct.title} masih tersedia?`);
      }
    }
  }, [activeProduct]);

  const prevChatIdRef = useRef<string | null>(null);

  // Subscribe to real-time messages
  useEffect(() => {
    if (!chatId) {
      setMessages([]);
      prevChatIdRef.current = null;
      return;
    }

    // Only reset messages array if switching to a DIFFERENT chat room
    if (prevChatIdRef.current !== chatId) {
      setMessages([]);
      prevChatIdRef.current = chatId;
    }

    const unsubscribe = chatService.subscribeMessages(chatId, (newMessages) => {
      setMessages(newMessages);
    });

    // Mark as read
    chatService.markAsRead(chatId, currentUserRole);

    return () => {
      unsubscribe();
    };
  }, [chatId, currentUserRole]);

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isSending) return;

    const text = inputText.trim();
    setInputText("");
    setIsSending(true);

    let productToSend = null;
    if (attachedProduct && attachedProduct.id) {
      productToSend = {
        id: attachedProduct.id,
        title: attachedProduct.title || "",
        imageUrl: attachedProduct.imageUrl || "",
      };
    }

    // Optimistic UI update so bubble appears IMMEDIATELY (0ms)
    const optimisticMsg: ChatMessage = {
      id: `temp_${Date.now()}`,
      chatId,
      senderId: currentUserId,
      senderName: currentUserName,
      senderRole: currentUserRole,
      text,
      productId: productToSend?.id,
      productTitle: productToSend?.title,
      productImage: productToSend?.imageUrl,
      createdAt: new Date(),
    };
    setMessages((prev) => [...prev, optimisticMsg]);

    try {
      await chatService.sendMessage({
        chatId,
        senderId: currentUserId,
        senderName: currentUserName,
        senderRole: currentUserRole,
        text,
        product: productToSend,
      });

      // Clear attached product after sending first message with it
      if (attachedProduct) {
        setAttachedProduct(null);
      }
    } catch (error: any) {
      console.error("Failed to send message:", error);
      const errorMessage = error?.message || (typeof error === "string" ? error : "Terjadi kesalahan");
      toast.error(`Gagal mengirim pesan: ${errorMessage}`);
      // Revert optimistic message on failure
      setMessages((prev) => prev.filter((m) => m.id !== optimisticMsg.id));
    } finally {
      setIsSending(false);
    }
  };

  const recipientName =
    currentUserRole === "consumer"
      ? chatRoom?.merchantName || "Merchant Partner"
      : chatRoom?.consumerName || "Customer Account";

  return (
    <div className="flex flex-col h-full bg-slate-50 relative overflow-hidden font-sans">
      {/* Header */}
      <div className="bg-white px-4 py-3 border-b border-slate-100 flex items-center justify-between shadow-xs z-10 shrink-0">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
              title="Kembali"
            >
              <ArrowLeft size={18} />
            </button>
          )}
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary-500 to-primary-400 flex items-center justify-center text-white font-bold text-sm shadow-xs">
              {currentUserRole === "consumer" ? (
                <Store size={18} />
              ) : (
                <UserIcon size={18} />
              )}
            </div>
            <span
              className={`absolute bottom-0 right-0 w-2.5 h-2.5 border-2 border-white rounded-full ${
                isRecipientOnline ? "bg-emerald-500" : "bg-slate-300"
              }`}
            ></span>
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm leading-tight truncate max-w-[180px]">
              {recipientName}
            </h3>
            <p
              className={`text-[11px] font-medium ${
                isRecipientOnline ? "text-emerald-600" : "text-slate-400"
              }`}
            >
              {isRecipientOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Attached Product Context Banner */}
      {attachedProduct && (
        <div className="bg-primary-50/90 backdrop-blur-xs border-b border-primary-100 px-3 py-2 flex items-center justify-between gap-2 shrink-0 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2.5 min-w-0">
            {attachedProduct.imageUrl ? (
              <img
                src={attachedProduct.imageUrl}
                alt={attachedProduct.title}
                className="w-9 h-9 rounded-lg object-cover border border-primary-200 shrink-0"
              />
            ) : (
              <div className="w-9 h-9 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600 shrink-0">
                <ShoppingBag size={18} />
              </div>
            )}
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-bold text-primary-600 tracking-wider block">
                Menanyakan Produk
              </span>
              <p className="text-xs font-semibold text-slate-800 truncate">
                {attachedProduct.title}
              </p>
            </div>
          </div>
          <button
            onClick={() => setAttachedProduct(null)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-white/50 cursor-pointer"
            title="Tutup Lampiran"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 text-slate-400">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-2">
              <Store className="text-slate-300" size={24} />
            </div>
            <p className="text-xs font-medium text-slate-600">
              Belum ada percakapan
            </p>
            <p className="text-[11px] text-slate-400 mt-1 max-w-[200px]">
              Kirim pesan pertama Anda untuk mulai berdiskusi dengan {recipientName}
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === currentUserId;
            const formattedTime = msg.createdAt?.toDate
              ? new Intl.DateTimeFormat("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                }).format(msg.createdAt.toDate())
              : "";

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  isMe ? "items-end" : "items-start"
                } animate-in fade-in-50 duration-200`}
              >
                {/* Product Card Attachment inside bubble if any */}
                {msg.productTitle && (
                  <div
                    className={`mb-1 max-w-[80%] p-2 rounded-xl border text-xs flex items-center gap-2 ${
                      isMe
                        ? "bg-primary-100 border-primary-200 text-slate-800"
                        : "bg-white border-slate-200 text-slate-800"
                    }`}
                  >
                    {msg.productImage && (
                      <img
                        src={msg.productImage}
                        alt={msg.productTitle}
                        className="w-8 h-8 rounded object-cover"
                      />
                    )}
                    <div>
                      <span className="text-[9px] font-bold uppercase text-primary-700 block">
                        Terkait Produk
                      </span>
                      <p className="font-medium line-clamp-1">{msg.productTitle}</p>
                    </div>
                  </div>
                )}

                <div
                  className={`max-w-[82%] px-3.5 py-2 rounded-2xl text-xs leading-relaxed shadow-2xs break-words ${
                    isMe
                      ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-br-none"
                      : "bg-white text-slate-800 border border-slate-100 rounded-bl-none"
                  }`}
                >
                  <p>{msg.text}</p>
                  <span
                    className={`text-[9px] mt-1 block text-right font-medium ${
                      isMe ? "text-primary-100" : "text-slate-400"
                    }`}
                  >
                    {formattedTime}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSend}
        className="p-3 bg-white border-t border-slate-100 flex items-center gap-2 shrink-0"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Pesan untuk ${recipientName}...`}
          className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-slate-800 placeholder-slate-400 transition-all"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isSending}
          className={`p-2.5 rounded-xl text-white transition-all duration-200 flex items-center justify-center cursor-pointer ${
            !inputText.trim() || isSending
              ? "bg-slate-200 text-slate-400 cursor-not-allowed"
              : "bg-primary-500 hover:bg-primary-600 shadow-md shadow-primary-500/30 active:scale-95"
          }`}
        >
          <Send size={15} />
        </button>
      </form>
    </div>
  );
};
