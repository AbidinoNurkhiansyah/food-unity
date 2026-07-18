import React from "react";
import { useAuthStore } from "@/hooks/useAuthStore";
import { logout } from "@/features/auth/services/authService";
import { useCartStore } from "@/hooks/useCartStore";
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

interface ExploreHeaderProps {
  onOpenCart: () => void;
}

export const ExploreHeader: React.FC<ExploreHeaderProps> = ({ onOpenCart }) => {
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
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 text-transparent bg-clip-text">
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
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-orange-500 to-red-500 flex items-center justify-center text-white font-bold shadow-md">
              {user?.displayName ? user.displayName.charAt(0).toUpperCase() : "C"}
            </div>

            <button
              onClick={onOpenCart}
              className="relative p-2 text-gray-400 hover:text-orange-500 transition-colors"
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
