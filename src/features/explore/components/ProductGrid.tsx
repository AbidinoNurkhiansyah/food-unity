import React, { useState, useEffect } from "react";
import { ShoppingBag, MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Product } from "@/features/products/types";
import { useCartStore } from "@/features/cart";
import { useAuthStore } from "@/features/auth";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface ProductGridProps {
  products: Product[] | undefined;
  isLoading: boolean;
  onSelectProduct: (product: Product) => void;
  onRequireAuth: () => void;
  variant?: "default" | "compact";
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isLoading,
  onSelectProduct,
  onRequireAuth,
  variant = "default",
}) => {
  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const isCompact = variant === "compact";

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  // Responsive items per page (max 3 rows)
  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerPage(12); // lg: 4 cols * 3 rows
      } else if (window.innerWidth >= 768) {
        setItemsPerPage(9); // md: 3 cols * 3 rows
      } else {
        setItemsPerPage(6); // mobile: 2 cols * 3 rows
      }
    };

    updateItemsPerPage(); // Initial check
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  // Reset to first page when products change (e.g. searching/filtering)
  useEffect(() => {
    setCurrentPage(1);
  }, [products]);

  const totalPages = products ? Math.ceil(products.length / itemsPerPage) : 0;

  // Clamp current page if resize causes total pages to decrease below current page
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const paginatedProducts = products
    ? products.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
    : [];

  return (
    <div className="flex flex-col w-full">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 xl:gap-6">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col h-full bg-white rounded-2xl border border-slate-100 shadow-sm"
            >
              <Skeleton className="aspect-[4/3] w-full rounded-b-none rounded-t-2xl shrink-0" />
              <div
                className={`flex flex-col flex-grow ${
                  isCompact ? "p-3 sm:p-4" : "p-4"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Skeleton className="h-3 w-1/3" />
                  <Skeleton className="h-3 w-10 sm:w-12 rounded" />
                </div>
                <Skeleton className="h-4 sm:h-5 w-3/4 mb-2 mt-1" />
                <div className="space-y-1.5 mb-3 sm:mb-4">
                  <Skeleton className="h-2.5 sm:h-3 w-full" />
                  <Skeleton className="h-2.5 sm:h-3 w-2/3" />
                </div>
                <div className="flex items-end justify-between mt-auto">
                  <Skeleton className="h-4 sm:h-5 w-1/2" />
                  <Skeleton className="h-7 sm:h-8 w-12 sm:w-16 rounded-lg" />
                </div>
              </div>
            </div>
          ))
        ) : paginatedProducts && paginatedProducts.length > 0 ? (
          paginatedProducts.map((product) => {
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
                className="group flex flex-col h-full bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-shadow duration-300 ease-out cursor-pointer"
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
                  <div
                    className={`absolute z-10 ${
                      isCompact
                        ? "top-2 sm:top-3 left-2 sm:left-3"
                        : "top-3 left-3"
                    }`}
                  >
                    {product.isDonation ? (
                      <div
                        className={`bg-primary-600 rounded-md ${
                          isCompact
                            ? "px-2 sm:px-2.5 py-0.5 sm:py-1"
                            : "px-2.5 py-1"
                        }`}
                      >
                        <span
                          className={`font-bold text-white tracking-wide uppercase ${
                            isCompact
                              ? "text-[9px] sm:text-[10px]"
                              : "text-[10px]"
                          }`}
                        >
                          FREE
                        </span>
                      </div>
                    ) : discountPercentage > 0 ? (
                      <div
                        className={`bg-primary-600 rounded-md ${
                          isCompact
                            ? "px-2 sm:px-2.5 py-0.5 sm:py-1"
                            : "px-2.5 py-1"
                        }`}
                      >
                        <span
                          className={`font-bold text-white tracking-wide ${
                            isCompact
                              ? "text-[9px] sm:text-[10px]"
                              : "text-[10px]"
                          }`}
                        >
                          {discountPercentage}% off
                        </span>
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* Content Area */}
                <div
                  className={`flex flex-col flex-grow ${
                    isCompact ? "p-2.5 sm:p-4" : "p-4"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1 gap-1">
                    <span
                      className={`font-semibold text-primary-500 truncate ${
                        isCompact ? "text-[10px] sm:text-xs" : "text-xs"
                      }`}
                    >
                      {product.category || product.merchantName}
                    </span>
                    <span
                      className={`font-medium text-slate-500 whitespace-nowrap bg-slate-100 rounded ${
                        isCompact
                          ? "text-[9px] sm:text-xs px-1 sm:px-1.5 py-0.5"
                          : "text-xs px-1.5 py-0.5"
                      }`}
                    >
                      {product.stock}{" "}
                      {product.unit === "pcs"
                        ? "Pcs"
                        : product.unit === "porsi"
                        ? "Porsi"
                        : product.unit === "box"
                        ? "Box"
                        : product.unit === "kg"
                        ? "Kg"
                        : product.unit === "gram"
                        ? "Gr"
                        : product.unit}
                    </span>
                  </div>

                  <h3
                    className={`font-bold text-slate-800 leading-snug mb-1 line-clamp-2 ${
                      isCompact ? "text-xs sm:text-sm" : "text-sm"
                    }`}
                  >
                    {product.title}
                  </h3>

                  <p
                    className={`${
                      isCompact ? "hidden sm:line-clamp-2" : "line-clamp-2"
                    } text-xs text-slate-500 mb-4 h-8`}
                  >
                    {product.description}
                  </p>

                  <div
                    className={`flex justify-between mt-auto ${
                      isCompact
                        ? "flex-col sm:flex-row sm:items-end gap-2 sm:gap-0 pt-2 sm:pt-0"
                        : "flex-row items-end gap-0 pt-0"
                    }`}
                  >
                    <div className="flex flex-col items-start justify-center">
                      {!product.isDonation &&
                        product.originalPrice > product.discountPrice && (
                          <span
                            className={`text-slate-400 line-through leading-tight ${
                              isCompact
                                ? "text-[9px] sm:text-[10px]"
                                : "text-[10px] sm:text-[11px]"
                            }`}
                          >
                            Rp {product.originalPrice.toLocaleString("id-ID")}
                          </span>
                        )}
                      <span
                        className={`font-bold text-slate-800 leading-tight ${
                          isCompact
                            ? "text-[11px] sm:text-sm"
                            : "text-xs sm:text-sm"
                        }`}
                      >
                        {product.isDonation
                          ? "Rp 0"
                          : `Rp ${product.discountPrice.toLocaleString(
                              "id-ID"
                            )}`}
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
                      className={`flex items-center transition-[background-color,color,transform] duration-200 ease-out active:scale-95 shrink-0 cursor-pointer ${
                        isCompact
                          ? "justify-center gap-1 px-2 py-1.5 sm:px-3 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-bold w-full sm:w-auto"
                          : "gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold w-auto"
                      } ${
                        product.stock <= 0
                          ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                          : "bg-primary-50 text-primary-600 hover:bg-primary-100"
                      }`}
                    >
                      <ShoppingBag
                        size={isCompact ? 12 : 14}
                        className={isCompact ? "sm:w-3.5 sm:h-3.5" : ""}
                      />
                      <span>{product.stock <= 0 ? "Habis" : "Tambah"}</span>
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
            <p className="text-lg font-medium text-slate-600">
              No products available
            </p>
            <p className="text-sm text-slate-400 mt-1">
              Please check back again later.
            </p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {!isLoading && totalPages > 1 && (
        <Pagination className="mt-8 mb-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) {
                    setCurrentPage((p) => Math.max(1, p - 1));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
                className={
                  currentPage === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
                text="Sebelumnya"
              />
            </PaginationItem>

            <PaginationItem>
              <span className="text-sm font-medium text-slate-600 px-4">
                Halaman {currentPage} dari {totalPages}
              </span>
            </PaginationItem>

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages) {
                    setCurrentPage((p) => Math.min(totalPages, p + 1));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
                text="Selanjutnya"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};
