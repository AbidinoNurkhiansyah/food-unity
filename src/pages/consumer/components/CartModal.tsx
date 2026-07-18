import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

// Extend Window interface for Midtrans Snap
declare global {
  interface Window {
    snap: any;
  }
}

interface CartModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
}

export const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const { items, removeItem, getTotalPrice, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setIsLoading(true);
      
      // Hit Backend API on port 3001
      const response = await fetch("http://localhost:3001/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: items.map(item => ({
            id: item.product.id,
            name: item.product.title,
            price: item.product.isDonation ? 0 : item.product.discountPrice,
            quantity: item.quantity
          })),
          total: getTotalPrice(),
          customerDetails: {
            first_name: user?.displayName || "Customer",
            email: user?.email || "customer@foodunity.com",
            phone: "08123456789" // TODO: Add phone to user profile if needed
          }
        }),
      });

      const data = await response.json();

      if (data.token) {
        // Tutup modal keranjang agar tidak menghalangi interaksi (focus trap) popup Midtrans
        onClose(false);
        setIsLoading(false);

        // Run Midtrans Snap
        window.snap.pay(data.token, {
          onSuccess: function(result: any) {
            console.log('Success:', result);
            alert("Pembayaran Berhasil!");
            clearCart();
            onClose(false);
          },
          onPending: function(result: any) {
            console.log('Pending:', result);
            alert("Menunggu pembayaran...");
            clearCart();
            onClose(false);
          },
          onError: function(result: any) {
            console.log('Error:', result);
            alert("Pembayaran gagal!");
            setIsLoading(false);
          },
          onClose: function() {
            console.log('Customer closed the popup without finishing the payment');
            setIsLoading(false);
          }
        });
      } else {
        alert("Gagal mendapatkan token transaksi.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Checkout Error:", error);
      alert("Terjadi kesalahan pada sistem.");
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Keranjang Pesanan</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto py-2 space-y-3">
          {items.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Keranjang masih kosong
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.product.id}
                className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100"
              >
                <div className="flex-1 pr-4">
                  <h4 className="font-semibold line-clamp-1">
                    {item.product.title}
                  </h4>
                  <div className="text-sm text-gray-500 mt-1">
                    {item.product.isDonation
                      ? "Gratis"
                      : `Rp ${item.product.discountPrice.toLocaleString(
                          "id-ID",
                        )}`}{" "}
                    x {item.quantity}
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <span className="font-bold text-orange-500">
                    {item.product.isDonation
                      ? "Gratis"
                      : `Rp ${(
                          item.product.discountPrice * item.quantity
                        ).toLocaleString("id-ID")}`}
                  </span>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className="text-red-500 hover:text-red-700 text-sm font-medium">
                        Hapus
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Hapus dari Keranjang?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Apakah Anda yakin ingin menghapus {item.product.title} dari keranjang pesanan?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => removeItem(item.product.id)}
                          className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
                        >
                          Ya, Hapus
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))
          )}
        </div>
        {items.length > 0 && (
          <div className="pt-4 border-t border-gray-200 mt-auto">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold text-gray-600">
                Total Pembayaran
              </span>
              <span className="font-bold text-xl text-orange-500">
                Rp {getTotalPrice().toLocaleString("id-ID")}
              </span>
            </div>
            <button
              disabled={isLoading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center"
              onClick={handleCheckout}
            >
              {isLoading ? "Memproses..." : "Checkout Sekarang"}
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
