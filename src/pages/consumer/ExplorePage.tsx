import React, { useState } from "react";
import { useAllProducts } from "@/features/products/hooks/useProducts";
import type { Product } from "@/features/products/types";
import { ExploreHeader } from "./components/ExploreHeader";
import { ExploreSearch } from "./components/ExploreSearch";
import { ProductGrid } from "./components/ProductGrid";
import { ProductDetailModal } from "./components/ProductDetailModal";
import { CartModal } from "./components/CartModal";

export const ExplorePage: React.FC = () => {
  const { data: products, isLoading } = useAllProducts();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50/50">
      <ExploreHeader onOpenCart={() => setIsCartModalOpen(true)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ExploreSearch />

        <ProductGrid
          products={products}
          isLoading={isLoading}
          onSelectProduct={(product) => {
            setSelectedProduct(product);
            setIsProductModalOpen(true);
          }}
        />
      </main>

      <ProductDetailModal
        isOpen={isProductModalOpen}
        onClose={setIsProductModalOpen}
        product={selectedProduct}
      />

      <CartModal
        isOpen={isCartModalOpen}
        onClose={setIsCartModalOpen}
      />
    </div>
  );
};
