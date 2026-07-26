import React, { useState, useMemo, useEffect } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader,
  Circle,
} from "@react-google-maps/api";
import { Loader2, MapPin, Store, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Product } from "@/features/products/types";
import type { MerchantUser } from "@/features/merchant-profile/types";

interface ExploreMapProps {
  products: Product[];
  merchants: MerchantUser[];
  userLocation: { lat: number; lng: number } | null;
  mapCenter: { lat: number; lng: number };
  setMapCenter: (center: { lat: number; lng: number }) => void;
  onSelectProduct: (product: Product) => void;
}

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

// Styling map custom (Silver / Premium Light style)
const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
  gestureHandling: "greedy", // Memastikan peta dapat digeser dengan mudah di semua perangkat
  styles: [
    {
      elementType: "geometry",
      stylers: [{ color: "#f4f6f4" }],
    },
    {
      elementType: "labels.text.fill",
      stylers: [{ color: "#4a5a4a" }],
    },
    {
      elementType: "labels.icon",
      stylers: [{ visibility: "off" }],
    },
    {
      elementType: "labels.text.stroke",
      stylers: [{ color: "#ffffff" }],
    },
    {
      featureType: "poi.park",
      elementType: "geometry.fill",
      stylers: [{ color: "#d2ebd2" }],
    },
    {
      featureType: "landscape.man_made.building",
      elementType: "geometry.fill",
      stylers: [
        { color: "#E7EDE7" }, // Jauh lebih gelap untuk kontras tinggi
        { visibility: "on" },
      ],
    },
    {
      featureType: "landscape.man_made.building",
      elementType: "geometry.stroke",
      stylers: [
        { color: "#aeb6ae" }, // Garis tepi yang lebih gelap agar terdefinisi jelas
        { visibility: "on" },
      ],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#ffffff" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.fill",
      stylers: [{ color: "#e3edd9" }],
    },
    {
      featureType: "water",
      elementType: "geometry.fill",
      stylers: [{ color: "#a5cce0" }],
    },
  ],
};

