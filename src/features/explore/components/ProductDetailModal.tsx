import React from "react";
import { Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Product } from "@/features/products/types";
import { useCartStore } from "@/features/cart";

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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Detail Produk</DialogTitle>
        </DialogHeader>
        {product && (
          <div className="space-y-4 mt-2">
            <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={
                  product.imageUrl ||
                  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop"
                }
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-bold text-xl">{product.title}</h3>
              <p className="text-gray-500 text-sm mt-1">
                {product.description}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 p-3 rounded-lg">
                <span className="text-gray-500 block mb-1">Harga</span>
                <span className="font-bold text-lg text-primary-500">
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
              <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                <div>
                  <span className="text-gray-500 block text-xs mb-0.5">
                    Sisa Stok
                  </span>
                  <span className="font-semibold">{product.stock} Porsi</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-xs mb-0.5">
                    Batas Ambil
                  </span>
                  <span className="font-semibold flex items-center gap-1">
                    <Clock size={14} /> {product.pickupDeadline ? formatDeadline(product.pickupDeadline) : "-"}
                  </span>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-100">
              <button
                onClick={() => {
                  addItem(product, 1);
                  onClose(false);
                }}
                className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 rounded-xl transition-colors"
              >
                Masukkan Keranjang
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

