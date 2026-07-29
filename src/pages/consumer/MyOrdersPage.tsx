import React from "react";
import { Package } from "lucide-react";

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
import { ConsumerPageHeader } from "@/components/layout/ConsumerPageHeader";
import {
  OrderTabs,
  OrderCard,
  OrderEmptyState,
  OrderSkeletonList,
  useOrders,
} from "@/features/orders";

import { ConsumerFloatingChat } from "@/features/chat";

export const MyOrdersPage: React.FC = () => {
  const {
    orders,
    isLoading,
    activeTab,
    setActiveTab,
    orderToCancel,
    setOrderToCancel,
    handleCancelOrder,
    handlePayNow,
  } = useOrders();

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <ConsumerPageHeader
        title="My Orders"
        icon={<Package className="text-primary-500 w-5 h-5" />}
        backTo="/explore"
      />

      <main className="px-4 sm:px-6 lg:px-[130px] py-8">

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
      <AlertDialog
        open={!!orderToCancel}
        onOpenChange={(open) => !open && setOrderToCancel(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Order?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this order? This action cannot be
              undone and you will have to add the items to the cart again if
              you want to reorder.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelOrder}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Yes, Cancel Order
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ConsumerFloatingChat />
    </div>
  );
};
