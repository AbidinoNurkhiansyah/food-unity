import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth";
import { logout } from "@/features/auth/services/authService";
import { useCartStore } from "@/features/cart";
import { LogOut, ShoppingCart } from "lucide-react";
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

export const ExploreHeader: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { getTotalItems } = useCartStore();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-red-500 text-transparent bg-clip-text">
              FoodUnity
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end mr-4">
              <span className="text-sm font-medium text-gray-900">
                {user?.displayName || "Consumer"}
              </span>
              <span className="text-xs text-gray-500">{user?.email}</span>
            </div>
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary-500 to-red-500 flex items-center justify-center text-white font-bold shadow-md">
              {user?.displayName ? user.displayName.charAt(0).toUpperCase() : "C"}
            </div>

            <button
              onClick={() => window.location.href = '/orders'}
              className="p-2 text-gray-400 hover:text-primary-500 transition-colors"
              title="Pesanan Saya"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clipboard-list"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>
            </button>

            <button
              onClick={() => navigate('/cart')}
              className="relative p-2 text-gray-400 hover:text-primary-500 transition-colors"
            >
              <ShoppingCart size={22} />
              {getTotalItems() > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full">
                  {getTotalItems()}
                </span>
              )}
            </button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
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
          </div>
        </div>
      </div>
    </header>
  );
};

