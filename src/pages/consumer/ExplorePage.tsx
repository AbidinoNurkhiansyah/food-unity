import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth";
import { useAllProducts } from "@/features/products/hooks/useProducts";
import type { Product } from "@/features/products/types";
import type { MerchantUser } from "@/features/merchant-profile/types";
import { Loader2 } from "lucide-react";
import {
  ExploreHeader,
  ExploreSearch,
  ProductGrid,
  ProductDetailModal,
  ExploreMap,
  MobileProductBottomSheet,
  useExploreMerchants,
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
  const { data: merchants = [] } = useExploreMerchants();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedMerchant, setSelectedMerchant] = useState<MerchantUser | null>(null);
  const [isSheetHidden, setIsSheetHidden] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false);

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceFilter, setPriceFilter] = useState<"all" | "paid" | "donation">("all");

  // Map and Geolocation States
  const [viewMode, setViewMode] = useState<"grid" | "map">(() => {
    return (sessionStorage.getItem("exploreViewMode") as "grid" | "map") || "grid";
  });
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat: -6.2088, lng: 106.8456 });
  const [isLocating, setIsLocating] = useState(false);

  // Geolocation Handler
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Browser Anda tidak mendukung deteksi lokasi otomatis.");
      return;
    }

    setIsLocating(true);
    toast.loading("Mendeteksi lokasi Anda...", { id: "geolocation" });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newCoords = { lat: latitude, lng: longitude };
        setUserLocation(newCoords);
        setMapCenter(newCoords);
        setViewMode("map"); // Otomatis pindah ke tampilan peta
        setIsLocating(false);
        toast.success("Lokasi berhasil dideteksi!", { id: "geolocation" });
      },
      (error) => {
        console.error("Error detecting location:", error);
        let errorMsg = "Gagal mendeteksi lokasi.";
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = "Izin lokasi ditolak. Menggunakan lokasi default (Jakarta).";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMsg = "Informasi lokasi tidak tersedia. Menggunakan lokasi default (Jakarta).";
        } else if (error.code === error.TIMEOUT) {
          errorMsg = "Deteksi lokasi timeout. Menggunakan lokasi default (Jakarta).";
        }
        
        toast.info(errorMsg, { id: "geolocation" });
        setMapCenter({ lat: -6.2088, lng: 106.8456 });
        setViewMode("map"); // Tetap pindah ke tampilan peta
        setIsLocating(false);
      },
      { enableHighAccuracy: false, timeout: 20000, maximumAge: 600000 }
    );
  };

  const handleViewModeChange = (mode: "grid" | "map") => {
    setViewMode(mode);
    sessionStorage.setItem("exploreViewMode", mode);
    if (mode === "map") {
      handleGetCurrentLocation();
    }
  };

  // Trigger geolocation on mount if we restored "map" mode from sessionStorage
  React.useEffect(() => {
    if (viewMode === "map" && !userLocation) {
      handleGetCurrentLocation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col">
      <ExploreHeader />

      <main className={
        viewMode === "map"
          ? "relative w-full flex-1 px-0 py-0 overflow-hidden"
          : "px-4 sm:px-6 lg:px-[130px] py-6"
      }>
        <div className={viewMode === "map" ? "absolute top-4 md:top-6 left-4 sm:left-6 lg:left-[130px] right-4 sm:right-6 lg:right-[130px] z-20 pointer-events-none [&>*]:pointer-events-auto" : ""}>
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
          <div className="flex flex-col items-center justify-center bg-white h-[calc(100vh-4rem)] w-full text-center p-6">
            <Loader2 className="w-10 h-10 text-primary-500 animate-spin mb-3.5" />
            <h3 className="font-bold text-slate-800 text-base mb-1">
              Mendeteksi Lokasi Anda...
            </h3>
            <p className="text-xs text-slate-500 max-w-xs">
              Mohon tunggu sebentar, sistem sedang mendeteksi koordinat GPS perangkat Anda.
            </p>
          </div>
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
