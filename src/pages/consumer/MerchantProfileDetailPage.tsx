import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowUp } from "lucide-react";
import { useMerchantProducts } from "@/features/products/hooks/useProducts";
import { ProductDetailModal, ExploreHeader } from "@/features/explore";
import { AuthPromptDialog } from "@/features/auth/components";

// Import components, custom hooks, and constants from merchant-profile feature
import {
  MerchantHeroBanner,
  MerchantInfoCard,
  MerchantProductSection,
  MerchantProfileLoading,
  useMerchantProfileDetail,
} from "@/features/merchant-profile";

export const MerchantProfileDetailPage: React.FC = () => {
  const { merchantId } = useParams<{ merchantId: string }>();
  const navigate = useNavigate();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Use Custom Hook for state and business logic
  const {
    merchant,
    loading,
    selectedProduct,
    isProductModalOpen,
    setIsProductModalOpen,
    isLoginPromptOpen,
    setIsLoginPromptOpen,
    handleShare,
    getFullAddress,
    handleSelectProduct,
    handleRequireAuth,
  } = useMerchantProfileDetail(merchantId, navigate);

  // Fetch Merchant Products
  const { data: products, isLoading: isLoadingProducts } =
    useMerchantProducts(merchantId);

  // Filter only active products
  const activeProducts = products?.filter((p) => p.status === "active") || [];

  if (loading) {
    return <MerchantProfileLoading />;
  }

  if (!merchant) {
    return null;
  }

  const profile = merchant.profile;

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      <ExploreHeader />

      {/* Hero Banner Section */}
      <MerchantHeroBanner
        businessName={profile?.businessName}
        name={merchant.name}
        merchantType={profile?.merchantType}
        description={profile?.description}
        bannerImageUrl={profile?.bannerImageUrl}
        logoImageUrl={profile?.logoImageUrl}
        onBackClick={() => navigate("/explore")}
        onShareClick={handleShare}
      />

      {/* Main Content Layout */}
      <main className="px-4 sm:px-6 lg:px-[130px] mt-8 space-y-8">
        {/* Top Section: Store Info & Location Map CTA */}
        <MerchantInfoCard
          email={merchant.email}
          phoneNumber={profile?.phoneNumber}
          pickupHours={profile?.pickupHours}
          locationNotes={profile?.locationNotes}
          fullAddress={getFullAddress()}
          coordinates={profile?.coordinates}
        />

        {/* Products / Packages List Section */}
        <MerchantProductSection
          businessName={profile?.businessName}
          merchantName={merchant.name}
          activeProducts={activeProducts}
          isLoadingProducts={isLoadingProducts}
          onSelectProduct={handleSelectProduct}
          onRequireAuth={handleRequireAuth}
        />
      </main>

      {/* Product Detail Modal */}
      <ProductDetailModal
        isOpen={isProductModalOpen}
        onClose={setIsProductModalOpen}
        product={selectedProduct}
      />

      {/* Login Restricted Prompt */}
      <AuthPromptDialog
        isOpen={isLoginPromptOpen}
        onOpenChange={setIsLoginPromptOpen}
      />

      {/* Floating Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 p-3 bg-emerald-600 text-white rounded-full shadow-lg hover:bg-emerald-700 hover:shadow-xl transition-all duration-300 z-50 flex items-center justify-center ${
          showScrollTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
        }`}
        aria-label="Back to top"
      >
        <ArrowUp className="w-6 h-6" />
      </button>
    </div>
  );
};
