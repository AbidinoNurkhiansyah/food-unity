import React from "react";
import { Loader2, MapPin } from "lucide-react";

export const MapLoadingState: React.FC = () => (
  <div className="flex flex-col items-center justify-center bg-white border border-slate-100 rounded-3xl h-[550px] shadow-sm">
    <Loader2 className="w-10 h-10 text-primary-500 animate-spin mb-3" />
    <p className="text-sm font-semibold text-slate-600">
      Loading Interactive Map...
    </p>
  </div>
);

export const MapErrorState: React.FC = () => (
  <div className="flex flex-col items-center justify-center bg-white border border-slate-100 rounded-3xl h-[550px] shadow-sm text-center p-6">
    <MapPin className="w-12 h-12 text-red-500 mb-3 animate-bounce" />
    <h3 className="font-bold text-slate-800 text-lg mb-1">
      Failed to Load Google Maps
    </h3>
    <p className="text-sm text-slate-500 max-w-sm">
      Please check your internet connection or verify that the Google Maps API Key configuration is correct.
    </p>
  </div>
);
