import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, History, LogOut, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ onLogout }) => {
  const location = useLocation();

  const navItems = [
    { name: 'Ringkasan', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Kelola Stok', href: '/dashboard/products', icon: Package },
    { name: 'Dompet', href: '/dashboard/wallet', icon: Wallet },
    { name: 'Riwayat Klaim', href: '/dashboard/claims', icon: History },
  ];

  return (
    <aside className="w-64 bg-card border-r hidden md:flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold text-primary">Mitra FoodUnity</h2>
      </div>
      <nav className="flex-1 p-4 flex flex-col gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          return (
            <Link 
              key={item.name} 
              to={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                isActive 
                  ? 'bg-primary/10 text-primary font-medium' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10">
              <LogOut className="w-5 h-5 mr-3" />
              Keluar
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
              <AlertDialogAction onClick={onLogout}>Ya, Keluar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </aside>
  );
};
