import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth';
import { logout } from '@/features/auth/services/authService';
import { Menu } from 'lucide-react';
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
import { DashboardSidebar } from './DashboardSidebar';

export function DashboardLayout() {
  const { clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      clearAuth();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <div className="flex h-screen bg-muted/30">
      {/* Sidebar Extracted */}
      <DashboardSidebar onLogout={handleLogout} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar for mobile */}
        <header className="h-14 bg-card border-b flex items-center justify-between px-4 md:hidden">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Menu className="w-5 h-5" />
            </Button>
            <h1 className="font-bold">FoodUnity</h1>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm">
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
                <AlertDialogAction onClick={handleLogout}>Ya, Keluar</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
