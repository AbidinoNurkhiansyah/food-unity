import React, { useState } from "react";
import { motion, useDragControls } from "framer-motion";
import { ShoppingBag, MapPin, Loader2 } from "lucide-react";
import type { Product } from "@/features/products/types";
import { useCartStore } from "@/features/cart";
import { useAuthStore } from "@/features/auth";

interface MobileProductBottomSheetProps {
  products: Product[] | undefined;
  isLoading: boolean;
  onSelectProduct: (product: Product) => void;
  onRequireAuth: () => void;
  isHidden?: boolean;
}

type SnapState = "expanded" | "half" | "collapsed";

export const MobileProductBottomSheet: React.FC<MobileProductBottomSheetProps> = ({
  products = [],
  isLoading,
  onSelectProduct,
  onRequireAuth,
  isHidden = false,
}) => {
  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const dragControls = useDragControls();
  
  const [activeState, setActiveState] = useState<SnapState>("half");

  // Height configurations (relative to absolute positioning at the bottom of a 550px container)
  const variants = {
    expanded: { y: 0 },
    half: { y: 220 },
    collapsed: { y: 380 },
    hidden: { y: 460 },
  };

  const handleDragEnd = (_event: any, info: any) => {
    const dragOffset = info.offset.y;
    const velocity = info.velocity.y;

    // Calculate projected Y position
    let currentY = 220;
    if (activeState === "expanded") currentY = 0;
    if (activeState === "collapsed") currentY = 380;

    const finalY = currentY + dragOffset;

    // Velocity-based fast snapping
    if (velocity < -150) {
      if (activeState === "collapsed") setActiveState("half");
      else if (activeState === "half") setActiveState("expanded");
    } else if (velocity > 150) {
      if (activeState === "expanded") setActiveState("half");
      else if (activeState === "half") setActiveState("collapsed");
    } else {
      // Position-based snapping to nearest state
      const distToExpanded = Math.abs(finalY - 0);
      const distToHalf = Math.abs(finalY - 220);
      const distToCollapsed = Math.abs(finalY - 380);

      const minDist = Math.min(distToExpanded, distToHalf, distToCollapsed);
      if (minDist === distToExpanded) {
        setActiveState("expanded");
      } else if (minDist === distToHalf) {
        setActiveState("half");
      } else {
        setActiveState("collapsed");
      }
    }
  };

  return (
    <motion.div
      drag={isHidden ? false : "y"} // Disable drag when hidden
      dragControls={dragControls}
      dragListener={false} // Only drag via the drag handle
      dragConstraints={{ top: 0, bottom: isHidden ? 460 : 380 }}
      dragElastic={0.15}
      variants={variants}
      animate={isHidden ? "hidden" : activeState}
      onDragEnd={handleDragEnd}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed bottom-0 left-0 right-0 w-full h-[460px] bg-white rounded-t-[28px] shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.1),0_-8px_10px_-6px_rgba(0,0,0,0.05)] border-t border-slate-100 flex flex-col z-30 overflow-hidden"
    >
      {/* Drag Handle & Header (Acts as touch gesture area) */}
      <div
        onPointerDown={(e) => dragControls.start(e)}
        style={{ touchAction: "none" }}
        className="w-full shrink-0 pt-2 pb-3 px-4 bg-white border-b border-slate-50 cursor-grab active:cursor-grabbing flex flex-col items-center select-none touch-none"
      >
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mb-2.5 transition-colors group-hover:bg-slate-400" />
        <div className="w-full flex items-center justify-between px-1">
          <div>
            <h3 className="text-sm font-extrabold text-slate-800">
              Surplus Food Nearby 🍲
            </h3>
            <p className="text-[10px] text-slate-500 font-medium">
              Drag up to expand list
            </p>
          </div>
          <span className="bg-primary-50 text-primary-700 text-xs px-2.5 py-1 rounded-full font-bold">
            {products.length} Items
          </span>
        </div>
      </div>

      {/* Content Area (Scrollable products) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-primary-500 animate-spin mb-2" />
            <p className="text-xs font-semibold text-slate-500">Loading products...</p>
          </div>
        ) : products.length > 0 ? (
          products.map((product) => {
            const discountPercentage =
              product.originalPrice > product.discountPrice
                ? Math.round(
                    ((product.originalPrice - product.discountPrice) /
                      product.originalPrice) *
                      100
                  )
                : 0;

            return (
              <div
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className="flex gap-3 bg-white p-3 rounded-2xl border border-slate-100/80 shadow-sm active:scale-[0.99] transition-transform duration-200 ease-out cursor-pointer"
              >
                {/* Product Image */}
                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                  <img
                    src={
                      product.imageUrl ||
                      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop"
                    }
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Badge */}
                  <div className="absolute top-1.5 left-1.5">
                    {product.isDonation ? (
                      <span className="bg-primary-600 text-[8px] font-bold text-white px-1.5 py-0.5 rounded">
                        FREE
                      </span>
                    ) : (
                      discountPercentage > 0 && (
                        <span className="bg-primary-600 text-[8px] font-bold text-white px-1.5 py-0.5 rounded">
                          -{discountPercentage}%
                        </span>
                      )
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold text-primary-600 truncate">
                        {product.category || product.merchantName}
                      </span>
                      <span className="text-[9px] font-medium text-slate-500 bg-slate-100 px-1.5 rounded shrink-0">
                        x{product.stock} {product.unit}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-800 truncate mt-0.5">
                      {product.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                      {product.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-baseline gap-1">
                      <span className="text-xs font-bold text-slate-800">
                        {product.isDonation
                          ? "Rp 0"
                          : `Rp ${product.discountPrice.toLocaleString("id-ID")}`}
                      </span>
                      {!product.isDonation &&
                        product.originalPrice > product.discountPrice && (
                          <span className="text-[9px] text-slate-400 line-through">
                            Rp {product.originalPrice.toLocaleString("id-ID")}
                          </span>
                        )}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isAuthenticated) {
                          onRequireAuth();
                          return;
                        }
                        if (product.stock > 0) addItem(product, 1);
                      }}
                      disabled={product.stock <= 0}
                      className={`flex items-center gap-1 p-1.5 px-2.5 rounded-lg text-[10px] font-bold transition-[background-color,color,transform] duration-200 ease-out active:scale-95 shrink-0 cursor-pointer ${
                        product.stock <= 0
                          ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                          : "bg-primary-50 text-primary-600 hover:bg-primary-100"
                      }`}
                    >
                      <ShoppingBag size={11} />
                      <span>{product.stock <= 0 ? "Sold" : "Add"}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-slate-500 text-center px-4">
            <div className="bg-slate-100 p-4 rounded-full mb-3">
              <MapPin size={24} className="text-slate-300" />
            </div>
            <p className="text-sm font-semibold text-slate-700">No products nearby</p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Try changing filters or locations.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};
