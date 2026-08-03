import { useState } from "react";
import { toast } from "sonner";
import { defaultCenter } from "@/features/merchant-onboarding/hooks/useMerchantOnboardingForm";

export function useMerchantLocation() {
  const [coordinates, setCoordinates] = useState(defaultCenter);
  const [customCoordinates, setCustomCoordinates] = useState({
    latitude: defaultCenter.lat.toString(),
    longitude: defaultCenter.lng.toString(),
  });
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

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
      toast.error("Browser does not support location detection.");
    }
  };

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

  const handleCoordChange = (field: "latitude" | "longitude", value: string) => {
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
    setCoordinates,
    customCoordinates,
    setCustomCoordinates,
    isDetectingLocation,
    handleGetCurrentLocation,
    onMapClick,
    handleCoordChange,
  };
}
