import React, { useEffect, useRef, useCallback } from "react";
import { Package } from "lucide-react";
import type { MerchantUser } from "@/features/merchant-profile/types";
import type { Product } from "@/features/products/types";
import { MerchantHeader } from "./MerchantHeader";
import { MerchantDetails } from "./MerchantDetails";
import { MerchantProductList } from "./MerchantProductList";

interface MerchantInfoWindowProps {
  merchant: MerchantUser;
  products: Product[];
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
  onCloseStart?: () => void;
}

function getShortAddress(m: MerchantUser): string {
  if (!m?.profile?.address) return "Address not available";
  const { districtName, regencyName } = m.profile.address;
  return (
    [districtName, regencyName].filter(Boolean).join(", ") ||
    "Address not available"
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

export const MerchantInfoWindow: React.FC<MerchantInfoWindowProps> = ({
  merchant,
  products,
  onClose,
  onSelectProduct,
  onCloseStart,
}) => {
  const sheetRef = useRef<HTMLDivElement>(null);
  const dragHandleRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  const businessName = merchant.profile?.businessName || merchant.name;
  const initials = getInitials(businessName);
  const address = getShortAddress(merchant);

  // Animasi tutup: slide down bottom sheet & fade out backdrop
  const handleClose = useCallback(() => {
    if (onCloseStart) onCloseStart(); // Beritahu induk bahwa animasi tutup dimulai
    
    const sheet = sheetRef.current;
    const backdrop = backdropRef.current;
    if (sheet) {
      sheet.style.animation = "none";
      void sheet.offsetHeight; // Force reflow
      sheet.style.transition = "transform 0.38s cubic-bezier(0.32,0.72,0,1)";
      sheet.style.transform = "translateY(100%)";
    }
    if (backdrop) {
      backdrop.style.animation = "none";
      void backdrop.offsetHeight; // Force reflow
      backdrop.style.transition = "opacity 0.38s ease";
      backdrop.style.opacity = "0";
    }
    setTimeout(onClose, 380);
  }, [onClose, onCloseStart]);

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
      sheet.style.animation = "none"; // Hilangkan animasi agar bebas di-drag
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
        if (onCloseStart) onCloseStart(); // Beritahu induk bahwa animasi tutup dimulai
        sheet.style.transform = "translateY(100%)";
        const backdrop = backdropRef.current;
        if (backdrop) {
          backdrop.style.animation = "none";
          void backdrop.offsetHeight;
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
  }, [onClose, onCloseStart]);

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
        className="w-full bg-white rounded-t-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        style={{
          animation: "slideUpSheet 0.38s cubic-bezier(0.32,0.72,0,1) both",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle — statis */}
        <div
          ref={dragHandleRef}
          className="flex justify-center pt-3 pb-1 shrink-0 cursor-grab active:cursor-grabbing"
        >
          <div className="w-10 h-1 rounded-full bg-slate-300" />
        </div>

        {/* ── Merchant Profile Header — statis ── */}
        <MerchantHeader
          merchant={merchant}
          businessName={businessName}
          initials={initials}
          address={address}
          onClose={handleClose}
        />

        {/* Badge jumlah produk — statis */}
        <div className="flex justify-center mt-2 px-5 shrink-0">
          <div className="bg-white border border-slate-100 shadow-lg rounded-full px-4 py-2 flex items-center gap-2">
            <Package size={13} className="text-green-600" />
            <span className="text-[12px] font-bold text-slate-700">
              {products.length} Surplus Available
            </span>
          </div>
        </div>

        {/* ── Detail Profil Merchant (Deskripsi, Jam Ambil, Kontak, Detail Alamat) ── */}
        <MerchantDetails merchant={merchant} />

        {/* ── HANYA baris ini yang scroll — overflow-x saja ── */}
        <MerchantProductList
          products={products}
          onSelectProduct={onSelectProduct}
        />
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
