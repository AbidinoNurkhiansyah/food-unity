import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { useCartStore, CartEmptyState, CartItemCard, CartSummary, isProductExpired } from "@/features/cart";

export const CartPage: React.FC = () => {
  const { items, clearExpiredItems } = useCartStore();
  const [activeTab, setActiveTab] = useState<"active" | "expired">("active");

  const activeItems = items.filter((item) => !isProductExpired(item.product));
  const expiredItems = items.filter((item) => isProductExpired(item.product));

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center gap-4">
          <Link
            to="/explore"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary-500" />
            Keranjang Pesanan
          </h1>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 flex flex-col md:flex-row gap-8">
        {/* Cart Items */}
        <div className="flex-1 space-y-6">
          {items.length === 0 ? (
            <CartEmptyState />
          ) : (
            <>
              {/* Tabs */}
              <div className="flex border border-gray-100 bg-white rounded-2xl p-1.5 shadow-sm gap-2">
                <button
                  onClick={() => setActiveTab("active")}
                  className={`flex-1 py-3 text-center font-bold text-sm rounded-xl transition-all ${
                    activeTab === "active"
                      ? "bg-primary-500 text-white shadow-md shadow-primary-500/10"
                      : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  Aktif ({activeItems.length})
                </button>
                <button
                  onClick={() => setActiveTab("expired")}
                  className={`flex-1 py-3 text-center font-bold text-sm rounded-xl transition-all ${
                    activeTab === "expired"
                      ? "bg-primary-500 text-white shadow-md shadow-primary-500/10"
                      : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  Kadaluarsa ({expiredItems.length})
                </button>
              </div>

              {activeTab === "active" ? (
                activeItems.length === 0 ? (
                  <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-200 flex flex-col items-center justify-center">
                    <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Keranjang Aktif Kosong</h3>
                    <p className="text-gray-500 mb-6">Tidak ada produk aktif di keranjang Anda.</p>
                    <Link 
                      to="/explore" 
                      className="inline-flex items-center justify-center px-6 h-12 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl transition-colors shadow-lg shadow-primary-500/20"
                    >
                      Mulai Belanja
                    </Link>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
                    {activeItems.map((item) => (
                      <CartItemCard key={item.product.id} item={item} />
                    ))}
                  </div>
                )
              ) : (
                expiredItems.length === 0 ? (
                  <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-200 flex flex-col items-center justify-center">
                    <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Tidak Ada Produk Kadaluarsa</h3>
                    <p className="text-gray-500">Keranjang Anda bersih dari produk yang kadaluarsa.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center bg-amber-50 text-amber-800 px-4 py-3 rounded-xl border border-amber-100 text-sm">
                      <span className="font-medium">
                        Produk di tab ini sudah melewati batas waktu pengambilan dan tidak bisa di-checkout.
                      </span>
                      <button 
                        onClick={clearExpiredItems}
                        className="underline hover:text-amber-950 font-bold shrink-0 ml-2"
                      >
                        Hapus Semua
                      </button>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
                      {expiredItems.map((item) => (
                        <CartItemCard key={item.product.id} item={item} />
                      ))}
                    </div>
                  </div>
                )
              )}
            </>
          )}
        </div>

        {/* Order Summary Checkout */}
        <CartSummary />
      </main>
    </div>
  );
};
