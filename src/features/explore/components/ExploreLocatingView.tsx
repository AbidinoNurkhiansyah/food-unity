import React from "react";
import { Loader2 } from "lucide-react";

export const ExploreLocatingView: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-white h-[calc(100vh-4rem)] w-full text-center p-6">
      <Loader2 className="w-10 h-10 text-primary-500 animate-spin mb-3.5" />
      <h3 className="font-bold text-slate-800 text-base mb-1">
        Detecting Your Location...
      </h3>
      <p className="text-xs text-slate-500 max-w-xs">
        Please wait a moment, the system is detecting your device's
        GPS coordinates.
      </p>
    </div>
  );
};
