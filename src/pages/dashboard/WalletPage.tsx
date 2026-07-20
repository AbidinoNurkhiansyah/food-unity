import { 
  WalletBalanceCard, 
  WalletWithdrawCard, 
  WalletHistoryCard, 
  useWallet 
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

export function WalletPage() {
  const {
    balance,
    amountToWithdraw,
    isLoading,
    isWithdrawing,
    showConfirm,
    setShowConfirm,
    handleWithdrawClick,
    processWithdrawal,
    handleSetMaxAmount,
    handleAmountChange
  } = useWallet();

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Dompet Mitra
        </h1>
        <p className="text-slate-500 mt-2">
          Kelola pendapatan dan lakukan penarikan dana ke rekening Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <WalletBalanceCard balance={balance} isLoading={isLoading} />
        
        <WalletWithdrawCard 
          amountToWithdraw={amountToWithdraw}
          isWithdrawing={isWithdrawing}
          isLoading={isLoading}
          onAmountChange={handleAmountChange}
          onSetMaxAmount={handleSetMaxAmount}
          onSubmit={handleWithdrawClick}
        />
      </div>

      <WalletHistoryCard />

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Penarikan</AlertDialogTitle>
            <AlertDialogDescription>
              Anda akan menarik dana sebesar <b>Rp {amountToWithdraw ? Number(amountToWithdraw).toLocaleString("id-ID") : "0"}</b> ke rekening yang terdaftar.
              Proses pencairan akan memakan waktu 1x24 jam kerja. Apakah Anda yakin ingin melanjutkan?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={processWithdrawal} className="bg-palette-600 hover:bg-palette-700 text-white">
              Ya, Tarik Dana
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

