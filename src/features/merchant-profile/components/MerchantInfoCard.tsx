import React from "react";
import { Clock, Mail, MapPin, Phone, Store } from "lucide-react";

interface MerchantInfoCardProps {
  email: string;
  phoneNumber?: string;
  pickupHours?: string;
  locationNotes?: string;
  fullAddress: string;
}

export const MerchantInfoCard: React.FC<MerchantInfoCardProps> = ({
  email,
  phoneNumber,
  pickupHours,
  locationNotes,
  fullAddress,
}) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-50 pb-2 flex items-center gap-2">
          <Store className="w-5 h-5 text-primary-500" /> Profil Detail Toko
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          
          {/* Address */}
          <div className="space-y-1.5">
            <span className="text-slate-400 font-semibold text-xs uppercase tracking-wider block">
              Alamat Lengkap
            </span>
            <div className="flex items-start gap-2 text-slate-700">
              <MapPin className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{fullAddress}</span>
            </div>
          </div>

          {/* Operational Hours */}
          <div className="space-y-1.5">
            <span className="text-slate-400 font-semibold text-xs uppercase tracking-wider block">
              Waktu Pengambilan
            </span>
            <div className="flex items-start gap-2 text-slate-700">
              <Clock className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" />
              <span className="leading-relaxed font-medium">
                {pickupHours || "Tidak ditentukan"}
              </span>
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <span className="text-slate-400 font-semibold text-xs uppercase tracking-wider block">
              Kontak Telepon
            </span>
            <div className="flex items-center gap-2 text-slate-700">
              <Phone className="w-4 h-4 text-primary-500 shrink-0" />
              <span className="font-semibold">{phoneNumber || "-"}</span>
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <span className="text-slate-400 font-semibold text-xs uppercase tracking-wider block">
              Alamat Email
            </span>
            <div className="flex items-center gap-2 text-slate-700">
              <Mail className="w-4 h-4 text-primary-500 shrink-0" />
              <span>{email}</span>
            </div>
          </div>

        </div>
      </div>

      {locationNotes && (
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm">
          <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider block mb-1">
            Catatan Lokasi / Petunjuk Arah
          </span>
          <p className="text-slate-600 italic">"{locationNotes}"</p>
        </div>
      )}
    </div>
  );
};
