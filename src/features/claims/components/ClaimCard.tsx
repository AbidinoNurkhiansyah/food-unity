import React from "react";
import { type Claim } from "../services/claimsApi";
import { useClaimCard } from "../hooks/useClaimCard";
import { formatCurrency } from "@/lib/utils";
import { Clock, CheckCircle2, XCircle, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ClaimCardProps {
  claim: Claim;
  merchantId: string;
  onComplete: (orderId: string) => void;
  isCompleting?: boolean;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "PENDING":
      return (
        <span className="flex items-center gap-1.5 text-yellow-700 bg-yellow-50 px-2.5 py-1 rounded-full text-xs font-medium border border-yellow-200/60">
          <Clock size={14} /> Awaiting Payment
        </span>
      );
    case "PAID":
      return (
        <span className="flex items-center gap-1.5 text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full text-xs font-medium border border-blue-200/60">
          <CheckCircle2 size={14} /> Ready for Pickup
        </span>
      );
    case "COMPLETED":
      return (
        <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full text-xs font-medium border border-emerald-200/60">
          <CheckSquare size={14} /> Picked Up
        </span>
      );
    case "FAILED":
      return (
        <span className="flex items-center gap-1.5 text-red-700 bg-red-50 px-2.5 py-1 rounded-full text-xs font-medium border border-red-200/60">
          <XCircle size={14} /> Cancelled / Expired
        </span>
      );
    default:
      return (
        <span className="flex items-center gap-1.5 text-gray-700 bg-gray-50 px-2.5 py-1 rounded-full text-xs font-medium border border-gray-200/60">
          {status}
        </span>
      );
  }
};

export const ClaimCard: React.FC<ClaimCardProps> = ({
  claim,
  merchantId,
  onComplete,
  isCompleting = false,
}) => {
  const {
    showConfirm,
    setShowConfirm,
    merchantItems,
    merchantTotal,
    formattedDate,
    handleConfirm,
  } = useClaimCard(claim, merchantId, onComplete);

  return (
    <>
      <Accordion type="single" collapsible className="w-full mb-4 sm:mb-5">
        <AccordionItem value={`claim-${claim.orderId}`} className="border-none">
          <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md hover:border-gray-300/80 group">
            <AccordionTrigger className="hover:no-underline p-4 sm:p-5 w-full data-[state=closed]:border-b-0 data-[state=open]:border-b border-gray-100">
              <div className="flex flex-col w-full pr-2 sm:pr-4 text-left gap-1.5 sm:gap-2">
                <div className="flex justify-between items-start w-full gap-2">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-1">
                    <p className="text-[11px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order #{claim.orderId.slice(0, 8)}
                    </p>
                    <span className="text-gray-300 hidden sm:inline-block">
                      •
                    </span>
                    <p className="text-[11px] sm:text-xs text-gray-400 sm:text-gray-500 w-full sm:w-auto">
                      {formattedDate}
                    </p>
                  </div>
                  <div className="shrink-0">
                    {getStatusBadge(claim.status)}
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-0.5 sm:mt-1">
                  <span className="font-semibold text-gray-900 text-sm sm:text-base">
                    {claim.customerDetails.first_name}
                  </span>
                  <span className="text-xs sm:text-sm text-gray-500 hidden sm:inline-block truncate max-w-[200px] md:max-w-xs">
                    ({claim.customerDetails.email})
                  </span>
                </div>
              </div>
            </AccordionTrigger>

            <AccordionContent className="p-0 border-none">
              <div className="p-4 sm:p-5 bg-gray-50/30">
                <div className="space-y-3">
                  {merchantItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-start text-sm"
                    >
                      <div className="flex items-start gap-3">
                        <div className="h-7 w-7 mt-0.5 bg-gray-100 text-gray-700 rounded-md flex items-center justify-center font-medium text-xs shrink-0">
                          {item.quantity}x
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-800 leading-tight pt-1">
                            {item.name}
                          </span>
                        </div>
                      </div>
                      <span className="text-gray-600 font-medium pt-1 shrink-0">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 sm:mt-5 pt-4 border-t border-gray-200/70 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
                  <div className="flex justify-between items-center sm:items-start sm:flex-col sm:space-y-1">
                    <p className="text-xs sm:text-sm text-gray-500">
                      Total Revenue
                    </p>
                    <p className="text-base sm:text-lg font-bold text-gray-900">
                      {formatCurrency(merchantTotal)}
                    </p>
                  </div>

                  {claim.status === "PAID" && (
                    <Button
                      onClick={() => setShowConfirm(true)}
                      disabled={isCompleting}
                      className="w-full sm:w-auto bg-primary-600 hover:bg-primary-700 text-white font-medium px-5 shadow-sm transition-all"
                    >
                      {isCompleting ? "Processing..." : "Confirm Pickup"}
                    </Button>
                  )}
                </div>
              </div>
            </AccordionContent>
          </div>
        </AccordionItem>
      </Accordion>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">
              Confirm Pickup?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-500">
              Are you sure the customer{" "}
              <span className="font-semibold text-gray-900">
                {claim.customerDetails.first_name}
              </span>{" "}
              has picked up their order?
              <br className="mb-2" />
              This order will be marked as completed and the balance will be
              forwarded.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0 mt-2">
            <AlertDialogCancel className="border-gray-200">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              className="bg-primary-600 hover:bg-primary-700 text-white"
            >
              Complete Order
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
