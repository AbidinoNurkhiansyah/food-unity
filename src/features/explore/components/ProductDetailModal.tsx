import React from "react";
import { Clock, Store, Scale, MessageSquare } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Product } from "@/features/products/types";
import { useCartStore } from "@/features/cart";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  product: Product | null;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  isOpen,
  onClose,
  product,
}) => {
  const { addItem } = useCartStore();
  const navigate = useNavigate();

  const formatDeadline = (deadline: string) => {
    try {
      const date = new Date(deadline);
      if (isNaN(date.getTime())) return deadline; // if parsing fails
      return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch {
      return deadline;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] md:max-w-3xl bg-white border-none ring-0 p-6">
        <DialogHeader>
          <DialogTitle>Detail Produk</DialogTitle>
        </DialogHeader>
        {product && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {/* Kolom Kiri: Gambar */}
            <div className="w-full h-64 md:h-[380px] bg-gray-100 rounded-xl overflow-hidden">
              <img
                src={
                  product.imageUrl ||
                  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop"
                }
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Kolom Kanan: Detail & CTA */}
            <div className="flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2.5 py-0.5 bg-primary-100 text-primary-700 rounded-full text-xs font-semibold capitalize">
                      {product.category}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase ${
                        product.status === "active"
                          ? "bg-green-100 text-green-700"
                          : product.status === "expired"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {product.status === "active"
                        ? "Tersedia"
                        : product.status === "expired"
                        ? "Kedaluwarsa"
                        : "Habis"}
                    </span>
                  </div>
                  <h3 className="font-bold text-2xl text-gray-900 leading-tight">
                    {product.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-gray-500 text-xs mt-1.5">
                    <Store size={14} className="text-primary-500" />
                    <span>
                      Diposting oleh:{" "}
                      <strong className="text-gray-700 font-medium">
                        {product.merchantName}
                      </strong>
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mt-3 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100/50">
                    <span className="text-gray-500 block text-xs mb-1">
                      Harga
                    </span>
                    <span className="font-extrabold text-xl text-primary-500 block">
                      {product.isDonation
                        ? "Gratis"
                        : `Rp ${product.discountPrice.toLocaleString("id-ID")}`}
                    </span>
                    {!product.isDonation &&
                      product.originalPrice > product.discountPrice && (
                        <span className="text-xs text-gray-400 line-through block mt-0.5">
                          Rp {product.originalPrice.toLocaleString("id-ID")}
                        </span>
                      )}
                  </div>
                  <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100/50 space-y-2.5">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-gray-500 block text-xs">
                          Sisa Stok
                        </span>
                        <span className="font-semibold text-gray-800">
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
                            ? "Gram"
                            : product.unit}
                        </span>
                      </div>
                      {product.weightInGrams && (
                        <div className="text-right">
                          <span className="text-gray-500 block text-xs">
                            Estimasi Berat
                          </span>
                          <span className="font-semibold text-gray-800 flex items-center gap-1 justify-end">
                            <Scale size={13} className="text-gray-400" />{" "}
                            {product.weightInGrams}g
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="pt-2 border-t border-gray-200/60">
                      <span className="text-gray-500 block text-xs mb-0.5">
                        Batas Ambil
                      </span>
                      <span className="font-semibold text-gray-800 flex items-center gap-1.5 text-xs">
                        <Clock size={13} className="text-primary-500" />{" "}
                        {product.pickupDeadline
                          ? formatDeadline(product.pickupDeadline)
                          : "-"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex gap-2">
                <button
                  onClick={() => {
                    toast.info(
                      `Fitur Chat dengan ${product.merchantName} akan segera hadir!`
                    );
                  }}
                  className="flex items-center cursor-pointer justify-center p-3 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600 transition-colors"
                  title="Chat Penjual"
                >
                  <MessageSquare size={20} />
                </button>
                <button
                  onClick={() => {
                    addItem(product, 1);
                    onClose(false);
                  }}
                  className="flex-1 border cursor-pointer border-primary-500 hover:bg-primary-50 text-primary-600 font-bold py-3 rounded-xl transition-colors text-sm"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => {
                    addItem(product, 1);
                    onClose(false);
                    navigate("/cart");
                  }}
                  className="flex-1 bg-primary-500 hover:bg-primary-600 text-white cursor-pointer font-bold py-3 rounded-xl transition-colors text-sm"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
