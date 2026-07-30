import React from "react";
import { Package, Tag, Gift } from "lucide-react";
import type { Product } from "@/features/products/types";

interface MerchantProductListProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

function calcDiscount(original: number, promo: number): number {
  if (!original) return 0;
  return Math.round(((original - promo) / original) * 100);
}

export const MerchantProductList: React.FC<MerchantProductListProps> = ({
  products,
  onSelectProduct,
}) => {
  return (
    <>
      {/* Label section — statis */}
      <div className="flex items-center justify-between px-5 mt-4 mb-3 shrink-0">
        <h4 className="text-sm font-bold text-slate-800">Product List</h4>
      </div>

      {/* Baris produk scrollable */}
      {products.length === 0 ? (
        <div className="mx-5 mb-6 shrink-0 flex flex-col items-center justify-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <Package size={28} className="text-slate-300 mb-2" />
          <p className="text-sm text-slate-400 font-medium">
            No products available
          </p>
          <p className="text-[11px] text-slate-300 mt-0.5">
            Check back again later!
          </p>
        </div>
      ) : (
        <div
          className="flex gap-3 px-5 pb-6 shrink-0 snap-x snap-mandatory scroll-pl-5 after:content-[''] after:w-1 after:shrink-0"
          style={{
            overflowX: "auto",
            overflowY: "hidden",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {products.map((product) => {
            const disc = calcDiscount(product.originalPrice, product.discountPrice);
            return (
              <div
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className="flex-none w-[150px] snap-start bg-white rounded-[20px] border-[0.5px] border-slate-200/60 shadow-[0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-1 hover:border-emerald-200 transition-all duration-300 cursor-pointer group overflow-hidden"
              >
                {/* Gambar produk */}
                <div className="relative w-full h-[110px] bg-slate-100 overflow-hidden">
                  <img
                    src={
                      product.imageUrl ||
                      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=300&auto=format&fit=crop"
                    }
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {!product.isDonation && disc > 0 && (
                    <div className="absolute top-2 left-2 bg-red-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                      <Tag size={8} />
                      {disc}%
                    </div>
                  )}
                  {product.isDonation && (
                    <div className="absolute top-2 left-2 bg-emerald-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                      <Gift size={8} />
                      FREE
                    </div>
                  )}
                  <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-md shadow-sm">
                    ×{product.stock}
                  </div>
                </div>

                {/* Info produk */}
                <div className="p-3">
                  <p className="text-[12px] font-bold text-slate-800 leading-snug line-clamp-2 group-hover:text-emerald-700 transition-colors">
                    {product.title}
                  </p>
                  <div className="mt-2">
                    {product.isDonation ? (
                      <span className="text-[13px] font-black text-emerald-600">
                        FREE
                      </span>
                    ) : (
                      <div className="flex flex-col">
                        <span className="text-[13px] font-black text-slate-900">
                          Rp {product.discountPrice.toLocaleString("id-ID")}
                        </span>
                        {product.originalPrice > product.discountPrice && (
                          <span className="text-[10px] font-semibold text-slate-400 line-through mt-0.5">
                            Rp {product.originalPrice.toLocaleString("id-ID")}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};
