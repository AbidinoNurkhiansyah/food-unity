import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  History,
  LogOut,
  Wallet,
  QrCode,
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

interface DashboardSidebarProps {
  onLogout: () => void;
  onOpenScanner: () => void;
}

type NavItem = {
  name: string;
  href?: string;
  action?: "scan";
  icon: React.ElementType;
};

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  onLogout,
  onOpenScanner,
}) => {
  const location = useLocation();

  const navItems: NavItem[] = [
    { name: "Ringkasan", href: "/dashboard", icon: LayoutDashboard },
    { name: "Kelola Stok", href: "/dashboard/products", icon: Package },
    { name: "Scan Tiket", action: "scan", icon: QrCode },
    { name: "Dompet", href: "/dashboard/wallet", icon: Wallet },
    { name: "Riwayat Klaim", href: "/dashboard/claims", icon: History },
  ];

  return (
    <aside className="w-64 bg-card hidden md:flex flex-col">
      <div className="p-6">
        <h2 className="text-2xl font-extrabold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
          Mitra FoodUnity
        </h2>
      </div>
      <nav className="flex-1 p-4 flex flex-col gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          if (item.action === "scan") {
            return (
              <Button
                key={item.name}
                variant="ghost"
                onClick={onOpenScanner}
                className="w-full justify-start gap-3 rounded-xl transition-all duration-300 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Button>
            );
          }

          const isActive = location.pathname === item.href;
          return (
            <Button
              key={item.name}
              variant="ghost"
              asChild
              className={`w-full justify-start gap-3 rounded-xl transition-all duration-300 ${
                isActive
                  ? "bg-primary-50/80 text-primary-700 shadow-sm shadow-primary/5 hover:bg-primary-100 hover:text-primary-800"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
            >
              <Link to={item.href!}>
                <Icon
                  className={`w-5 h-5 ${isActive ? "fill-primary/20 stroke-primary-600" : ""}`}
                />
                <span className={isActive ? "font-semibold" : "font-medium"}>
                  {item.name}
                </span>
              </Link>
            </Button>
          );
        })}
      </nav>
      <div className="p-4 border-t border-primary/10">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Keluar
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="rounded-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Konfirmasi Keluar</AlertDialogTitle>
              <AlertDialogDescription>
                Apakah Anda yakin ingin keluar dari aplikasi?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-xl">
                Batal
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={onLogout}
                className="rounded-xl bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              >
                Ya, Keluar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </aside>
  );
};
