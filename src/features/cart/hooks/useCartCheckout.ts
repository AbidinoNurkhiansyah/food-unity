import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useCartStore } from "./useCartStore";
import { useAuthStore } from "@/features/auth";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";

interface SnapResult {
  order_id?: string;
}

interface SnapOptions {
  onSuccess?: (result: SnapResult) => void;
  onPending?: (result: SnapResult) => void;
  onError?: (result: SnapResult) => void;
  onClose?: () => void;
}

declare global {
  interface Window {
    snap: {
      pay: (token: string, options: SnapOptions) => void;
    };
  }
}

const BACKEND_URL = import.meta.env.VITE_API_URL;

export const useCartCheckout = () => {
  const { getSelectedItems, getTotalPrice, removeSelectedItems } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const confirmPaymentMutation = useMutation({
    mutationFn: async ({ orderId, result, token }: { orderId: string; result: SnapResult; token: string }) => {
      const { data } = await axios.post(`${BACKEND_URL}/api/orders/${orderId}/confirm-payment`, result, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      return data;
    },
    onError: (err) => {
      console.error("Confirm Payment Error:", err);
    },
  });

  const checkoutMutation = useMutation({
    mutationFn: async () => {
      if (!user) {
        throw new Error("Please login first to checkout.");
      }

      const selectedItems = getSelectedItems();
      if (selectedItems.length === 0) {
        throw new Error("Please select at least 1 active product to checkout.");
      }

      const token = await user.getIdToken();

      const payload = {
        userId: user.uid,
        items: [
          ...selectedItems.map((item) => ({
            id: item.product.id,
            name: item.product.title,
            price: item.product.isDonation ? 0 : item.product.discountPrice,
            quantity: item.quantity,
            merchantId: item.product.merchantId,
            pickupDeadline: item.product.pickupDeadline,
          })),
          {
            id: "FEE-01",
            name: "Service Fee",
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
      };

      const { data } = await axios.post(`${BACKEND_URL}/api/checkout`, payload, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      return { data, token };
    },
    onSuccess: (result) => {
      const { data, token } = result;

      if (data.token) {
        // Run Midtrans Snap
        window.snap.pay(data.token, {
          onSuccess: async function (snapResult) {
            console.log("Success:", snapResult);
            try {
              const orderId = snapResult?.order_id || data.orderId;
              if (orderId && user) {
                confirmPaymentMutation.mutate({ orderId, result: snapResult, token });
              }
            } catch (err) {
              console.error("Confirm Payment Trigger Error:", err);
            }
            toast.success("Payment Successful!");
            removeSelectedItems();
            navigate("/orders");
          },
          onPending: function (snapResult) {
            console.log("Pending:", snapResult);
            toast.success("Waiting for payment...");
            removeSelectedItems();
            navigate("/orders");
          },
          onError: function (snapResult) {
            console.log("Error:", snapResult);
            toast.error("Payment failed!");
          },
          onClose: function () {
            console.log("Customer closed the popup without finishing the payment");
            toast.info("Order saved in Unpaid. Please complete the payment.");
            removeSelectedItems();
            navigate("/orders");
          },
        });
      } else {
        console.error("Backend Error:", data);
        toast.error(data.error || "Failed to get transaction token.");
      }
    },
    onError: (error: any) => {
      console.error("Checkout Error:", error);
      const errMsg = error?.response?.data?.message || error.message || "";
      const isConnectionError = errMsg === "Network Error" || error.code === 'ERR_NETWORK';
      toast.error(
        isConnectionError
          ? "Failed to connect to backend server. Make sure Docker / Backend Server is running."
          : (errMsg || "A system error occurred.")
      );
    },
  });

  const handleCheckout = () => {
    checkoutMutation.mutate();
  };

  return { handleCheckout, isLoading: checkoutMutation.isPending };
};


