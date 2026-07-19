import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { useCartStore } from "@/hooks/useCartStore";
import { useAuthStore } from "@/hooks/useAuthStore";
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Extend Window interface for Midtrans Snap
declare global {
  interface Window {
    snap: any;
  }
}

export const CartPage: React.FC = () => {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setIsLoading(true);

      const response = await fetch("http://localhost:3001/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: [
            ...items.map((item) => ({
              id: item.product.id,
              name: item.product.title,
              price: item.product.isDonation ? 0 : item.product.discountPrice,
              quantity: item.quantity,
              merchantId: item.product.merchantId,
            })),
            {
              id: "FEE-01",
              name: "Biaya Layanan",
              price: 500,
              quantity: 1,
              merchantId: null
            }
          ],
          total: getTotalPrice() + 500,
          customerDetails: {
            first_name: user?.displayName || "Customer",
            email: user?.email || "customer@foodunity.com",
            phone: "08123456789", // TODO: Add phone to user profile if needed
          },
        }),
      });

      const data = await response.json();

      if (data.token) {
        setIsLoading(false);

        // Run Midtrans Snap
        window.snap.pay(data.token, {
          onSuccess: function (result: any) {
            console.log("Success:", result);
            toast.success("Pembayaran Berhasil!");
            clearCart();
            navigate("/orders");
          },
          onPending: function (result: any) {
            console.log("Pending:", result);
            toast.success("Menunggu pembayaran...");
            clearCart();
            navigate("/orders");
          },
          onError: function (result: any) {
            console.log("Error:", result);
            toast.error("Pembayaran gagal!");
            setIsLoading(false);
          },
          onClose: function () {
            console.log("Customer closed the popup without finishing the payment");
            setIsLoading(false);
          },
        });
      } else {
        console.error("Backend Error:", data);
        toast.error(data.error || "Gagal mendapatkan token transaksi.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Checkout Error:", error);
      toast.error("Terjadi kesalahan pada sistem.");
      setIsLoading(false);
    }
  };

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
            <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-200 flex flex-col items-center justify-center">
              <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Keranjang Kosong</h3>
              <p className="text-gray-500 mb-6">Anda belum memasukkan produk apapun ke keranjang.</p>
              <Button asChild className="bg-orange-500 hover:bg-orange-600">
                <Link to="/explore">Mulai Belanja</Link>
              </Button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-6 border-b border-gray-100 last:border-0 last:pb-0"
                >
                  <div className="flex gap-4 items-start flex-1">
                    <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                      <img 
                        src={item.product.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop"} 
                        alt={item.product.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 text-lg line-clamp-2">
                        {item.product.title}
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">{item.product.merchantName}</p>
                      <div className="font-bold text-orange-500 mt-2">
                        {item.product.isDonation
                          ? "Gratis"
                          : `Rp ${(item.product.discountPrice * item.quantity).toLocaleString("id-ID")}`}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-auto w-full mt-2 sm:mt-0">
                    <div className="flex items-center border border-gray-200 rounded-lg p-1 bg-white">
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-1 hover:bg-gray-100 rounded-md transition-colors text-gray-600"
                        title="Kurangi"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center font-semibold text-gray-900">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-1 hover:bg-gray-100 rounded-md transition-colors text-gray-600"
                        title="Tambah"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button className="text-red-500 hover:text-red-600 hover:bg-red-50 p-2 rounded-full transition-colors">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Hapus dari Keranjang?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus {item.product.title} dari keranjang?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => removeItem(item.product.id)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Ya, Hapus
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Summary Checkout */}
        {items.length > 0 && (
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
                  <span className="text-orange-500">
                    Rp {(getTotalPrice() + 500).toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              <Button
                disabled={isLoading}
                onClick={handleCheckout}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold h-12 rounded-xl"
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
        )}
      </main>
    </div>
  );
};
