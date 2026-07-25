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
import { toast } from "sonner";

export const ExplorePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { data: products, isLoading } = useAllProducts();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false);

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceFilter, setPriceFilter] = useState<"all" | "paid" | "donation">("all");

  // Filtering Logic
  const filteredProducts = products?.filter((product) => {
    // 1. Text Search Query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchTitle = product.title.toLowerCase().includes(query);
      const matchMerchant = product.merchantName.toLowerCase().includes(query);
      const matchDesc = product.description?.toLowerCase().includes(query) || false;
      const matchCat = product.category?.toLowerCase().includes(query) || false;
      if (!matchTitle && !matchMerchant && !matchDesc && !matchCat) {
        return false;
      }
    }

    // 2. Category Filter
    if (selectedCategory !== "All") {
      if (product.category !== selectedCategory) {
        return false;
      }
    }

    // 3. Price/Type Filter
    if (priceFilter === "donation" && !product.isDonation) {
      return false;
    }
    if (priceFilter === "paid" && product.isDonation) {
      return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <TopBar />
      <ExploreHeader />

      <main className="px-4 sm:px-6 lg:px-[130px] py-6">
        <ExploreSearch
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          priceFilter={priceFilter}
          setPriceFilter={setPriceFilter}
          onGetCurrentLocation={() => {
            // Placeholder for GPS location flow (F1)
            toast.info("Geolocation feature is in planning phase.");
          }}
        />

        <ProductGrid
          products={filteredProducts}
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
