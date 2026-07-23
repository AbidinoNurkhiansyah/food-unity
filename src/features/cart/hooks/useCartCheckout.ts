import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useCartStore } from "./useCartStore";
import { useAuthStore } from "@/features/auth";

declare global {
  interface Window {
    snap: any;
  }
}

export const useCartCheckout = () => {
  const { getSelectedItems, getTotalPrice, removeSelectedItems } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setIsLoading(true);

      if (!user) {
        toast.error("Silakan login terlebih dahulu untuk melakukan checkout.");
        setIsLoading(false);
        return;
      }

      const selectedItems = getSelectedItems();
      if (selectedItems.length === 0) {
        toast.error("Pilih setidaknya 1 produk aktif untuk di-checkout.");
        setIsLoading(false);
        return;
      }

      const token = await user.getIdToken();

      const response = await fetch("http://localhost:3001/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user.uid,
          items: [
            ...selectedItems.map((item) => ({
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
            phone: "08123456789", 
          },
        }),
      });

      const data = await response.json();

      if (data.token) {
        setIsLoading(false);

        // Run Midtrans Snap
        window.snap.pay(data.token, {
          onSuccess: async function (result: any) {
            console.log("Success:", result);
            try {
              const orderId = result?.order_id || data.orderId;
              if (orderId && user) {
                const userToken = await user.getIdToken();
                await fetch(`http://localhost:3001/api/orders/${orderId}/confirm-payment`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${userToken}`,
                  },
                  body: JSON.stringify(result),
                });
              }
            } catch (err) {
              console.error("Confirm Payment Error:", err);
            }
            toast.success("Pembayaran Berhasil!");
            removeSelectedItems();
            navigate("/orders");
          },
          onPending: function (result: any) {
            console.log("Pending:", result);
            toast.success("Menunggu pembayaran...");
            removeSelectedItems();
            navigate("/orders");
          },
          onError: function (result: any) {
            console.log("Error:", result);
            toast.error("Pembayaran gagal!");
            setIsLoading(false);
          },
          onClose: function () {
            console.log("Customer closed the popup without finishing the payment");
            toast.info("Pesanan disimpan di Belum Dibayar. Silakan selesaikan pembayaran.");
            removeSelectedItems();
            navigate("/orders");
            setIsLoading(false);
          },
        });
      } else {
        console.error("Backend Error:", data);
        toast.error(data.error || "Gagal mendapatkan token transaksi.");
        setIsLoading(false);
      }
    } catch (error: any) {
      console.error("Checkout Error:", error);
      const isConnectionError = error?.message === "Failed to fetch" || error?.name === "TypeError";
      toast.error(
        isConnectionError
          ? "Gagal terhubung ke server backend (port 3001). Pastikan Docker / Server Backend sudah berjalan."
          : (error?.message || "Terjadi kesalahan pada sistem.")
      );
      setIsLoading(false);
    }
  };

  return { handleCheckout, isLoading };
};

