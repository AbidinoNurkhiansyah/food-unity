import React, { useEffect, useRef, useCallback } from "react";
import { MapPin, Tag, Gift, Package, X, Clock, Phone } from "lucide-react";
import type { MerchantUser } from "@/features/merchant-profile/types";
import type { Product } from "@/features/products/types";

interface MerchantInfoWindowProps {
  merchant: MerchantUser;
  products: Product[];
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

function getShortAddress(m: MerchantUser): string {
  if (!m?.profile?.address) return "Alamat tidak tersedia";
  const { districtName, regencyName } = m.profile.address;
  return (
    [districtName, regencyName].filter(Boolean).join(", ") ||
    "Alamat tidak tersedia"
  );
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function calcDiscount(original: number, discounted: number): number {
  if (original <= discounted) return 0;
  return Math.round(((original - discounted) / original) * 100);
}

export const MerchantInfoWindow: React.FC<MerchantInfoWindowProps> = ({
  merchant,
  products,
  onClose,
  onSelectProduct,
}) => {
  const sheetRef = useRef<HTMLDivElement>(null);
  const dragHandleRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  const businessName = merchant.profile?.businessName || merchant.name;
  const initials = getInitials(businessName);
  const address = getShortAddress(merchant);

  // Animasi tutup: slide down bottom sheet & fade out backdrop
  const handleClose = useCallback(() => {
    const sheet = sheetRef.current;
    const backdrop = backdropRef.current;
    if (sheet) {
      sheet.style.transition = "transform 0.3s cubic-bezier(0.32,0.72,0,1)";
      sheet.style.transform = "translateY(100%)";
    }
    if (backdrop) {
      backdrop.style.transition = "opacity 0.3s ease";
      backdrop.style.opacity = "0";
    }
    setTimeout(onClose, 300);
  }, [onClose]);

  // Tutup saat Escape ditekan
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleClose]);

  // Swipe-down to dismiss (hanya aktif pada drag handle)
  useEffect(() => {
    const handle = dragHandleRef.current;
    const sheet = sheetRef.current;
    if (!handle || !sheet) return;
    let startY = 0;
    let deltaY = 0;
    let active = false;

    const onTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
      active = true;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!active) return;
      deltaY = e.touches[0].clientY - startY;
      if (deltaY > 0) {
        sheet.style.transform = `translateY(${deltaY}px)`;
        sheet.style.transition = "none";
      }
    };
    const onTouchEnd = () => {
      active = false;
      sheet.style.transition = "transform 0.35s cubic-bezier(0.32,0.72,0,1)";
      if (deltaY > 120) {
        sheet.style.transform = "translateY(100%)";
        const backdrop = backdropRef.current;
        if (backdrop) {
          backdrop.style.transition = "opacity 0.35s ease";
          backdrop.style.opacity = "0";
        }
        setTimeout(onClose, 350);
      } else {
        sheet.style.transform = "translateY(0)";
      }
      deltaY = 0;
    };

