import React from "react";
import { MapPin } from "lucide-react";
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {isLoading ? (
        <div className="col-span-full text-center py-12 text-gray-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-4"></div>
          Memuat produk...
        </div>
      ) : products && products.length > 0 ? (
        products.map((product) => (
          <div
            key={product.id}
            onClick={() => onSelectProduct(product)}
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group cursor-pointer flex flex-col"
          >
            <div className="relative h-48 overflow-hidden bg-gray-50">
              <img
                src={
                  product.imageUrl ||
                  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop"
                }
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {product.isDonation ? (
                <div className="absolute top-3 right-3 bg-palette-500/90 backdrop-blur-sm px-2 py-1 rounded-lg shadow-sm">
                  <span className="text-xs font-bold text-white">
                    Gratis (Donasi)
                  </span>
                </div>
              ) : (
                <div className="absolute top-3 right-3 bg-primary-500/90 backdrop-blur-sm px-2 py-1 rounded-lg shadow-sm">
                  <span className="text-xs font-bold text-white">
                    Rp {product.discountPrice.toLocaleString("id-ID")}
                  </span>
                </div>
              )}
            </div>
            <div className="p-4 flex flex-col flex-grow">
              <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1 group-hover:text-primary-500 transition-colors">
                {product.title}
              </h3>
              <p className="text-sm text-gray-500 mb-3 line-clamp-2 flex-grow">
                {product.description}
              </p>

              <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <MapPin size={12} /> {product.merchantName}
                  </span>
                  <span className="text-xs font-medium text-gray-700 mt-1">
                    Sisa: {product.stock} porsi
                  </span>
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
                  className={`text-sm font-semibold px-4 py-2 rounded-lg transition-colors ${
                    product.stock <= 0
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "text-primary-500 hover:text-primary-600 bg-primary-50 hover:bg-primary-100"
                  }`}
                >
                  {product.stock <= 0 ? "Habis" : "+ Keranjang"}
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="col-span-full text-center py-12 text-gray-500">
          Belum ada produk yang tersedia saat ini.
        </div>
      )}
    </div>
  );
};

