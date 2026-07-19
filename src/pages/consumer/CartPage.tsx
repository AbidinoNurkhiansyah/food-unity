import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { useCartStore, CartEmptyState, CartItemCard, CartSummary } from "@/features/cart";

export const CartPage: React.FC = () => {
  const { items } = useCartStore();

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
            <ShoppingBag className="w-5 h-5 text-orange-500" />
            Keranjang Pesanan
          </h1>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 flex flex-col md:flex-row gap-8">
        {/* Cart Items */}
        <div className="flex-1 space-y-4">
          {items.length === 0 ? (
            <CartEmptyState />
          ) : (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
              {items.map((item) => (
                <CartItemCard key={item.product.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Order Summary Checkout */}
        <CartSummary />
      </main>
    </div>
  );
};
