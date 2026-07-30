import { Button } from "@/components/ui/button";
import { MessageSquare, Store } from "lucide-react";

interface DesktopTopbarProps {
  onOpenChat: () => void;
  onOpenProfile: () => void;
  unreadCount: number;
}

export function DesktopTopbar({
  onOpenChat,
  onOpenProfile,
  unreadCount,
}: DesktopTopbarProps) {
  return (
    <header className="sticky top-0 z-40 h-16 bg-white rounded-2xl shadow-sm hidden md:flex items-center justify-between px-6 shrink-0">
      <div>
        <h2 className="text-lg font-bold text-slate-800">Merchant Dashboard</h2>
        <p className="text-xs text-slate-500">
          Manage your store and customer orders
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenChat}
          className="gap-2 rounded-xl relative cursor-pointer hover:bg-primary-50 hover:text-primary-600 border-slate-200"
        >
          <MessageSquare className="w-4 h-4 text-primary-600" />
          <span className="font-semibold text-xs">Consumer Chat</span>
          {unreadCount > 0 && (
            <span className="ml-1 px-1.5 py-0.5 bg-red-500 text-white font-extrabold text-[10px] rounded-full animate-pulse">
              {unreadCount}
            </span>
          )}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onOpenProfile}
          className="gap-2 rounded-xl cursor-pointer hover:bg-primary-50 hover:text-primary-600 border-slate-200"
        >
          <Store className="w-4 h-4 text-primary-600" />
          <span className="font-semibold text-xs">Merchant Profile</span>
        </Button>
      </div>
    </header>
  );
}
