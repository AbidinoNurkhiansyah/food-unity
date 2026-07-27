import { useState, useMemo, useEffect, useCallback } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import type { Product } from "@/features/products/types";
import type { MerchantUser } from "@/features/merchant-profile/types";
import { mapOptions } from "./mapConfig";

interface UseExploreMapOptions {
  products: Product[];
  merchants: MerchantUser[];
  searchQuery?: string;
  setMapCenter: (center: { lat: number; lng: number }) => void;
  selectedMerchant: MerchantUser | null;
  setSelectedMerchant: (merchant: MerchantUser | null) => void;
}

export function useExploreMap({
  products,
  merchants,
  searchQuery = "",
  setMapCenter,
  selectedMerchant,
  setSelectedMerchant,
}: UseExploreMapOptions) {
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey:
      import.meta.env.VITE_GOOGLE_MAPS_API_KEY ||
      import.meta.env.VITE_FIREBASE_API_KEY ||
      "",
  });

  const isMobile = useMemo(() => window.innerWidth < 768, []);

  const dynamicMapOptions = useMemo(() => {
    if (!isLoaded || !window.google) return mapOptions;
    return {
      ...mapOptions,
      zoomControlOptions: {
        position: google.maps.ControlPosition.RIGHT_CENTER,
      },
      fullscreenControlOptions: {
        position: google.maps.ControlPosition.TOP_RIGHT,
      },
      mapTypeControlOptions: {
        position: google.maps.ControlPosition.TOP_LEFT,
      },
    };
  }, [isLoaded]);

  // Paksa update padding & opsi kontrol setiap kali map atau isMobile berubah
  useEffect(() => {
    if (map && window.google) {
      map.setOptions({
        padding: {
          top: isMobile ? 85 : 0,
          right: 0,
          bottom: isMobile ? (selectedMerchant ? 340 : 250) : 0,
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
  }, [map, isMobile, selectedMerchant]);

  const onLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const handleDragEnd = () => {
    if (map) {
      const center = map.getCenter();
      if (center) {
        setMapCenter({ lat: center.lat(), lng: center.lng() });
      }
    }
  };

  // Set merchant ID yang punya produk aktif (sudah lolos filteredProducts)
  const merchantIdsWithProducts = useMemo(
    () => new Set(products.map((p) => p.merchantId)),
    [products]
  );

  // Semua merchant yang punya koordinat valid
  const merchantsWithCoords = useMemo(() => {
    return merchants.filter((merchant) => {
      const lat = merchant.profile?.coordinates?.latitude;
      const lng = merchant.profile?.coordinates?.longitude;
      return lat !== undefined && lng !== undefined;
    });
  }, [merchants]);

  // Merchant yang tampil di peta:
  // - Jika ada searchQuery → filter by nama toko/merchant (primary) ATAU punya produk yang match (secondary)
  // - Jika tidak ada searchQuery → semua merchant yang punya produk aktif & koordinat valid
  const activeMerchants = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    if (!q) {
      // Mode normal: tampilkan merchant yang punya produk lolos filter
      return merchantsWithCoords.filter((merchant) =>
        merchantIdsWithProducts.has(merchant.uid)
      );
    }

    // Mode search: prioritaskan match nama toko/merchant
    return merchantsWithCoords.filter((merchant) => {
      const businessName = (merchant.profile?.businessName ?? "").toLowerCase();
      const merchantName = (merchant.name ?? "").toLowerCase();
      const nameMatch = businessName.includes(q) || merchantName.includes(q);

      // Tampilkan jika nama toko match ATAU punya produk yang match query
      return nameMatch || merchantIdsWithProducts.has(merchant.uid);
    });
  }, [merchantsWithCoords, merchantIdsWithProducts, searchQuery]);

  // ─── Auto-pan ─────────────────────────────────────────────────────────────
  // Ketika searchQuery berubah, geser peta ke merchant pertama yang nama-nya match.
  // Tidak membuka InfoWindow dan tidak mengubah zoom level.
  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q || !map) return;

    const nameMatches = merchantsWithCoords.filter((merchant) => {
      const businessName = (merchant.profile?.businessName ?? "").toLowerCase();
      const merchantName = (merchant.name ?? "").toLowerCase();
      return businessName.includes(q) || merchantName.includes(q);
    });

    if (nameMatches.length === 0) return;

    const target = nameMatches[0];
    const lat = Number(target.profile?.coordinates?.latitude);
    const lng = Number(target.profile?.coordinates?.longitude);
    if (isNaN(lat) || isNaN(lng)) return;

    // Hanya geser peta, tanpa zoom dan tanpa buka InfoWindow
    map.panTo({ lat, lng });
  }, [searchQuery, map, merchantsWithCoords]);

  // Geser peta secara halus saat selectedMerchant dipilih
  useEffect(() => {
    if (!selectedMerchant || !map) return;
    const lat = Number(selectedMerchant.profile?.coordinates?.latitude);
    const lng = Number(selectedMerchant.profile?.coordinates?.longitude);
    if (isNaN(lat) || isNaN(lng)) return;
    map.panTo({ lat, lng });
  }, [selectedMerchant, map]);

  // Reset selectedMerchant saat search dikosongkan
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSelectedMerchant(null);
    }
  }, [searchQuery]);

  // Produk milik merchant yang sedang dipilih
  const selectedMerchantProducts = useMemo(() => {
    if (!selectedMerchant) return [];
    return products.filter((p) => p.merchantId === selectedMerchant.uid);
  }, [selectedMerchant, products]);

  // Icon lokasi user (titik biru ala Google Maps)
  const userIcon = useMemo(() => {
    if (!isLoaded) return null;
    return {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: "#1A73E8",
      fillOpacity: 1,
      strokeColor: "#FFFFFF",
      strokeWeight: 2,
      scale: 7.5,
    };
  }, [isLoaded]);

  // Icon marker merchant (pin SVG custom)
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

  return {
    isLoaded,
    loadError,
    map,
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
  };
}
