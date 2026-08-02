import React from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ExploreLoginPromptProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ExploreLoginPrompt: React.FC<ExploreLoginPromptProps> = ({
  isOpen,
  onOpenChange,
}) => {
  const navigate = useNavigate();

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-white border-none ring-0 sm:rounded-2xl">
        <div className="flex justify-center pt-2 pb-1">
          <img
            src="/src/assets/logo.svg"
            alt="Food Unity Logo"
            className="h-8 w-auto object-contain"
          />
        </div>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">
            Access Restricted
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Please sign in to your account first to view full details and add
            products to your cart.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="border-none bg-transparent">
          <AlertDialogCancel className="border-none shadow-none hover:bg-gray-100 cursor-pointer">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => navigate("/login")}
            className="bg-primary-500 hover:bg-primary-600 cursor-pointer"
          >
            Sign In
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