    handle.addEventListener("touchstart", onTouchStart, { passive: true });
    handle.addEventListener("touchmove", onTouchMove, { passive: true });
    handle.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      handle.removeEventListener("touchstart", onTouchStart);
      handle.removeEventListener("touchmove", onTouchMove);
      handle.removeEventListener("touchend", onTouchEnd);
    };
  }, [onClose]);

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-[9999] flex items-end"
      style={{
        animation: "fadeInBackdrop 0.3s ease both",
        background: "rgba(0,0,0,0.35)",
        backdropFilter: "blur(2px)",
      }}
      onClick={handleClose}
    >
      {/* ── Bottom Sheet ── flex-col, tidak ada overflow-y di sini ── */}
      <div
        ref={sheetRef}
        className="w-full bg-white rounded-t-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto"
        style={{
          animation: "slideUpSheet 0.38s cubic-bezier(0.32,0.72,0,1) both",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle — statis */}
        <div ref={dragHandleRef} className="flex justify-center pt-3 pb-1 shrink-0 cursor-grab active:cursor-grabbing">
          <div className="w-10 h-1 rounded-full bg-slate-300" />
        </div>

        {/* ── Merchant Profile Header — statis ── */}
        <div className="relative bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 px-5 py-4 shrink-0">
          <button
            onClick={handleClose}
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

        {/* Badge jumlah produk — statis */}
        <div className="flex justify-center mt-2 px-5 shrink-0">
          <div className="bg-white border border-slate-100 shadow-lg rounded-full px-4 py-2 flex items-center gap-2">
            <Package size={13} className="text-green-600" />
            <span className="text-[12px] font-bold text-slate-700">
              {products.length} Surplus Tersedia
            </span>
          </div>
        </div>

        {/* ── Detail Profil Merchant (Deskripsi, Jam Ambil, Kontak, Detail Alamat) ── */}
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
                    Jam Ambil
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
                    Kontak
                  </p>
                  <p className="font-semibold text-slate-800 truncate">
                    {merchant.profile.phoneNumber}
                  </p>
                </div>
              </div>
            )}
            {merchant.profile?.address?.detailAddress && (
              <div className="col-span-2 flex items-start gap-2 text-slate-700 bg-slate-50/50 p-2 rounded-lg border border-slate-100/50">
                <MapPin
                  size={14}
                  className="text-emerald-600 mt-0.5 shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">
                    Alamat Lengkap
                  </p>
                  <p className="font-medium text-slate-700 leading-snug line-clamp-2">
                    {merchant.profile.address.detailAddress}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Label section — statis */}
        <div className="flex items-center justify-between px-5 mt-4 mb-3 shrink-0">
          <h4 className="text-sm font-bold text-slate-800">Daftar Produk</h4>
        </div>

        {/* ── HANYA baris ini yang scroll — overflow-x saja ── */}
        {products.length === 0 ? (
          <div className="mx-5 mb-6 shrink-0 flex flex-col items-center justify-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <Package size={28} className="text-slate-300 mb-2" />
            <p className="text-sm text-slate-400 font-medium">
              Tidak ada produk tersedia
            </p>
            <p className="text-[11px] text-slate-300 mt-0.5">
              Cek lagi nanti ya!
            </p>
          </div>
        ) : (
          <div
            className="flex gap-3 px-5 pb-6 shrink-0 snap-x snap-mandatory"
            style={{
              overflowX: "auto",
              overflowY: "hidden",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {products.map((product) => {
              const disc = calcDiscount(
                product.originalPrice,
                product.discountPrice
              );
              return (
                <div
                  key={product.id}
                  onClick={() => onSelectProduct(product)}
                  className="flex-none w-[140px] snap-start bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-green-200 transition-all cursor-pointer group overflow-hidden"
                >
                  {/* Gambar produk */}
                  <div className="relative w-full h-[100px] bg-slate-100 overflow-hidden">
                    <img
                      src={
                        product.imageUrl ||
                        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=300&auto=format&fit=crop"
                      }
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {!product.isDonation && disc > 0 && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                        <Tag size={7} />
                        {disc}%
                      </div>
                    )}
                    {product.isDonation && (
                      <div className="absolute top-2 left-2 bg-primary-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                        <Gift size={7} />
                        Gratis
                      </div>
                    )}
                    <div className="absolute bottom-2 right-2 bg-black/50 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded-full backdrop-blur-sm">
                      ×{product.stock}
                    </div>
                  </div>

                  {/* Info produk */}
                  <div className="p-2.5">
                    <p className="text-[11px] font-semibold text-slate-800 leading-tight line-clamp-2 group-hover:text-green-800 transition-colors">
                      {product.title}
                    </p>
                    <div className="mt-1.5">
                      {product.isDonation ? (
                        <span className="text-[12px] font-bold text-primary-600">
                          Gratis
                        </span>
                      ) : (
                        <>
                          <span className="text-[12px] font-bold text-slate-900">
                            Rp {product.discountPrice.toLocaleString("id-ID")}
                          </span>
                          {disc > 0 && (
                            <p className="text-[9px] text-slate-400 line-through mt-0.5">
                              Rp {product.originalPrice.toLocaleString("id-ID")}
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes slideUpSheet {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
        @keyframes fadeInBackdrop {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .snap-x::-webkit-scrollbar { display: none; }
      `,
        }}
      />
    </div>
  );
};
