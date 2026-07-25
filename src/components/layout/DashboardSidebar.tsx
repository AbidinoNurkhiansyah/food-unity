import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  History,
  LogOut,
  Wallet,
  QrCode,
  Menu,
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

import logo from "@/assets/logo.svg";

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
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems: NavItem[] = [
    { name: "Ringkasan", href: "/dashboard", icon: LayoutDashboard },
    { name: "Kelola Stok", href: "/dashboard/products", icon: Package },
    { name: "Scan Tiket", action: "scan", icon: QrCode },
    { name: "Dompet", href: "/dashboard/wallet", icon: Wallet },
    { name: "Riwayat Klaim", href: "/dashboard/claims", icon: History },
  ];

  return (
    <aside
      className={`bg-white rounded-2xl shadow-sm hidden md:flex flex-col overflow-hidden transition-all duration-300 shrink-0 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <div
        className={`p-4 flex items-center justify-between border-b border-slate-100/50 ${
          isCollapsed ? "flex-col gap-4" : "flex-row"
        }`}
      >
        {!isCollapsed && (
          <Link to="/dashboard" className="block shrink-0 pl-2">
            <img src={logo} alt="FoodUnity Logo" className="h-6 w-auto" />
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="rounded-xl hover:bg-slate-100 cursor-pointer shrink-0"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          <Menu className="w-5 h-5 text-slate-500" />
        </Button>
      </div>

      <nav className="flex-1 p-3 flex flex-col gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          if (item.action === "scan") {
            return (
              <Button
                key={item.name}
                variant="ghost"
                onClick={onOpenScanner}
                className={`w-full rounded-xl transition-all duration-300 text-muted-foreground hover:bg-muted/50 hover:text-foreground cursor-pointer ${
                  isCollapsed
                    ? "justify-center gap-0 px-2"
                    : "justify-start gap-3 px-4"
                }`}
                title={isCollapsed ? item.name : undefined}
              >
                <Icon className="w-5 h-5" />
                {!isCollapsed && (
                  <span className="font-medium">{item.name}</span>
                )}
              </Button>
            );
          }

          const isActive = location.pathname === item.href;
          return (
            <Button
              key={item.name}
              variant="ghost"
              asChild
              className={`w-full rounded-xl transition-all duration-300 cursor-pointer ${
                isCollapsed ? "justify-center gap-0 px-2" : "justify-start gap-3 px-4"
              } ${
                isActive
                  ? "bg-primary-50/60 text-primary-800 border border-primary-100/50 shadow-sm shadow-primary-500/5 font-semibold hover:bg-primary-100/60"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
              title={isCollapsed ? item.name : undefined}
            >
              <Link to={item.href!} className="flex items-center w-full">
                <Icon
                  className={`w-5 h-5 transition-colors ${
                    isActive ? "text-primary-600 fill-primary-500/10 stroke-[2.25]" : "text-muted-foreground"
                  } ${isCollapsed ? "" : "mr-3"}`}
                />
                {!isCollapsed && (
                  <span className={isActive ? "font-semibold" : "font-medium"}>
                    {item.name}
                  </span>
                )}
              </Link>
            </Button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-slate-100">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              className={`w-full rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer ${
                isCollapsed ? "justify-center px-2" : "justify-start gap-3 px-4"
              }`}
              title={isCollapsed ? "Keluar" : undefined}
            >
              <LogOut className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span>Keluar</span>}
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
