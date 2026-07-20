import React from "react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "../hooks/useCartStore";
import { useCartCheckout } from "../hooks/useCartCheckout";

export const CartSummary: React.FC = () => {
  const { items, getTotalPrice } = useCartStore();
  const { handleCheckout, isLoading } = useCartCheckout();

  if (items.length === 0) return null;

  return (
    <div className="w-full md:w-80 shrink-0">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
        <h3 className="font-bold text-lg text-gray-900 mb-4 border-b border-gray-100 pb-4">
          Ringkasan Belanja
        </h3>
        
        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-gray-600">
            <span>Total Produk</span>
            <span className="font-medium">{items.length} item</span>
          </div>
          <div className="flex justify-between text-gray-600 mt-2">
            <span>Biaya Layanan</span>
            <span className="font-medium">Rp 500</span>
          </div>
          <div className="flex justify-between text-gray-900 font-bold text-lg pt-4 border-t border-gray-100 mt-2">
            <span>Total Tagihan</span>
            <span className="text-primary-500">
              Rp {(getTotalPrice() + 500).toLocaleString("id-ID")}
            </span>
          </div>
        </div>

        <Button
          disabled={isLoading}
          onClick={handleCheckout}
          className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold h-12 rounded-xl"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Memproses...
            </div>
          ) : (
            "Checkout Sekarang"
          )}
        </Button>
      </div>
    </div>
  );
};

