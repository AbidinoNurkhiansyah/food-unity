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
          onSuccess: function (result: any) {
            console.log("Success:", result);
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

  return { handleCheckout, isLoading };
};

