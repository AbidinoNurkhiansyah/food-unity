import { Button } from "@/components/ui/button";
import { MessageSquare, Store, LogOut } from "lucide-react";
import logo from "@/assets/logo.svg";
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
        <img src={logo} alt="FoodUnity Logo" className="h-6 w-auto" />
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenChat}
          className="relative text-slate-600 hover:text-primary-600 rounded-full cursor-pointer"
          title="Customer Chat"
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
          title="Store Profile"
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
              <AlertDialogTitle>Logout Confirmation</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to log out of the application?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-xl">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={onLogout}
                className="rounded-xl bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              >
                Yes, Logout
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </header>
  );
}
