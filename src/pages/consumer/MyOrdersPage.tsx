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

export const MyOrdersPage: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"ALL" | "PENDING" | "PAID" | "FAILED">("ALL");
  const [orderToCancel, setOrderToCancel] = useState<string | null>(null);

  useEffect(() => {
    if (user?.email) {
      fetchOrders();
    }
  }, [user]);

  const handleCancelOrder = async () => {
    if (!orderToCancel) return;
    try {
      const res = await fetch(`http://localhost:3001/api/orders/${orderToCancel}/cancel`, {
        method: "POST",
      });
      if (res.ok) {
        fetchOrders();
      } else {
        alert("Gagal membatalkan pesanan");
      }
    } catch (error) {
      console.error("Cancel Order Error:", error);
    } finally {
      setOrderToCancel(null);
    }
  };

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:3001/api/orders?email=${user?.email}`);
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setIsLoading(false);
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
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
              <p className="mt-4 text-gray-500 text-sm">Memuat pesanan Anda...</p>
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