export const ExploreMap: React.FC<ExploreMapProps> = ({
  products,
  merchants,
  userLocation,
  mapCenter,
  setMapCenter,
  onSelectProduct,
}) => {
  const navigate = useNavigate();
  const [selectedMerchant, setSelectedMerchant] = useState<MerchantUser | null>(
    null
  );
  const [map, setMap] = useState<google.maps.Map | null>(null);

  // Load Google Maps API
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey:
      import.meta.env.VITE_GOOGLE_MAPS_API_KEY ||
      import.meta.env.VITE_FIREBASE_API_KEY ||
      "",
  });

  const isMobile = useMemo(() => {
    return window.innerWidth < 768; // md breakpoint
  }, []);

  const dynamicMapOptions = useMemo(() => {
    if (!isLoaded || !window.google) return mapOptions;
    return {
      ...mapOptions,
      zoomControlOptions: {
        position: google.maps.ControlPosition.RIGHT_CENTER, // Pindahkan +/- zoom ke tengah kanan
      },
      fullscreenControlOptions: {
        position: google.maps.ControlPosition.TOP_RIGHT, // TOP_RIGHT agar terdorong oleh padding top
      },
      mapTypeControlOptions: {
        position: google.maps.ControlPosition.TOP_LEFT, // TOP_LEFT agar terdorong oleh padding top
      },
    };
  }, [isLoaded]);

  // Efek untuk memaksa Google Maps memperbarui padding dan opsi kontrol secara real-time pada objek map
  useEffect(() => {
    if (map && window.google) {
      map.setOptions({
        padding: {
          top: isMobile ? 85 : 0,
          right: 0,
          bottom: isMobile ? 100 : 0,
          left: 0,
        },
        zoomControlOptions: {
          position: google.maps.ControlPosition.RIGHT_CENTER,
        },
        fullscreenControlOptions: {
          position: google.maps.ControlPosition.TOP_RIGHT,
        },
        mapTypeControlOptions: {
          position: google.maps.ControlPosition.TOP_LEFT,
        },
      } as any);
    }
  }, [map, isMobile]);

  const onLoad = React.useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  }, []);

  const onUnmount = React.useCallback(() => {
    setMap(null);
  }, []);

  const handleDragEnd = () => {
    if (map) {
      const center = map.getCenter();
      if (center) {
        setMapCenter({
          lat: center.lat(),
          lng: center.lng(),
        });
      }
    }
  };

  // Filter merchants that have active products and valid coordinates
  const activeMerchants = useMemo(() => {
    const merchantIdsWithProducts = new Set(products.map((p) => p.merchantId));
    return merchants.filter((merchant) => {
      const hasProducts = merchantIdsWithProducts.has(merchant.uid);
      const lat = merchant.profile?.coordinates?.latitude;
      const lng = merchant.profile?.coordinates?.longitude;
      return hasProducts && lat !== undefined && lng !== undefined;
    });
  }, [products, merchants]);

  // Find products associated with the selected merchant
  const selectedMerchantProducts = useMemo(() => {
    if (!selectedMerchant) return [];
    return products.filter((p) => p.merchantId === selectedMerchant.uid);
  }, [selectedMerchant, products]);

  // Helper to format full address
  const getFullAddress = (m: MerchantUser) => {
    if (!m?.profile?.address) return "";
    const { detailAddress, villageName, districtName, regencyName } =
      m.profile.address;
    return [detailAddress, villageName, districtName, regencyName]
      .filter(Boolean)
      .join(", ");
  };

  // Custom marker configuration (using SVG paths for vector-sharp visual)
  const userIcon = useMemo(() => {
    if (!isLoaded) return null;
    return {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: "#1A73E8", // Biru khas Google Maps
      fillOpacity: 1,
      strokeColor: "#FFFFFF", // Garis tepi putih
      strokeWeight: 2,
      scale: 7.5, // Ukuran titik biru
    };
  }, [isLoaded]);

  const merchantIcon = useMemo(() => {
    if (!isLoaded) return null;
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 50" width="40" height="50">
        <path d="M20 2C10.6 2 3 9.6 3 19c0 12 17 29 17 29s17-17 17-29c0-9.4-7.6-17-17-17z" fill="#16A34A" stroke="#FFFFFF" stroke-width="2"/>
        <circle cx="20" cy="19" r="10" fill="#FFFFFF"/>
        <g transform="translate(11, 10.5) scale(0.75)" fill="none" stroke="#16A34A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/>
          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
          <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/>
          <path d="M2 7h20"/>
        </g>
      </svg>
    `;
    return {
      url: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`,
      scaledSize: new google.maps.Size(40, 50),
      anchor: new google.maps.Point(20, 48),
    };
  }, [isLoaded]);

  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center bg-white border border-slate-100 rounded-3xl h-[550px] shadow-sm text-center p-6">
        <MapPin className="w-12 h-12 text-red-500 mb-3 animate-bounce" />
        <h3 className="font-bold text-slate-800 text-lg mb-1">
          Google Maps Gagal Dimuat
        </h3>
        <p className="text-sm text-slate-500 max-w-sm">
          Periksa koneksi internet Anda atau pastikan konfigurasi API Key Google
          Maps pada sistem sudah benar.
        </p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center bg-white border border-slate-100 rounded-3xl h-[550px] shadow-sm">
        <Loader2 className="w-10 h-10 text-primary-500 animate-spin mb-3" />
        <p className="text-sm font-semibold text-slate-600">
          Memuat Peta Interaktif...
        </p>
      </div>
    );
  }

  return (
    <div className="border border-slate-100 overflow-hidden shadow-md w-full h-[calc(100vh-4rem)] md:h-[550px] rounded-none border-x-0 md:border-x border-t-0 md:border-t">
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
          <>
            <Marker
              position={userLocation}
              title="Lokasi Anda"
              icon={userIcon}
              zIndex={2}
            />
            <Circle
              center={userLocation}
              radius={20} // Radius 35 meter (area akurasi/radar)
              options={{
                strokeColor: "#1A73E8",
                strokeOpacity: 0.25,
                strokeWeight: 1,
                fillColor: "#1A73E8",
                fillOpacity: 0.12,
                clickable: false,
                zIndex: 1,
              }}
            />
          </>
        )}

        {/* Merchant Markers */}
        {activeMerchants.map((merchant) => {
          const lat = Number(merchant.profile?.coordinates?.latitude);
          const lng = Number(merchant.profile?.coordinates?.longitude);
          if (isNaN(lat) || isNaN(lng)) return null;

          return (
            <Marker
              key={merchant.uid}
              position={{ lat, lng }}
              title={merchant.profile?.businessName || merchant.name}
              icon={merchantIcon || undefined}
              onClick={() => {
                setSelectedMerchant(merchant);
                setMapCenter({ lat, lng });
              }}
            />
          );
        })}

        {/* InfoWindow for Selected Merchant */}
        {selectedMerchant && (
          <InfoWindow
            position={{
              lat: Number(selectedMerchant.profile?.coordinates?.latitude),
              lng: Number(selectedMerchant.profile?.coordinates?.longitude),
            }}
            onCloseClick={() => setSelectedMerchant(null)}
          >
            <div className="w-[280px] max-h-[350px] p-1 overflow-y-auto text-slate-800">
              {/* Header Info */}
              <div className="flex items-start gap-2 mb-3">
                <div className="p-1.5 bg-green-50 rounded-lg text-green-600 mt-0.5 shrink-0">
                  <Store size={16} />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-slate-900 leading-tight truncate">
                    {selectedMerchant.profile?.businessName ||
                      selectedMerchant.name}
                  </h4>
                  <p className="text-[10px] text-slate-500 leading-normal line-clamp-2 mt-0.5">
                    {getFullAddress(selectedMerchant) ||
                      "Detail alamat tidak tersedia"}
                  </p>
                </div>
              </div>

              {/* Product List */}
              <div className="space-y-2 mb-3 border-t border-slate-100 pt-2.5">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                  Produk Surplus Tersedia ({selectedMerchantProducts.length})
                </span>

                <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                  {selectedMerchantProducts.map((product) => {
                    const discountPercentage =
                      product.originalPrice > product.discountPrice
                        ? Math.round(
                            ((product.originalPrice - product.discountPrice) /
                              product.originalPrice) *
                              100
                          )
                        : 0;

                    return (
                      <div
                        key={product.id}
                        onClick={() => onSelectProduct(product)}
                        className="flex items-center gap-2 p-1.5 rounded-lg border border-slate-50 hover:border-green-100 hover:bg-green-50/30 transition-all cursor-pointer"
                      >
                        <img
                          src={
                            product.imageUrl ||
                            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop"
                          }
                          alt={product.title}
                          className="w-10 h-10 object-cover rounded-md bg-slate-50 shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <h5 className="text-xs font-bold text-slate-800 truncate leading-tight">
                            {product.title}
                          </h5>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[11px] font-bold text-slate-900">
                              {product.isDonation
                                ? "Gratis"
                                : `Rp ${product.discountPrice.toLocaleString(
                                    "id-ID"
                                  )}`}
                            </span>
                            {product.isDonation ? (
                              <span className="text-[9px] bg-primary-100 text-primary-700 px-1 rounded font-bold uppercase">
                                Donasi
                              </span>
                            ) : (
                              discountPercentage > 0 && (
                                <span className="text-[9px] bg-primary-100 text-primary-700 px-1 rounded font-bold">
                                  -{discountPercentage}%
                                </span>
                              )
                            )}
                          </div>
                        </div>
                        <div className="shrink-0 text-[10px] text-slate-400 font-medium px-1 bg-slate-100 rounded">
                          x{product.stock}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action: Visit Store */}
              <button
                onClick={() => navigate(`/merchant/${selectedMerchant.uid}`)}
                className="w-full flex items-center justify-center gap-1.5 py-2 bg-palette-800 hover:bg-palette-900 text-white font-bold rounded-lg transition-all text-xs cursor-pointer select-none active:scale-95 shadow-sm"
              >
                <span>Lihat Profil Toko</span>
                <ArrowRight size={12} />
              </button>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};
