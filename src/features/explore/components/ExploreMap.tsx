import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { GoogleMap, InfoWindow } from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";
import type { Product } from "@/features/products/types";
import type { MerchantUser } from "@/features/merchant-profile/types";
import { mapContainerStyle } from "./map/mapConfig";
import { useExploreMap } from "../hooks/useExploreMap";
import { UserLocationMarker } from "./map/UserLocationMarker";
import { MerchantMarkers } from "./map/MerchantMarkers";
import { MerchantInfoWindow } from "./map/MerchantInfoWindow";
import { MapLoadingState, MapErrorState } from "./map/MapStates";
import { MerchantProductList } from "./map/MerchantProductList";
import { ExternalLink } from "lucide-react";

interface ExploreMapProps {
  products: Product[];
  merchants: MerchantUser[];
  userLocation: { lat: number; lng: number } | null;
  mapCenter: { lat: number; lng: number };
  setMapCenter: (center: { lat: number; lng: number }) => void;
  onSelectProduct: (product: Product) => void;
  searchQuery?: string;
  selectedMerchant: MerchantUser | null;
  setSelectedMerchant: (merchant: MerchantUser | null) => void;
  onCloseStart?: () => void;
}

export const ExploreMap: React.FC<ExploreMapProps> = ({
  products,
  merchants,
  userLocation,
  mapCenter,
  setMapCenter,
  onSelectProduct,
  searchQuery = "",
  selectedMerchant,
  setSelectedMerchant,
  onCloseStart,
}) => {
  const navigate = useNavigate();
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const {
    isLoaded,
    loadError,
    onLoad,
    onUnmount,
    handleDragEnd,
    dynamicMapOptions,
    activeMerchants,
    selectedMerchantProducts,
    userIcon,
    merchantIcon,
  } = useExploreMap({
    products,
    merchants,
    searchQuery,
    setMapCenter,
    selectedMerchant,
    setSelectedMerchant,
  });

  if (loadError) return <MapErrorState />;
  if (!isLoaded) return <MapLoadingState />;

  return (
    /* Wrapper relatif agar bottom sheet bisa stacking di atasnya */
    <div className="relative overflow-hidden w-full h-[calc(100vh-4rem)]">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={mapCenter}
        zoom={20}
        options={dynamicMapOptions}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onDragEnd={handleDragEnd}
      >
        {/* User Location Marker */}
        {userLocation && userIcon && (
          <UserLocationMarker
            userLocation={userLocation}
            userIcon={userIcon}
          />
        )}

        {/* Merchant Markers */}
        <MerchantMarkers
          activeMerchants={activeMerchants}
          merchantIcon={merchantIcon}
          onSelectMerchant={(merchant) => {
            setSelectedMerchant(merchant);
          }}
        />
        {/* Desktop Info Window */}
        {isDesktop && selectedMerchant && (
          <InfoWindow
            position={{
              lat: Number(selectedMerchant.profile?.coordinates?.latitude) || 0,
              lng: Number(selectedMerchant.profile?.coordinates?.longitude) || 0,
            }}
            onCloseClick={() => setSelectedMerchant(null)}
            options={{
              pixelOffset: new google.maps.Size(0, -30),
              maxWidth: 340,
            }}
          >
            <div className="w-[280px] sm:w-[320px] max-w-full pb-1 pt-1 overflow-hidden">
              <div className="flex items-center justify-between mb-1.5 px-3">
                <div className="flex items-center gap-2 overflow-hidden flex-1 mr-2">
                  {selectedMerchant.profile?.logoImageUrl ? (
                    <img src={selectedMerchant.profile.logoImageUrl} alt="" className="w-7 h-7 rounded bg-slate-100 object-cover shrink-0 shadow-sm border border-slate-200/50" />
                  ) : (
                    <div className="w-7 h-7 rounded bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0 text-[10px] shadow-sm border border-emerald-200/50">
                      {selectedMerchant.profile?.businessName ? selectedMerchant.profile.businessName.substring(0, 2).toUpperCase() : "NA"}
                    </div>
                  )}
                  <h3 className="font-bold text-slate-800 text-sm truncate">
                    {selectedMerchant.profile?.businessName || selectedMerchant.name}
                  </h3>
                </div>
                <button 
                  onClick={() => navigate(`/merchant/${selectedMerchant.uid}`)}
                  className="flex items-center gap-1 bg-primary-50 text-primary-600 hover:bg-primary-100 px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-colors shrink-0 cursor-pointer"
                >
                  <span>Show More</span>
                  <ExternalLink size={10} />
                </button>
              </div>
              <div className="-mx-2">
                <MerchantProductList 
                  products={selectedMerchantProducts} 
                  onSelectProduct={(product) => {
                    setSelectedMerchant(null);
                    onSelectProduct(product);
                  }}
                />
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      {/* Bottom Sheet — (Mobile Only) */}
      {!isDesktop && selectedMerchant && createPortal(
        <MerchantInfoWindow
          merchant={selectedMerchant}
          products={selectedMerchantProducts}
          onCloseStart={onCloseStart}
          onClose={() => setSelectedMerchant(null)}
          onSelectProduct={(product) => {
            setSelectedMerchant(null);
            onSelectProduct(product);
          }}
        />,
        document.body
      )}
    </div>
  );
};
