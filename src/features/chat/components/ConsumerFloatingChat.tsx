import React, { useState, useEffect } from "react";
import { MessageSquare, X, Store, ChevronRight, Search } from "lucide-react";
import { db } from "@/config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useAuthStore } from "@/features/auth";
import { useChatStore } from "../hooks/useChatStore";
import { chatService } from "../services/chatService";
import { ChatWindow } from "./ChatWindow";
import type { ChatRoom } from "../types";

export const ConsumerFloatingChat: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const {
    isOpen,
    toggleChat,
    closeChat,
    activeChatId,
    activeProduct,
    setChatId,
  } = useChatStore();

  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Real-time listener for user's chat rooms
  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribe = chatService.subscribeUserChats(
      user.uid,
      "consumer",
      (rooms) => {
        setChatRooms(rooms);
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

  // Handle activeProduct trigger from ProductGrid or ProductDetailModal
  useEffect(() => {
    if (activeProduct && user?.uid) {
      const merchantId = activeProduct.merchantId || `merchant_${activeProduct.merchantName.replace(/\s+/g, '_')}`;
      const targetChatId = `${user.uid}_${merchantId}`;
      
      // Set activeChatId IMMEDIATELY so the room view opens without delay
      setChatId(targetChatId);

      const initProductChat = async () => {
        try {
          let realName = user.displayName || user.email?.split("@")[0] || "";
          let realEmail = user.email || "";

          try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
              const uData = userDoc.data();
              if (uData.name) realName = uData.name;
              if (uData.email) realEmail = uData.email;
            }
          } catch (e) {}

          await chatService.getOrCreateChatRoom(
            user.uid,
            realName || "Consumer Account",
            realEmail || "",
            merchantId,
            activeProduct.merchantName,
            activeProduct
          );
        } catch (error) {
          console.error("Failed to initialize chat for product:", error);
        }
      };
      initProductChat();
    }
  }, [activeProduct, user, setChatId]);

  if (!isAuthenticated || !user) {
    return null; // Only show floating chat when consumer is logged in
  }

  const unreadCount = chatRooms.filter((r) => r.unreadConsumer).length;

  const currentRoom = chatRooms.find((r) => r.id === activeChatId);

  const filteredRooms = chatRooms.filter((room) =>
    room.merchantName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Floating Modal Popup (Samping Kanan Sejajar dengan Floating Button) */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-80 sm:w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          {activeChatId ? (
            <ChatWindow
              chatId={activeChatId}
              currentUserId={user.uid}
              currentUserName={
                user.displayName || user.email?.split("@")[0] || "Konsumen"
              }
              currentUserRole="consumer"
              chatRoom={currentRoom}
              activeProduct={activeProduct}
              onBack={() => setChatId(null)}
              onClose={closeChat}
            />
          ) : (
            <div className="flex flex-col h-full bg-white">
              {/* Header List */}
              <div className="bg-primary-500 text-white p-4 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-2">
                  <MessageSquare size={20} />
                  <h3 className="font-bold text-base">Chat Penjual</h3>
                </div>
                <button
                  onClick={closeChat}
                  className="p-1 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Search Bar */}
              <div className="p-3 border-b border-slate-100 bg-slate-50">
                <div className="relative">
                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari toko / mitra..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-slate-800"
                  />
                </div>
              </div>

              {/* Chat Rooms List */}
              <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                {filteredRooms.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full p-6 text-center text-slate-400">
                    <Store size={32} className="text-slate-300 mb-2" />
                    <p className="text-xs font-semibold text-slate-600">
                      Belum ada percakapan
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Klik icon chat pada produk di halaman explore untuk memulai chat dengan mitra.
                    </p>
                  </div>
                ) : (
                  filteredRooms.map((room) => {
                    const isUnread = room.unreadConsumer;
                    return (
                      <button
                        key={room.id}
                        onClick={() => {
                          setChatId(room.id);
                          chatService.markAsRead(room.id, "consumer");
                        }}
                        className={`w-full p-3.5 flex items-center gap-3 hover:bg-slate-50 transition-colors text-left cursor-pointer ${
                          isUnread ? "bg-primary-50/40" : ""
                        }`}
                      >
                        <div className="relative shrink-0">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-500 to-primary-400 flex items-center justify-center text-white font-bold text-sm shadow-xs">
                            <Store size={18} />
                          </div>
                          {isUnread && (
                            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <h4
                              className={`text-xs truncate ${
                                isUnread
                                  ? "font-extrabold text-slate-900"
                                  : "font-semibold text-slate-700"
                              }`}
                            >
                              {room.merchantName}
                            </h4>
                          </div>
                          <p
                            className={`text-xs truncate ${
                              isUnread
                                ? "font-bold text-primary-600"
                                : "text-slate-500"
                            }`}
                          >
                            {room.lastMessage}
                          </p>
                        </div>

                        <ChevronRight
                          size={16}
                          className="text-slate-300 shrink-0"
                        />
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Floating Chat Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-50 p-3.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-full shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center group cursor-pointer"
        title="Chat Mitra"
      >
        <MessageSquare size={24} className="group-hover:rotate-6 transition-transform" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-full border-2 border-white animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>
    </>
  );
};
