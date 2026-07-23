import React, { useState, useEffect } from "react";
import { MessageSquare, Search, User as UserIcon, ChevronRight } from "lucide-react";
import { useAuthStore } from "@/features/auth";
import { chatService } from "../services/chatService";
import { ChatWindow } from "./ChatWindow";
import type { ChatRoom } from "../types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface MerchantChatModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
}

export const MerchantChatModal: React.FC<MerchantChatModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user } = useAuthStore();
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribe = chatService.subscribeUserChats(
      user.uid,
      "merchant",
      (rooms) => {
        setChatRooms(rooms);
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

  if (!user) return null;

  const activeRoom = chatRooms.find((r) => r.id === activeChatId);

  const filteredRooms = chatRooms.filter(
    (room) =>
      room.consumerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.consumerEmail?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-2xl h-[550px] p-0 overflow-hidden bg-white border-none rounded-2xl flex flex-col">
        <DialogHeader className="sr-only">
          <DialogTitle>Pesan Pelanggan</DialogTitle>
        </DialogHeader>

        {activeChatId ? (
          <div className="h-full">
            <ChatWindow
              chatId={activeChatId}
              currentUserId={user.uid}
              currentUserName={
                user.displayName || user.email?.split("@")[0] || "Mitra Merchant"
              }
              currentUserRole="merchant"
              chatRoom={activeRoom}
              onBack={() => setActiveChatId(null)}
              onClose={() => onClose(false)}
            />
          </div>
        ) : (
          <div className="flex flex-col h-full bg-white">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-500 text-white px-6 py-4 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-white/10 rounded-xl backdrop-blur-xs">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <h3 className="font-extrabold text-base leading-tight">
                    Pesan Masuk Pelanggan
                  </h3>
                  <p className="text-xs text-primary-100 font-medium">
                    Diskusi & Pertanyaan Seputar Produk
                  </p>
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama konsumen..."
                  className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-slate-800"
                />
              </div>
            </div>

            {/* Room List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {filteredRooms.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center text-slate-400">
                  <UserIcon size={36} className="text-slate-300 mb-2" />
                  <p className="text-sm font-semibold text-slate-600">
                    Belum ada pesan masuk
                  </p>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs">
                    Pesan dari konsumen yang menanyakan produk Anda akan muncul di sini.
                  </p>
                </div>
              ) : (
                filteredRooms.map((room) => {
                  const isUnread = room.unreadMerchant;
                  return (
                    <button
                      key={room.id}
                      onClick={() => {
                        setActiveChatId(room.id);
                        chatService.markAsRead(room.id, "merchant");
                      }}
                      className={`w-full p-4 flex items-center gap-3.5 hover:bg-slate-50 transition-colors text-left cursor-pointer ${
                        isUnread ? "bg-primary-50/40" : ""
                      }`}
                    >
                      <div className="relative shrink-0">
                        <div className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm border border-slate-200">
                          <UserIcon size={20} />
                        </div>
                        {isUnread && (
                          <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 border-2 border-white rounded-full"></span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4
                            className={`text-xs truncate ${
                              isUnread
                                ? "font-extrabold text-slate-900"
                                : "font-semibold text-slate-700"
                            }`}
                          >
                            {room.consumerName}
                          </h4>
                          {room.activeProduct && (
                            <span className="text-[10px] bg-primary-100 text-primary-700 font-semibold px-2 py-0.5 rounded-md truncate max-w-[120px]">
                              {room.activeProduct.title}
                            </span>
                          )}
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
                        size={18}
                        className="text-slate-300 shrink-0"
                      />
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
