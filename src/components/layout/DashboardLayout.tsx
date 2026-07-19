import { useState } from "react";
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
import { claimsApi } from "@/features/claims/services/claimsApi";
import { toast } from "sonner";

export function DashboardLayout() {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScannerOpen, setIsScannerOpen] = useState(false);

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

      {/* Sidebar Extracted */}
      <DashboardSidebar
        onLogout={handleLogout}
        onOpenScanner={() => setIsScannerOpen(true)}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Topbar for mobile */}
        <header className="h-14 bg-card border-b flex items-center justify-between px-4 md:hidden">
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-primary">Mitra FoodUnity</h1>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Konfirmasi Keluar</AlertDialogTitle>
                <AlertDialogDescription>
                  Apakah Anda yakin ingin keluar dari aplikasi?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction onClick={handleLogout}>
                  Ya, Keluar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-4 md:p-8 pb-24 md:pb-8">
          <Outlet />
        </div>

        {/* Bottom Navigation for Mobile */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t flex justify-around items-center h-16 pb-safe z-40 px-2 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            if (item.action === "scan") {
              return (
                <div key={item.name} className="relative -top-5">
                  <button
                    onClick={() => setIsScannerOpen(true)}
                    className="flex items-center justify-center w-14 h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg transition-transform active:scale-95"
                  >
                    <Icon className="w-7 h-7" />
                  </button>
                </div>
              );
            }

            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href!}
                className={`flex flex-col items-center justify-center w-16 gap-1 transition-colors ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${isActive ? "fill-primary/20" : ""}`}
                />
                <span className="text-[10px] font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </main>
    </div>
  );
}
