import React from "react";
import { MapPin, X } from "lucide-react";
import type { MerchantUser } from "@/features/merchant-profile/types";

interface MerchantHeaderProps {
  merchant: MerchantUser;
  businessName: string;
  initials: string;
  address: string;
  onClose: () => void;
  dragHandleRef?: React.RefObject<HTMLDivElement>;
}

export const MerchantHeader: React.FC<MerchantHeaderProps> = ({
  merchant,
  businessName,
  initials,
  address,
  onClose,
  dragHandleRef,
}) => {
  return (
    <div className="relative bg-palette-700 px-5 pt-3 pb-8 shrink-0 rounded-t-2xl">
      {/* Drag Handle Container (Passed Ref) */}
      <div
        ref={dragHandleRef}
        className="absolute top-0 left-0 right-0 h-8 flex justify-center items-start pt-2.5 cursor-grab active:cursor-grabbing z-20"
      >
        <div className="w-12 h-1.5 rounded-full bg-white/40 shadow-sm" />
      </div>

      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-7 h-7 rounded-full bg-black/10 hover:bg-black/20 backdrop-blur-md flex items-center justify-center transition-colors z-20 cursor-pointer"
      >
        <X size={14} className="text-white" />
      </button>

      {/* Dekoratif */}
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 pointer-events-none blur-2xl" />
      <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-emerald-300/20 pointer-events-none blur-xl" />

      <div className="flex items-center gap-4 relative z-10 mt-5">
        <div className="w-[68px] h-[68px] rounded-2xl bg-white/20 border-[3px] border-white/60 flex items-center justify-center shrink-0 shadow-[0_4px_12px_rgba(0,0,0,0.1)] backdrop-blur-sm overflow-hidden">
          {merchant.profile?.logoImageUrl ? (
            <img
              src={merchant.profile.logoImageUrl}
              alt={businessName}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-white font-black text-2xl tracking-tighter drop-shadow-sm">
              {initials}
            </span>
          )}
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
