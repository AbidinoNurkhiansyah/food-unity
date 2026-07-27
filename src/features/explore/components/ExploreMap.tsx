import React from "react";
import { createPortal } from "react-dom";
import { GoogleMap } from "@react-google-maps/api";
import type { Product } from "@/features/products/types";
import type { MerchantUser } from "@/features/merchant-profile/types";
import { mapContainerStyle } from "./map/mapConfig";
import { useExploreMap } from "./map/useExploreMap";
import { UserLocationMarker } from "./map/UserLocationMarker";
import { MerchantMarkers } from "./map/MerchantMarkers";
import { MerchantInfoWindow } from "./map/MerchantInfoWindow";
import { MapLoadingState, MapErrorState } from "./map/MapStates";

interface ExploreMapProps {
  products: Product[];
  merchants: MerchantUser[];
  userLocation: { lat: number; lng: number } | null;
  mapCenter: { lat: number; lng: number };
  setMapCenter: (center: { lat: number; lng: number }) => void;
  onSelectProduct: (product: Product) => void;
  searchQuery?: string;
}

export const ExploreMap: React.FC<ExploreMapProps> = ({
  products,
  merchants,
  userLocation,
  mapCenter,
  setMapCenter,
  onSelectProduct,
  searchQuery = "",
}) => {
  const {
    isLoaded,
    loadError,
    onLoad,
    onUnmount,
    handleDragEnd,
    dynamicMapOptions,
    activeMerchants,
    selectedMerchant,
    setSelectedMerchant,
    selectedMerchantProducts,
    userIcon,
    merchantIcon,
  } = useExploreMap({ products, merchants, searchQuery, setMapCenter });

  if (loadError) return <MapErrorState />;
  if (!isLoaded) return <MapLoadingState />;

  return (
    /* Wrapper relatif agar bottom sheet bisa stacking di atasnya */
    <div className="relative border border-slate-100 overflow-hidden shadow-md w-full h-[calc(100vh-4rem)] md:h-[550px] rounded-none border-x-0 md:border-x border-t-0 md:border-t">
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
          onSelectMerchant={(merchant, lat, lng) => {
            setSelectedMerchant(merchant);
            setMapCenter({ lat, lng });
          }}
        />
      </GoogleMap>

      {/* Bottom Sheet — di-render menggunakan createPortal ke document.body agar tidak terpotong oleh parent overflow-hidden */}
      {selectedMerchant && createPortal(
        <MerchantInfoWindow
          merchant={selectedMerchant}
          products={selectedMerchantProducts}
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
