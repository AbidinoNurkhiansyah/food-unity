import { useState, useEffect } from "react";
import { db } from "@/config/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { useAuthStore } from "@/features/auth";
import type { Order } from "../components/OrderCard";

export const useOrders = () => {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"ALL" | "PENDING" | "PAID" | "FAILED">("ALL");
  const [orderToCancel, setOrderToCancel] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.email) return;

    setIsLoading(true);
    
    // Real-time listener ke Firestore
    const q = query(
      collection(db, 'orders'),
      where('customerDetails.email', '==', user.email)
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

  const handleCancelOrder = async () => {
    if (!orderToCancel) return;
    try {
      const res = await fetch(`http://localhost:3001/api/orders/${orderToCancel}/cancel`, {
        method: "POST",
      });
      if (!res.ok) {
        alert("Gagal membatalkan pesanan");
      }
    } catch (error) {
      console.error("Cancel Order Error:", error);
    } finally {
      setOrderToCancel(null);
    }
  };

  const handlePayNow = (snapToken: string | undefined) => {
    if (!snapToken) {
      alert("Token pembayaran tidak ditemukan. Tidak dapat melanjutkan.");
      return;
    }
    
    // @ts-ignore
    if (window.snap) {
      // @ts-ignore
      window.snap.pay(snapToken, {
        onSuccess: function (result: any) {
          console.log('Success:', result);
        },
        onPending: function (result: any) {
          console.log('Pending:', result);
        },
        onError: function (result: any) {
          console.log('Error:', result);
        },
        onClose: function () {
          console.log('Customer closed the popup');
        }
      });
    } else {
      alert("Sistem pembayaran belum siap.");
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "ALL") return true;
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
