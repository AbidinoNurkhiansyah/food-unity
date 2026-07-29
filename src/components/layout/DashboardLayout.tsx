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
import { ScannerModal } from "@/features/claims";
import { MerchantChatModal, chatService } from "@/features/chat";
import { claimsApi } from "@/features/claims/services/claimsApi";
import { toast } from "sonner";
import { DesktopTopbar } from "./DesktopTopbar";
import { MobileTopbar } from "./MobileTopbar";
import { MobileBottomNav } from "./MobileBottomNav";

export function DashboardLayout() {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScannerOpen, setIsScannerOpen] = useState(false);
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

  const handleGlobalScan = async (scannedCode: string) => {
    try {
      const claim = await claimsApi.getClaimById(scannedCode);

      if (!claim) {
        toast.error("Tiket tidak ditemukan! Pastikan kode benar.");
        return;
      }

      if (!user?.uid || !claim.merchantIds?.includes(user.uid)) {
        toast.error("Tiket ini bukan untuk toko Anda.");
        return;
      }

      if (claim.status === "COMPLETED") {
        toast.warning("Pesanan ini sudah diambil sebelumnya!");
        return;
      }

      if (claim.status !== "PAID") {
        toast.warning(`Tiket tidak bisa divalidasi. Status: ${claim.status}`);
        return;
      }

      await claimsApi.completeClaim(scannedCode);
      toast.success("Pesanan berhasil ditandai selesai (sudah diambil)");
      setIsScannerOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Gagal memvalidasi tiket");
    }
  };

  const navItems = [
    { name: "Ringkasan", href: "/dashboard", icon: LayoutDashboard },
    { name: "Stok", href: "/dashboard/products", icon: Package },
    { name: "Scan", action: "scan" as const, icon: QrCode },
    { name: "Dompet", href: "/dashboard/wallet", icon: Wallet },
    { name: "Riwayat", href: "/dashboard/claims", icon: History },
  ];

  return (
    <div className="flex h-screen bg-slate-100 p-3 gap-3">
      <ScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScan={handleGlobalScan}
      />

      <MerchantChatModal isOpen={isChatOpen} onClose={setIsChatOpen} />

      {/* Sidebar Extracted */}
      <DashboardSidebar
        onLogout={handleLogout}
        onOpenScanner={() => setIsScannerOpen(true)}
      />

      {/* Main Content Area Wrapper */}
      <div className="flex-1 px-4 flex flex-col min-w-0 gap-3 overflow-y-auto no-scrollbar pb-16 md:pb-0">
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
        <main className="min-w-0 relative">
          <Outlet />
        </main>
      </div>

      {/* Bottom Navigation for Mobile */}
      <MobileBottomNav
        navItems={navItems}
        currentPath={location.pathname}
        onOpenScanner={() => setIsScannerOpen(true)}
      />
    </div>
  );
}
