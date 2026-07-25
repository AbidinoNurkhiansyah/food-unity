import React from "react";
import { ArrowLeft, Share2, Store } from "lucide-react";

interface MerchantHeroBannerProps {
  businessName?: string;
  name: string;
  merchantType?: string;
  description?: string;
  onBackClick: () => void;
  onShareClick: () => void;
}

export const MerchantHeroBanner: React.FC<MerchantHeroBannerProps> = ({
  businessName,
  name,
  merchantType,
  description,
  onBackClick,
  onShareClick,
}) => {
  return (
    <div className="relative h-64 md:h-72 w-full overflow-hidden bg-gradient-to-r from-primary-500 via-primary-600 to-palette-800">
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
      
      {/* Floating Back Button & Share */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 pt-6 flex justify-between items-center relative z-10">
        <button
          onClick={onBackClick}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all font-semibold text-sm cursor-pointer shadow-sm active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali
        </button>
        <button
          onClick={onShareClick}
          className="flex items-center justify-center p-2.5 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all cursor-pointer shadow-sm active:scale-95"
          title="Bagikan Profil"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Banner Details */}
      <div className="absolute bottom-0 left-0 right-0 max-w-[1200px] mx-auto px-4 md:px-6 pb-6 text-white flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-white/95 rounded-2xl flex items-center justify-center text-primary-600 shadow-xl border border-white/25 flex-shrink-0">
            <Store className="w-10 h-10 md:w-12 md:h-12" />
          </div>
          <div className="space-y-1.5 md:mb-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl md:text-3.5xl font-black tracking-tight leading-none drop-shadow-sm">
                {businessName || name}
              </h1>
              {merchantType && (
                <span className="px-2.5 py-0.5 bg-white/20 backdrop-blur-sm text-white border border-white/10 rounded-full text-xs font-semibold uppercase tracking-wider">
                  {merchantType}
                </span>
              )}
            </div>
            <p className="text-white/80 text-sm max-w-xl line-clamp-2 leading-relaxed">
              {description || "Belum ada deskripsi profil toko."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
