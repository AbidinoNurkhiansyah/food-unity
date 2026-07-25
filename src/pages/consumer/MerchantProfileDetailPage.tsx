import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMerchantProducts } from "@/features/products/hooks/useProducts";
import { TopBar } from "@/components/layout/TopBar";
import { ExploreHeader, ProductGrid, ProductDetailModal } from "@/features/explore";
import { useJsApiLoader } from "@react-google-maps/api";
import { Loader2 } from "lucide-react";
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

// Import components, custom hooks, and constants from merchant-profile feature
import {
  MerchantHeroBanner,
  MerchantInfoCard,
  MerchantMapCard,
  useMerchantProfileDetail,
} from "@/features/merchant-profile";

export const MerchantProfileDetailPage: React.FC = () => {
  const { merchantId } = useParams<{ merchantId: string }>();
  const navigate = useNavigate();

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
  const { data: products, isLoading: isLoadingProducts } = useMerchantProducts(merchantId);

  // Load Google Maps API (shared script loader)
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey:
      import.meta.env.VITE_GOOGLE_MAPS_API_KEY ||
      import.meta.env.VITE_FIREBASE_API_KEY ||
      "",
  });

  // Filter only active products
  const activeProducts = products?.filter((p) => p.status === "active") || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <TopBar />
        <ExploreHeader />
        <div className="flex-1 flex flex-col items-center justify-center py-20">
          <Loader2 className="w-12 h-12 text-primary-500 animate-spin mb-4" />
          <p className="text-slate-600 font-medium">Memuat profil toko...</p>
        </div>
      </div>
    );
  }

  if (!merchant) {
    return null;
  }

  const profile = merchant.profile;

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      <TopBar />
      <ExploreHeader />

      {/* Hero Banner Section */}
      <MerchantHeroBanner
        businessName={profile?.businessName}
        name={merchant.name}
        merchantType={profile?.merchantType}
        description={profile?.description}
        onBackClick={() => navigate("/explore")}
        onShareClick={handleShare}
      />

      {/* Main Content Layout */}
      <main className="max-w-[1200px] mx-auto px-4 md:px-6 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Details Information & Products */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Store Information Card */}
            <MerchantInfoCard
              email={merchant.email}
              phoneNumber={profile?.phoneNumber}
              pickupHours={profile?.pickupHours}
              locationNotes={profile?.locationNotes}
              fullAddress={getFullAddress()}
            />

            {/* Products / Packages List Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">
                    Paket Makanan Tersedia
                  </h2>
                  <p className="text-slate-500 text-xs mt-0.5">
                    Pilih paket makanan dari {profile?.businessName || merchant.name} untuk menyelamatkan makanan!
                  </p>
                </div>
                <div className="px-3 py-1 bg-primary-50 border border-primary-100 rounded-full text-xs font-bold text-primary-700">
                  {activeProducts.length} Paket
                </div>
              </div>

              <ProductGrid
                products={activeProducts}
                isLoading={isLoadingProducts}
                onSelectProduct={handleSelectProduct}
                onRequireAuth={handleRequireAuth}
              />
            </div>

          </div>

          {/* Right Column: Google Map Visual */}
          <div className="space-y-6">
            <MerchantMapCard
              isLoaded={isLoaded}
              loadError={loadError}
              coordinates={profile?.coordinates}
            />
          </div>

        </div>
      </main>

      {/* Product Detail Modal */}
      <ProductDetailModal
        isOpen={isProductModalOpen}
        onClose={setIsProductModalOpen}
        product={selectedProduct}
      />

      {/* Login Restricted Prompt */}
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
