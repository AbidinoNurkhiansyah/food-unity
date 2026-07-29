import React from "react";
import { Clock, Phone, MapPin } from "lucide-react";
import type { MerchantUser } from "@/features/merchant-profile/types";

interface MerchantDetailsProps {
  merchant: MerchantUser;
}

export const MerchantDetails: React.FC<MerchantDetailsProps> = ({ merchant }) => {
  return (
    <div className="px-5 pb-4 border-b border-slate-100 shrink-0 text-xs">
      {merchant.profile?.description && (
        <p className="text-slate-600 mb-3 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100/80 leading-relaxed">
          "{merchant.profile.description}"
        </p>
      )}
      <div className="grid grid-cols-2 gap-3">
        {merchant.profile?.pickupHours && (
          <div className="flex items-center gap-2 text-slate-700 bg-slate-50/50 p-2 rounded-lg border border-slate-100/50">
            <Clock size={14} className="text-emerald-600 shrink-0" />
            <div className="min-w-0">
              <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">
                Pickup Hours
              </p>
              <p className="font-semibold text-slate-800 truncate">
                {merchant.profile.pickupHours}
              </p>
            </div>
          </div>
        )}
        {merchant.profile?.phoneNumber && (
          <div className="flex items-center gap-2 text-slate-700 bg-slate-50/50 p-2 rounded-lg border border-slate-100/50">
            <Phone size={14} className="text-emerald-600 shrink-0" />
            <div className="min-w-0">
              <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">
                Contact
              </p>
              <p className="font-semibold text-slate-800 truncate">
                {merchant.profile.phoneNumber}
              </p>
            </div>
          </div>
        )}
        {merchant.profile?.address?.detailAddress && (
          <div className="col-span-2 flex items-start gap-2 text-slate-700 bg-slate-50/50 p-2 rounded-lg border border-slate-100/50">
            <MapPin size={14} className="text-emerald-600 mt-0.5 shrink-0" />
            <div className="min-w-0">
              <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">
                Full Address
              </p>
              <p className="font-medium text-slate-700 leading-snug line-clamp-2">
                {merchant.profile.address.detailAddress}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
