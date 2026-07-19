import React from "react";
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
import { ExploreHeader } from "@/features/explore";
import { 
  OrderTabs, 
  OrderCard, 
  OrderEmptyState, 
  OrderSkeletonList, 
  useOrders 
} from "@/features/orders";

export const MyOrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    orders,
    isLoading,
    activeTab,
    setActiveTab,
    orderToCancel,
    setOrderToCancel,
    handleCancelOrder,
    handlePayNow
  } = useOrders();

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
            <OrderSkeletonList count={3} />
          ) : orders.length === 0 ? (
            <OrderEmptyState />
          ) : (
            orders.map((order) => (
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
