import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import {
  useCartStore,
  CartEmptyState,
  CartItemCard,
  CartSummary,
  isProductExpired,
} from "@/features/cart";
import { TopBar } from "@/components/layout/TopBar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const CartPage: React.FC = () => {
  const {
    items,
    clearExpiredItems,
    toggleSelectAll,
    getSelectedItems,
    removeSelectedItems,
  } = useCartStore();
  const [activeTab, setActiveTab] = useState<"active" | "expired">("active");

  const activeItems = items.filter((item) => !isProductExpired(item.product));
  const expiredItems = items.filter((item) => isProductExpired(item.product));
  const selectedItems = getSelectedItems();

  const allActiveSelected =
    activeItems.length > 0 && selectedItems.length === activeItems.length;
  const someActiveSelected = selectedItems.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative">
      <TopBar />
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-[130px] h-16 flex items-center gap-4">
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

      <main className="flex-1 px-4 sm:px-6 lg:px-[130px] py-8 pb-36 space-y-6">
        {/* Cart Items Container */}
        {items.length === 0 ? (
          <CartEmptyState />
        ) : (
          <>
            {/* Tabs */}
            <div className="flex border border-gray-100 bg-white rounded-2xl p-1.5 shadow-sm gap-2 max-w-md">
              <button
                onClick={() => setActiveTab("active")}
                className={`flex-1 py-3 text-center font-bold text-sm rounded-xl transition-all cursor-pointer ${
                  activeTab === "active"
                    ? "bg-primary-500 text-white shadow-md shadow-primary-500/10"
                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                }`}
              >
                Aktif ({activeItems.length})
              </button>
              <button
                onClick={() => setActiveTab("expired")}
                className={`flex-1 py-3 text-center font-bold text-sm rounded-xl transition-all cursor-pointer ${
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
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Keranjang Aktif Kosong
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Tidak ada produk aktif di keranjang Anda.
                  </p>
                  <Link
                    to="/explore"
                    className="inline-flex items-center justify-center px-6 h-12 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl transition-colors shadow-lg shadow-primary-500/20"
                  >
                    Mulai Belanja
                  </Link>
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
                  {/* Header Pilih Semua & Action Hapus */}
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100 text-sm">
                    <label className="flex items-center gap-3 cursor-pointer select-none font-semibold text-gray-800">
                      <input
                        type="checkbox"
                        checked={allActiveSelected}
                        onChange={(e) => toggleSelectAll(e.target.checked)}
                        className="w-5 h-5 rounded-md accent-palette-700 border-gray-300 text-primary-500 focus:ring-primary-500 cursor-pointer"
                      />
                      <span>
                        Select All ({selectedItems.length}/{activeItems.length})
                      </span>
                    </label>

                    {someActiveSelected && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button className="text-xs font-semibold text-red-500 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer">
                            Delete Selected ({selectedItems.length})
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-white border-none ring-0 sm:rounded-2xl p-6">
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Hapus Produk Terpilih?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Apakah Anda yakin ingin menghapus{" "}
                              <strong>{selectedItems.length} produk</strong> yang
                              dipilih dari keranjang belanja Anda?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="border-none bg-transparent mt-4">
                            <AlertDialogCancel className="border-none shadow-none hover:bg-gray-100 cursor-pointer rounded-xl font-medium">
                              Batal
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={removeSelectedItems}
                              className="bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold cursor-pointer"
                            >
                              Ya, Hapus
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>

                  {activeItems.map((item) => (
                    <CartItemCard key={item.product.id} item={item} />
                  ))}
                </div>
              )
            ) : expiredItems.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-200 flex flex-col items-center justify-center">
                <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Tidak Ada Produk Kadaluarsa
                </h3>
                <p className="text-gray-500">
                  Keranjang Anda bersih dari produk yang kadaluarsa.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-amber-50 text-amber-800 px-4 py-3 rounded-xl border border-amber-100 text-sm">
                  <span className="font-medium">
                    Produk di tab ini sudah melewati batas waktu pengambilan dan
                    tidak bisa di-checkout.
                  </span>
                  <button
                    onClick={clearExpiredItems}
                    className="underline hover:text-amber-950 font-bold shrink-0 ml-2 cursor-pointer"
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
            )}
          </>
        )}
      </main>

      {/* Order Summary Checkout Fixed Bottom Bar */}
      <CartSummary />
    </div>
  );
};
