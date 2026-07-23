import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth";
import { useAllProducts } from "@/features/products/hooks/useProducts";
import type { Product } from "@/features/products/types";
import { TopBar } from "@/components/layout/TopBar";
import {
  ExploreHeader,
  ExploreSearch,
  ProductGrid,
  ProductDetailModal,
} from "@/features/explore";
import { ConsumerFloatingChat } from "@/features/chat";
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

export const ExplorePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { data: products, isLoading } = useAllProducts();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <TopBar />
      <ExploreHeader />

      <main className="px-4 sm:px-6 lg:px-[130px] py-6">
        <ExploreSearch />

        <ProductGrid
          products={products}
          isLoading={isLoading}
          onSelectProduct={(product) => {
            if (!isAuthenticated) {
              setIsLoginPromptOpen(true);
              return;
            }
            setSelectedProduct(product);
            setIsProductModalOpen(true);
          }}
          onRequireAuth={() => setIsLoginPromptOpen(true)}
        />
      </main>

      <ProductDetailModal
        isOpen={isProductModalOpen}
        onClose={setIsProductModalOpen}
        product={selectedProduct}
      />

      <ConsumerFloatingChat />

      <AlertDialog open={isLoginPromptOpen} onOpenChange={setIsLoginPromptOpen}>
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
    </div>
  );
};
