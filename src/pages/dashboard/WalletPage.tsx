import React from "react";
import {
  WalletBalanceCard,
  WalletWithdrawCard,
  WalletHistoryCard,
  WalletBankAccountModal,
  useWallet,
} from "@/features/wallet";
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
import { Dialog, DialogContent } from "@/components/ui/dialog";

export function WalletPage() {
  const {
    balance,
    amountToWithdraw,
    isLoading,
    isWithdrawing,
    history,
    isHistoryLoading,
    showConfirm,
    setShowConfirm,
    showBankModal,
    setShowBankModal,
    bankData,
    handleBankModalSubmit,
    handleWithdrawClick,
    processWithdrawal,
    handleSetMaxAmount,
    handleAmountChange,
  } = useWallet();

  const [showWithdrawModal, setShowWithdrawModal] = React.useState(false);

  // Wrap the submit handler to close the dialog if needed, or rely on showConfirm
  const handleWithdrawSubmit = (e: React.FormEvent) => {
    handleWithdrawClick(e);
    // Modal will stay open beneath the confirm dialog, which is fine.
    // Or we can close it when confirm dialog opens. Let's close it.
    setShowWithdrawModal(false);
  };

  return (
    <div className="max-w-full animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 md:pb-0 mt-4">
      <div className="flex flex-col gap-4">
        {/* Hero Section */}
        <WalletBalanceCard
          balance={balance}
          isLoading={isLoading}
          onWithdrawClick={() => setShowWithdrawModal(true)}
        />

        {/* History Section */}
        <WalletHistoryCard history={history} isLoading={isHistoryLoading} />
      </div>

      <Dialog open={showWithdrawModal} onOpenChange={setShowWithdrawModal}>
        <DialogContent className="p-0 border-none bg-transparent shadow-none max-w-md">
          <WalletWithdrawCard
            amountToWithdraw={amountToWithdraw}
            isWithdrawing={isWithdrawing}
            isLoading={isLoading}
            onAmountChange={handleAmountChange}
            onSetMaxAmount={handleSetMaxAmount}
            onSubmit={handleWithdrawSubmit}
            bankData={bankData}
            onChangeBank={() => setShowBankModal(true)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showBankModal} onOpenChange={setShowBankModal}>
        <DialogContent className="p-0 border-none bg-transparent shadow-none max-w-md">
          <WalletBankAccountModal
            initialData={bankData}
            isLoading={false}
            onSubmit={handleBankModalSubmit}
            onClose={() => setShowBankModal(false)}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Withdrawal</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to withdraw{" "}
              <b>
                Rp{" "}
                {amountToWithdraw
                  ? Number(amountToWithdraw).toLocaleString("id-ID")
                  : "0"}
              </b>{" "}
              to your registered bank account. The withdrawal process will take
              1x24 working hours. Are you sure you want to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={processWithdrawal}
              className="bg-primary-600 cursor-pointer hover:bg-primary-700 text-white cursor-pointer"
            >
              Yes, Withdraw Funds
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
