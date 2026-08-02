import { useState } from "react";
import { toast } from "sonner";
import { useJsApiLoader } from "@react-google-maps/api";

export const defaultCenter = {
  lat: -6.2,
  lng: 106.816666,
};

export function useMapLocation() {
  const [coordinates, setCoordinates] = useState(defaultCenter);
  const [customCoordinates, setCustomCoordinates] = useState({
    latitude: defaultCenter.lat.toString(),
    longitude: defaultCenter.lng.toString(),
  });
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  // Load Google Maps API Script
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey:
      import.meta.env.VITE_GOOGLE_MAPS_API_KEY ||
      import.meta.env.VITE_FIREBASE_API_KEY ||
      "",
  });

  // Mengambil Koordinat dari GPS Browser
  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsDetectingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoordinates({ lat: latitude, lng: longitude });
          setCustomCoordinates({
            latitude: latitude.toString(),
            longitude: longitude.toString(),
          });
          toast.success("Successfully detected your GPS location!");
          setIsDetectingLocation(false);
        },
        (error) => {
          console.error("Geolocation error:", error);
          toast.error("Failed to get location. Ensure location permissions are active.");
          setIsDetectingLocation(false);
        },
        { enableHighAccuracy: true }
      );
    } else {
      toast.error("Your browser does not support location detection.");
    }
  };

  // Saat peta di-klik untuk menggeser pin
  const onMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setCoordinates({ lat, lng });
      setCustomCoordinates({
        latitude: lat.toString(),
        longitude: lng.toString(),
      });
    }
  };

  const handleCoordChange = (
    field: "latitude" | "longitude",
    value: string
  ) => {
    setCustomCoordinates((prev) => ({ ...prev, [field]: value }));
    const numVal = parseFloat(value);
    if (!isNaN(numVal)) {
      setCoordinates((prev) => ({
        ...prev,
        [field === "latitude" ? "lat" : "lng"]: numVal,
      }));
    }
  };

  return {
    coordinates,
    customCoordinates,
    isDetectingLocation,
    isLoaded,
    loadError,
    handleGetCurrentLocation,
    onMapClick,
    handleCoordChange,
  };
}
