import React from "react";
import { ArrowLeft, Share2, Store } from "lucide-react";

interface MerchantHeroBannerProps {
  businessName?: string;
  name: string;
  merchantType?: string;
  description?: string;
  bannerImageUrl?: string;
  logoImageUrl?: string;
  onBackClick: () => void;
  onShareClick: () => void;
}

export const MerchantHeroBanner: React.FC<MerchantHeroBannerProps> = ({
  businessName,
  name,
  merchantType,
  description,
  bannerImageUrl,
  logoImageUrl,
  onBackClick,
  onShareClick,
}) => {
  return (
    <div className={`relative h-48 md:h-56 w-full overflow-hidden ${!bannerImageUrl ? 'bg-gradient-to-r from-primary-500 via-primary-600 to-palette-800' : 'bg-slate-900'}`}>
      {bannerImageUrl ? (
        <img 
          src={bannerImageUrl} 
          alt="Store Banner" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
      ) : (
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
      )}
      
      {/* Floating Back Button & Share */}
      <div className="px-4 sm:px-6 lg:px-[130px] pt-6 flex justify-between items-center relative z-10">
        <button
          onClick={onBackClick}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all font-semibold text-sm cursor-pointer shadow-sm active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button
          onClick={onShareClick}
          className="flex items-center justify-center p-2.5 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all cursor-pointer shadow-sm active:scale-95"
          title="Share Profile"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Banner Details */}
      <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 lg:px-[130px] pb-6 text-white flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-white/95 rounded-2xl flex items-center justify-center text-primary-600 shadow-xl border border-white/25 flex-shrink-0 overflow-hidden">
            {logoImageUrl ? (
              <img src={logoImageUrl} alt={businessName || name} className="w-full h-full object-cover" />
            ) : (
              <Store className="w-10 h-10 md:w-12 md:h-12" />
            )}
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
              {description || "No store profile description available yet."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
