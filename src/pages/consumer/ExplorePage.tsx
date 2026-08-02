import React, { useState } from "react";
import { useAuthStore } from "@/features/auth";
import { useAllProducts } from "@/features/products/hooks/useProducts";
import type { Product } from "@/features/products/types";
import type { MerchantUser } from "@/features/merchant-profile/types";
import {
  ExploreHeader,
  ExploreSearch,
  ProductGrid,
  ProductDetailModal,
  ExploreMap,
  MobileProductBottomSheet,
  useExploreMerchants,
  ExploreLocatingView,
  ExploreLoginPrompt,
  useExploreFilters,
  useExploreMapState,
} from "@/features/explore";
import { Footer } from "@/features/landing";
import { ConsumerFloatingChat } from "@/features/chat";

export const ExplorePage: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const { data: products, isLoading } = useAllProducts();
  const { data: merchants = [] } = useExploreMerchants();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedMerchant, setSelectedMerchant] = useState<MerchantUser | null>(
    null
  );
  const [isSheetHidden, setIsSheetHidden] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false);

  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    priceFilter,
    setPriceFilter,
    filteredProducts,
  } = useExploreFilters(products);

  const {
    viewMode,
    handleViewModeChange,
    userLocation,
    mapCenter,
    setMapCenter,
    isLocating,
  } = useExploreMapState();

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col">
      <ExploreHeader />

      <main
        className={
          viewMode === "map"
            ? "relative w-full flex-1 px-0 py-0 overflow-hidden"
            : "px-4 sm:px-6 lg:px-[130px] py-6"
        }
      >
        <div
          className={
            viewMode === "map"
              ? "absolute top-4 md:top-6 left-4 sm:left-6 lg:left-[130px] right-4 sm:right-6 lg:right-[130px] z-20 pointer-events-none [&>*]:pointer-events-auto"
              : ""
          }
        >
          <ExploreSearch
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            priceFilter={priceFilter}
            setPriceFilter={setPriceFilter}
            viewMode={viewMode}
            setViewMode={handleViewModeChange}
          />
        </div>

        {viewMode === "grid" ? (
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
        ) : isLocating ? (
          <ExploreLocatingView />
        ) : (
          <div className="relative w-full overflow-hidden h-[calc(100vh-4rem)]">
            <ExploreMap
              products={filteredProducts || []}
              merchants={merchants}
              userLocation={userLocation}
              mapCenter={mapCenter}
              setMapCenter={setMapCenter}
              searchQuery={searchQuery}
              selectedMerchant={selectedMerchant}
              setSelectedMerchant={(merchant) => {
                setSelectedMerchant(merchant);
                if (merchant) {
                  setIsSheetHidden(true);
                } else {
                  setIsSheetHidden(false);
                }
              }}
              onCloseStart={() => setIsSheetHidden(false)}
              onSelectProduct={(product) => {
                if (!isAuthenticated) {
                  setIsLoginPromptOpen(true);
                  return;
                }
                setSelectedProduct(product);
                setIsProductModalOpen(true);
              }}
            />

            {/* Mobile Draggable Bottom Sheet */}
            <div className="md:hidden">
              <MobileProductBottomSheet
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
                isHidden={isSheetHidden}
              />
            </div>
          </div>
        )}
      </main>

      {viewMode === "grid" && !isAuthenticated && <Footer />}

      <ProductDetailModal
        isOpen={isProductModalOpen}
        onClose={setIsProductModalOpen}
        product={selectedProduct}
      />

      <ConsumerFloatingChat />

      <ExploreLoginPrompt
        isOpen={isLoginPromptOpen}
        onOpenChange={setIsLoginPromptOpen}
      />
    </div>
  );
};
