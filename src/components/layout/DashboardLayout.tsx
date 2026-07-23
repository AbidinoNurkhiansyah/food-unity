import { useState, useEffect } from "react";
import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import { useAuthStore } from "@/features/auth";
import { logout } from "@/features/auth/services/authService";
import {
  LayoutDashboard,
  Package,
  QrCode,
  Wallet,
  History,
  LogOut,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DashboardSidebar } from "./DashboardSidebar";
import { ScannerModal } from "@/features/claims";
import { MerchantChatModal, chatService } from "@/features/chat";
import { claimsApi } from "@/features/claims/services/claimsApi";
import { toast } from "sonner";

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
    { name: "Scan", action: "scan", icon: QrCode },
    { name: "Dompet", href: "/dashboard/wallet", icon: Wallet },
    { name: "Riwayat", href: "/dashboard/claims", icon: History },
  ];

  return (
    <div className="flex h-screen bg-muted/30">
      <ScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScan={handleGlobalScan}
      />

      <MerchantChatModal
        isOpen={isChatOpen}
        onClose={setIsChatOpen}
      />

      {/* Sidebar Extracted */}
      <DashboardSidebar
        onLogout={handleLogout}
        onOpenScanner={() => setIsScannerOpen(true)}
        onOpenChat={() => setIsChatOpen(true)}
        unreadCount={unreadCount}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Desktop Header Topbar */}
        <header className="h-16 bg-background/80 backdrop-blur-md border-b border-primary/10 hidden md:flex items-center justify-between px-8 sticky top-0 z-40">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Dashboard Mitra</h2>
            <p className="text-xs text-slate-500">Kelola toko dan pesanan pelanggan Anda</p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsChatOpen(true)}
              className="gap-2 rounded-xl relative cursor-pointer hover:bg-primary-50 hover:text-primary-600 border-slate-200"
            >
              <MessageSquare className="w-4 h-4 text-primary-600" />
              <span className="font-semibold text-xs">Chat Pelanggan</span>
              {unreadCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-red-500 text-white font-extrabold text-[10px] rounded-full animate-pulse">
                  {unreadCount}
                </span>
              )}
            </Button>
          </div>
        </header>

        {/* Topbar for mobile */}
        <header className="h-16 bg-background/80 backdrop-blur-md border-b border-primary/10 flex items-center justify-between px-4 md:hidden sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
              Mitra FoodUnity
            </h1>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsChatOpen(true)}
              className="relative text-slate-600 hover:text-primary-600 rounded-full cursor-pointer"
              title="Chat Pelanggan"
            >
              <MessageSquare className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white"></span>
              )}
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full"
                >
                  <LogOut className="w-5 h-5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="w-[90vw] max-w-md rounded-2xl">
                <AlertDialogHeader>
                  <AlertDialogTitle>Konfirmasi Keluar</AlertDialogTitle>
                  <AlertDialogDescription>
                    Apakah Anda yakin ingin keluar dari aplikasi?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-xl">Batal</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleLogout}
                    className="rounded-xl bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                  >
                    Ya, Keluar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-4 md:p-8 pb-24 md:pb-8">
          <Outlet />
        </div>

        {/* Bottom Navigation for Mobile */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-lg border-t border-primary/10 flex justify-around items-center h-16 pb-safe z-40 px-2 shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            if (item.action === "scan") {
              return (
                <div key={item.name} className="relative -top-6">
                  <Button
                    size="icon"
                    onClick={() => setIsScannerOpen(true)}
                    className="w-14 h-14 bg-gradient-to-tr from-palette-600 to-palette-400 hover:from-palette-700 hover:to-palette-500 text-white rounded-full shadow-lg shadow-palette-500/40 transition-all hover:scale-105 active:scale-95"
                  >
                    <Icon className="w-7 h-7" />
                  </Button>
                </div>
              );
            }

            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href!}
                className={`flex flex-col items-center justify-center w-16 h-14 gap-1 rounded-2xl transition-all duration-300 ${
                  isActive
                    ? "text-primary-700 bg-primary-50/80 shadow-sm shadow-primary/5"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${isActive ? "fill-primary/20 stroke-primary-600" : ""}`}
                />
                <span className="text-[10px] font-semibold">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </main>
    </div>
  );
}

