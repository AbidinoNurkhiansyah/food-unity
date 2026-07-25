import { Button } from "@/components/ui/button";
import { MessageSquare, Store, LogOut } from "lucide-react";
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

interface MobileTopbarProps {
  onOpenChat: () => void;
  onOpenProfile: () => void;
  onLogout: () => void;
  unreadCount: number;
}

export function MobileTopbar({
  onOpenChat,
  onOpenProfile,
  onLogout,
  unreadCount,
}: MobileTopbarProps) {
  return (
    <header className="sticky top-0 z-40 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-between px-4 md:hidden shrink-0">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-extrabold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
          Mitra FoodUnity
        </h1>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenChat}
          className="relative text-slate-600 hover:text-primary-600 rounded-full cursor-pointer"
          title="Chat Pelanggan"
        >
          <MessageSquare className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white"></span>
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenProfile}
          className="text-slate-600 hover:text-primary-600 rounded-full cursor-pointer"
          title="Profil Toko"
        >
          <Store className="w-5 h-5" />
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
    </header>
  );
}
