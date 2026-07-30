import React from "react";
import { Clock, Phone, MapPin } from "lucide-react";
import type { MerchantUser } from "@/features/merchant-profile/types";

interface MerchantDetailsProps {
  merchant: MerchantUser;
}

export const MerchantDetails: React.FC<MerchantDetailsProps> = ({
  merchant,
}) => {
  return (
    <div className="px-5 pb-5 shrink-0 text-xs">
      {merchant.profile?.description && (
        <p className="text-slate-600 mb-4 italic bg-white p-3 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border-[0.5px] border-slate-200/60 leading-relaxed font-medium">
          "{merchant.profile.description}"
        </p>
      )}
      <div className="grid grid-cols-2 gap-3">
        {merchant.profile?.pickupHours && (
          <div className="flex items-center gap-3 text-slate-700 bg-white p-3 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border-[0.5px] border-slate-200/60 transition-all hover:shadow-md">
            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
              <Clock size={14} className="text-palette-700" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">
                Pickup Hours
              </p>
              <p className="font-bold text-slate-800 truncate text-[11px]">
                {merchant.profile.pickupHours}
              </p>
            </div>
          </div>
        )}
        {merchant.profile?.phoneNumber && (
          <div className="flex items-center gap-3 text-slate-700 bg-white p-3 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border-[0.5px] border-slate-200/60 transition-all hover:shadow-md">
            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
              <Phone size={14} className="text-palette-700" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">
                Contact
              </p>
              <p className="font-bold text-slate-800 truncate text-[11px]">
                {merchant.profile.phoneNumber}
              </p>
            </div>
          </div>
        )}
        {merchant.profile?.address?.detailAddress && (
          <div className="col-span-2 flex items-start gap-3 text-slate-700 bg-white p-3 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border-[0.5px] border-slate-200/60 transition-all hover:shadow-md">
            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5">
              <MapPin size={14} className="text-palette-700" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">
                Full Address
              </p>
              <p className="font-bold text-slate-700 leading-snug line-clamp-2 text-[11px]">
                {merchant.profile.address.detailAddress}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
