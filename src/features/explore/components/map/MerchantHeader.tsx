import React from "react";
import { MapPin, X } from "lucide-react";
import type { MerchantUser } from "@/features/merchant-profile/types";

interface MerchantHeaderProps {
  merchant: MerchantUser;
  businessName: string;
  initials: string;
  address: string;
  onClose: () => void;
}

export const MerchantHeader: React.FC<MerchantHeaderProps> = ({
  merchant,
  businessName,
  initials,
  address,
  onClose,
}) => {
  return (
    <div className="relative bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 px-5 py-4 shrink-0">
      <button
        onClick={onClose}
        className="absolute top-3.5 right-4 w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors z-10 cursor-pointer"
      >
        <X size={14} className="text-white" />
      </button>

      {/* Dekoratif */}
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />
      <div className="absolute -bottom-6 -left-6 w-28 h-28 rounded-full bg-white/5 pointer-events-none" />

      <div className="flex items-center gap-4 relative">
        <div className="w-16 h-16 rounded-2xl bg-white/25 border-2 border-white/40 flex items-center justify-center shrink-0 shadow-lg">
          <span className="text-white font-extrabold text-xl tracking-tight">
            {initials}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-white text-lg leading-tight truncate">
            {businessName}
          </h3>

          <div className="flex items-center gap-1.5 mt-1">
            <MapPin size={12} className="text-green-200 shrink-0" />
            <p className="text-[12px] text-green-100 truncate">{address}</p>
          </div>
          {merchant.profile?.merchantType && (
            <span className="shrink-0 bg-white/20 text-white text-[10px] px-2 py-0.5 rounded-full font-medium backdrop-blur-sm border border-white/10">
              {merchant.profile.merchantType}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
