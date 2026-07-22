import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCartStore, isProductExpired } from "../hooks/useCartStore";
import { useCartCheckout } from "../hooks/useCartCheckout";
import { ShoppingBag, ChevronUp, ChevronDown, Info } from "lucide-react";

export const CartSummary: React.FC = () => {
  const { items, getTotalPrice, getSelectedItems } = useCartStore();
  const { handleCheckout, isLoading } = useCartCheckout();
  const [showDetails, setShowDetails] = useState(false);

  const activeItems = items.filter((item) => !isProductExpired(item.product));
  const selectedItems = getSelectedItems();

  if (activeItems.length === 0) return null;

  const subtotal = getTotalPrice();
  const serviceFee = selectedItems.length > 0 ? 500 : 0;
  const grandTotal = subtotal + serviceFee;

  return (
    <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-gray-200/80 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] z-40 px-4 sm:px-6 lg:px-[130px] py-3.5 transition-all">
      {/* Popover Rincian Pembayaran */}
      {showDetails && selectedItems.length > 0 && (
        <div className="max-w-7xl mx-auto mb-3 p-4 bg-gray-50 border border-gray-200/80 rounded-2xl shadow-inner transition-all animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between pb-2 border-b border-gray-200/60 mb-2.5">
            <h4 className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
              <Info size={15} className="text-primary-500" />
              Rincian Pembayaran
            </h4>
            <button
              onClick={() => setShowDetails(false)}
              className="text-xs text-gray-400 hover:text-gray-600 font-medium cursor-pointer"
            >
              Tutup
            </button>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal ({selectedItems.length} item)</span>
              <span className="font-medium">Rp {subtotal.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Biaya Layanan</span>
              <span className="font-medium">Rp {serviceFee.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between text-gray-900 font-bold text-sm pt-2 border-t border-gray-200/80">
              <span>Total Tagihan</span>
              <span className="text-primary-600">Rp {grandTotal.toLocaleString("id-ID")}</span>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-6">
        <div className="flex items-center justify-between w-full sm:w-auto gap-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
              <span>
                {selectedItems.length} dari {activeItems.length} Produk dipilih
              </span>
              {selectedItems.length > 0 && (
                <>
                  <span>•</span>
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="inline-flex items-center gap-0.5 text-primary-600 font-semibold hover:underline cursor-pointer"
                  >
                    Rincian {showDetails ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                  </button>
                </>
              )}
            </div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xs text-gray-500 font-medium">Total Tagihan:</span>
              <span className="text-xl sm:text-2xl font-extrabold text-primary-600">
                Rp {grandTotal.toLocaleString("id-ID")}
              </span>
            </div>
          </div>
        </div>

        <Button
          disabled={isLoading || selectedItems.length === 0}
          onClick={handleCheckout}
          className="w-full sm:w-64 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold h-12 rounded-xl text-base shadow-lg shadow-primary-500/25 transition-colors cursor-pointer shrink-0"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Memproses...
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <ShoppingBag size={18} />
              <span>
                {selectedItems.length === 0
                  ? "Pilih Produk"
                  : `Checkout (${selectedItems.length})`}
              </span>
            </div>
          )}
        </Button>
      </div>
    </div>
  );
};



