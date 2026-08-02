import { useState, useEffect } from "react";
import { toast } from "sonner";

export const useExploreMapState = () => {
  const [viewMode, setViewMode] = useState<"grid" | "map">(() => {
    return (
      (sessionStorage.getItem("exploreViewMode") as "grid" | "map") || "grid"
    );
  });
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({
    lat: -6.2088,
    lng: 106.8456,
  });
  const [isLocating, setIsLocating] = useState(false);

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Your browser does not support automatic location detection.");
      return;
    }

    setIsLocating(true);
    toast.loading("Detecting your location...", { id: "geolocation" });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newCoords = { lat: latitude, lng: longitude };
        setUserLocation(newCoords);
        setMapCenter(newCoords);
        setViewMode("map"); // Automatically switch to map view
        setIsLocating(false);
        toast.success("Location successfully detected!", { id: "geolocation" });
      },
      (error) => {
        console.error("Error detecting location:", error);
        let errorMsg = "Failed to detect location.";
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg =
            "Location permission denied. Using default location (Jakarta).";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMsg =
            "Location information unavailable. Using default location (Jakarta).";
        } else if (error.code === error.TIMEOUT) {
          errorMsg =
            "Location detection timeout. Using default location (Jakarta).";
        }

        toast.info(errorMsg, { id: "geolocation" });
        setMapCenter({ lat: -6.2088, lng: 106.8456 });
        setViewMode("map"); // Still switch to map view
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

  useEffect(() => {
    if (viewMode === "map" && !userLocation) {
      handleGetCurrentLocation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    viewMode,
    handleViewModeChange,
    userLocation,
    mapCenter,
    setMapCenter,
    isLocating,
  };
};
