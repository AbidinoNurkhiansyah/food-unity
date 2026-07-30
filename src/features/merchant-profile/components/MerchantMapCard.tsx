import React from "react";
import { MapPin } from "lucide-react";

interface MerchantMapCardProps {
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  businessName?: string;
}

export const MerchantMapCard: React.FC<MerchantMapCardProps> = ({
  coordinates,
}) => {
  if (!coordinates) return null;

  return (
    <a
      href={`https://www.google.com/maps/search/?api=1&query=${coordinates.latitude},${coordinates.longitude}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center gap-2 p-2 sm:px-4 sm:py-2 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-lg transition-all text-sm cursor-pointer active:scale-95 shadow-sm shadow-primary-500/20"
      title="Open in Google Maps"
    >
      <MapPin className="w-5 h-5 sm:w-4 sm:h-4" /> 
      <span className="hidden sm:inline">Open in Google Maps</span>
    </a>
  );
};
