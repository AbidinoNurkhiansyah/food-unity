import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/hooks/useAuthStore";
import { ExploreHeader } from "./components/ExploreHeader";
import { Package, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { OrderTabs } from "./components/OrderTabs";
import { OrderCard, type Order } from "./components/OrderCard";
import { db } from "@/config/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";

export const MyOrdersPage: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"ALL" | "PENDING" | "PAID" | "FAILED">("ALL");
  const [orderToCancel, setOrderToCancel] = useState<string | null>(null);

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

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [user]);

  // Keep this dummy function to avoid errors in handlePayNow, but it's actually not needed 
  // since onSnapshot will auto-update the state.
  const fetchOrders = () => {};

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
          fetchOrders(); // Refresh data
        },
        onPending: function (result: any) {
          console.log('Pending:', result);
          fetchOrders();
        },
        onError: function (result: any) {
          console.log('Error:', result);
          fetchOrders();
        },
        onClose: function () {
          console.log('Customer closed the popup');
          fetchOrders();
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

  return (
    <div className="min-h-screen bg-gray-50/50">
      <ExploreHeader />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <button 
            onClick={() => navigate('/explore')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronRight className="rotate-180 text-gray-500" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="text-orange-500" />
            Pesanan Saya
          </h1>
        </div>

        <OrderTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Order List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                  <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-4">
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                  </div>
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-5 w-28" />
                    </div>
                    <Skeleton className="h-10 w-32 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 p-12 text-center shadow-sm">
              <Package className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">Belum Ada Pesanan</h3>
              <p className="text-gray-500 mt-2 text-sm">Anda belum memiliki pesanan di kategori ini.</p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <OrderCard 
                key={order.orderId}
                order={order} 
                onPayNow={handlePayNow} 
                onCancelClick={setOrderToCancel} 
              />
            ))
          )}
        </div>
      </main>

      {/* Confirmation Modal */}
      <AlertDialog open={!!orderToCancel} onOpenChange={(open) => !open && setOrderToCancel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Batalkan Pesanan?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin membatalkan pesanan ini? Aksi ini tidak dapat dibatalkan dan Anda harus memasukkan barang ke keranjang lagi jika ingin memesan ulang.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Kembali</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelOrder} className="bg-red-500 hover:bg-red-600 text-white">
              Ya, Batalkan Pesanan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
