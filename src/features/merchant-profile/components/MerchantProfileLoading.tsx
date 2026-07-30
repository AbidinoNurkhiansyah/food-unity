import React from "react";
import { TopBar } from "@/components/layout/TopBar";
import { ExploreHeader } from "@/features/explore";
import { Loader2 } from "lucide-react";

export const MerchantProfileLoading: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <TopBar />
      <ExploreHeader />
      <div className="flex-1 flex flex-col items-center justify-center py-20">
        <Loader2 className="w-12 h-12 text-primary-500 animate-spin mb-4" />
        <p className="text-slate-600 font-medium">Loading store profile...</p>
      </div>
    </div>
  );
};
