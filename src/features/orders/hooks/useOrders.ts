import { useState, useEffect } from "react";
import { db } from "@/config/firebase";
import { collection, query, where, onSnapshot, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { useAuthStore } from "@/features/auth";
import { toast } from "sonner";
import type { Order } from "../components/OrderCard";
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

export const useOrders = () => {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"ALL" | "PENDING" | "PAID" | "FAILED">("ALL");
  const [orderToCancel, setOrderToCancel] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.uid) return;
    
    // Real-time listener ke Firestore berdasarkan userId
    const q = query(
      collection(db, 'orders'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData: Order[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        ordersData.push({
          orderId: data.orderId,
          items: data.items,
          total: data.total,
          status: data.status,
          snapToken: data.snapToken,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString()
        });
      });
      
      // Urutkan dari yang terbaru
      ordersData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      setOrders(ordersData);
      setIsLoading(false);
    }, (error) => {
      console.error("Failed to listen to orders:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const cancelMutation = useMutation({
    mutationFn: async (orderId: string) => {
      if (!user) throw new Error("Please log in first.");
      const token = await user.getIdToken();
      const { data } = await axios.post(
        `${BACKEND_URL}/api/orders/${orderId}/cancel`,
        {},
        {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
      );
      return data;
    },
    onError: (error) => {
      console.warn("Backend cancel error:", error);
    },
  });

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

  const handleCancelOrder = async () => {
    if (!orderToCancel) return;
    try {
      if (!user) {
        toast.error("Please log in first.");
        return;
      }

      // Update Firestore langsung untuk respon instan di UI
      const orderRef = doc(db, 'orders', orderToCancel);
      await updateDoc(orderRef, {
        status: 'FAILED',
        updatedAt: serverTimestamp()
      });

      // Panggil backend untuk membatalkan di Midtrans (asinkron)
      cancelMutation.mutate(orderToCancel);

      toast.success("Order successfully cancelled.");
    } catch (error) {
      console.error("Cancel Order Error:", error);
      toast.error("Failed to cancel order.");
    } finally {
      setOrderToCancel(null);
    }
  };

  const handlePayNow = (snapToken: string | undefined) => {
    if (!snapToken) {
      alert("Payment token not found. Cannot proceed.");
      return;
    }
    
    if (window.snap) {
      window.snap.pay(snapToken, {
        onSuccess: async function (result) {
          console.log('Success:', result);
          try {
            const orderId = result?.order_id;
            if (orderId && user) {
              const userToken = await user.getIdToken();
              confirmPaymentMutation.mutate({ orderId, result, token: userToken });
            }
          } catch (err) {
            console.error("Confirm Payment Trigger Error:", err);
          }
          toast.success("Payment Successful!");
        },
        onPending: function (result) {
          console.log('Pending:', result);
          toast.info("Waiting for payment...");
        },
        onError: function (result) {
          console.log('Error:', result);
          toast.error("Payment failed!");
        },
        onClose: function () {
          console.log('Customer closed the popup');
        }
      });
    } else {
      alert("Payment system is not ready.");
    }
  };

  const filteredOrders = orders.filter((order) => {
    const isExpired = order.items.some((item: any) => {
      if (!item.pickupDeadline) return false;
      return new Date(item.pickupDeadline).getTime() <= Date.now();
    });

    if (activeTab === "ALL") return true;
    if (activeTab === "PAID") {
      return order.status === "PAID" && !isExpired;
    }
    if (activeTab === "FAILED") {
      return order.status === "FAILED" || (order.status === "PAID" && isExpired);
    }
    return order.status === activeTab;
  });

  return {
    orders: filteredOrders,
    isLoading,
    activeTab,
    setActiveTab,
    orderToCancel,
    setOrderToCancel,
    handleCancelOrder,
    handlePayNow
  };
};

