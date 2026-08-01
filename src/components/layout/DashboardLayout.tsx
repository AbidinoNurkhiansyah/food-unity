import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/features/auth";
import { logout } from "@/features/auth/services/authService";
import {
  LayoutDashboard,
  Package,
  QrCode,
  Wallet,
  History,
} from "lucide-react";
import { DashboardSidebar } from "./DashboardSidebar";
import { MerchantChatModal, chatService } from "@/features/chat";
import { DesktopTopbar } from "./DesktopTopbar";
import { MobileTopbar } from "./MobileTopbar";
import { MobileBottomNav } from "./MobileBottomNav";

export function DashboardLayout() {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Subscribe to merchant chats for unread count badge
  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribe = chatService.subscribeUserChats(
      user.uid,
      "merchant",
      (rooms) => {
        const unread = rooms.filter((r) => r.unreadMerchant).length;
        setUnreadCount(unread);
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

  const handleLogout = async () => {
    try {
      await logout();
      clearAuth();
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const navItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Stock", href: "/dashboard/products", icon: Package },
    { name: "Scan", href: "/dashboard/scan", icon: QrCode },
    { name: "Wallet", href: "/dashboard/wallet", icon: Wallet },
    { name: "History", href: "/dashboard/claims", icon: History },
  ];

  return (
    <div className="flex h-screen bg-slate-100 p-4 gap-3">
      <MerchantChatModal isOpen={isChatOpen} onClose={setIsChatOpen} />

      {/* Sidebar Extracted */}
      <DashboardSidebar onLogout={handleLogout} />

      {/* Main Content Area Wrapper */}
      <div className="flex-1 md:px-4 flex flex-col min-w-0 gap-3 overflow-y-auto no-scrollbar pb-16 md:pb-0">
        {/* Desktop Header Topbar */}
        <DesktopTopbar
          onOpenChat={() => setIsChatOpen(true)}
          onOpenProfile={() => navigate("/dashboard/profile")}
          unreadCount={unreadCount}
        />

        {/* Topbar for mobile */}
        <MobileTopbar
          onOpenChat={() => setIsChatOpen(true)}
          onOpenProfile={() => navigate("/dashboard/profile")}
          onLogout={handleLogout}
          unreadCount={unreadCount}
        />

        {/* Content Area */}
        <main className="min-w-0 relative flex-1 flex flex-col h-full">
          <Outlet />
        </main>
      </div>

      {/* Bottom Navigation for Mobile */}
      <MobileBottomNav navItems={navItems} currentPath={location.pathname} />
    </div>
  );
}
