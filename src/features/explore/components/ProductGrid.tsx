import React from "react";
import { Heart, ShoppingBag, MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Product } from "@/features/products/types";
import { useCartStore } from "@/features/cart";
import { useAuthStore } from "@/features/auth";

interface ProductGridProps {
  products: Product[] | undefined;
  isLoading: boolean;
  onSelectProduct: (product: Product) => void;
  onRequireAuth: () => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isLoading,
  onSelectProduct,
  onRequireAuth,
}) => {
  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 xl:gap-6">
      {isLoading ? (
        Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col h-full bg-white rounded-2xl border border-slate-100 shadow-sm"
          >
            <Skeleton className="aspect-[4/3] w-full rounded-b-none rounded-t-2xl shrink-0" />
            <div className="flex flex-col flex-grow p-4">
              <div className="flex items-center justify-between mb-1">
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="h-4 w-12 rounded" />
              </div>
              <Skeleton className="h-5 w-3/4 mb-2 mt-1" />
              <div className="space-y-1.5 mb-4">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </div>
              <div className="flex items-end justify-between mt-auto">
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-8 w-16 rounded-lg" />
              </div>
            </div>
          </div>
        ))
      ) : products && products.length > 0 ? (
        products.map((product) => {
          const discountPercentage =
            product.originalPrice > product.discountPrice
              ? Math.round(
                  ((product.originalPrice - product.discountPrice) /
                    product.originalPrice) *
                    100,
                )
              : 0;

          return (
            <div
              key={product.id}
              onClick={() => onSelectProduct(product)}
              className="group flex flex-col h-full bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              {/* Image Area */}
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-2xl bg-slate-50 shrink-0">
                <img
                  src={
                    product.imageUrl ||
                    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop"
                  }
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 z-10">
                  {product.isDonation ? (
                    <div className="bg-primary-600 px-2.5 py-1 rounded-md">
                      <span className="text-[10px] font-bold text-white tracking-wide uppercase">
                        Gratis
                      </span>
                    </div>
                  ) : discountPercentage > 0 ? (
                    <div className="bg-primary-600 px-2.5 py-1 rounded-md">
                      <span className="text-[10px] font-bold text-white tracking-wide">
                        {discountPercentage}% off
                      </span>
                    </div>
                  ) : null}
                </div>

                {/* Heart Icon */}
                <div className="absolute top-3 right-3 z-10">
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="p-1.5 bg-white/90 backdrop-blur-xs rounded-full shadow-sm border border-slate-100 text-slate-400 hover:text-red-500 hover:bg-white transition-colors cursor-pointer"
                  >
                    <Heart size={16} />
                  </button>
                </div>
              </div>

              {/* Content Area */}
              <div className="flex flex-col flex-grow p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-primary-500 truncate mr-2">
                    {product.category || product.merchantName}
                  </span>
                  <span className="text-xs font-medium text-slate-500 whitespace-nowrap bg-slate-100 px-1.5 py-0.5 rounded">
                    {product.stock} {product.unit === 'pcs' ? 'Pcs' : product.unit === 'porsi' ? 'Porsi' : product.unit === 'box' ? 'Box' : product.unit === 'kg' ? 'Kg' : product.unit === 'gram' ? 'Gram' : product.unit}
                  </span>
                </div>

                <h3 className="font-bold text-slate-800 leading-tight mb-1 line-clamp-1">
                  {product.title}
                </h3>

                <p className="text-xs text-slate-500 mb-4 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex items-end justify-between mt-auto">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-sm font-bold text-slate-800">
                      {product.isDonation
                        ? "Rp 0"
                        : `Rp ${product.discountPrice.toLocaleString("id-ID")}`}
                    </span>
                    {!product.isDonation &&
                      product.originalPrice > product.discountPrice && (
                        <span className="text-xs text-slate-400 line-through">
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
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 active:scale-95 shrink-0 cursor-pointer ${
                      product.stock <= 0
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                        : "bg-primary-50 text-primary-600 hover:bg-primary-100"
                    }`}
                  >
                    <ShoppingBag size={14} />
                    <span>{product.stock <= 0 ? "Habis" : "Add"}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-500">
          <div className="bg-slate-50 p-6 rounded-full mb-4">
            <MapPin size={32} className="text-slate-300" />
          </div>
          <p className="text-lg font-medium text-slate-600">Belum ada produk</p>
          <p className="text-sm text-slate-400 mt-1">
            Coba kembali beberapa saat lagi.
          </p>
        </div>
      )}
    </div>
  );
};
