import { useState, useEffect } from "react";
import { useAuthStore } from "@/hooks/useAuthStore";
import { walletApi } from "@/features/wallet/services/walletApi";
import { Wallet, ArrowUpRight, History, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
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
  const { user } = useAuthStore();
  const [balance, setBalance] = useState<number>(0);
  const [amountToWithdraw, setAmountToWithdraw] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isWithdrawing, setIsWithdrawing] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  useEffect(() => {
    if (user?.uid) {
      fetchBalance();
    }
  }, [user]);

  const fetchBalance = async () => {
    try {
      setIsLoading(true);
      if (!user?.uid) return;
      const data = await walletApi.getBalance(user.uid);
      setBalance(data.balance || 0);
    } catch (error) {
      toast.error("Gagal memuat informasi saldo");
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdrawClick = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(amountToWithdraw.replace(/\D/g, "")); 

    if (amount <= 0) {
      toast.error("Nominal penarikan tidak valid");
      return;
    }

    if (amount > balance) {
      toast.error("Saldo tidak mencukupi");
      return;
    }

    setShowConfirm(true);
  };

  const processWithdrawal = async () => {
    setShowConfirm(false);
    const amount = Number(amountToWithdraw.replace(/\D/g, "")); 
    
    try {
      setIsWithdrawing(true);
      if (!user?.uid) return;

      const response = await walletApi.withdrawBalance(user.uid, amount);
      toast.success(
        `Berhasil menarik dana sebesar Rp ${amount.toLocaleString("id-ID")}`,
      );
      setBalance(response.remainingBalance);
      setAmountToWithdraw("");
    } catch (error: any) {
      toast.error(error.message || "Gagal melakukan penarikan dana");
    } finally {
      setIsWithdrawing(false);
    }
  };

  const handleSetMaxAmount = () => {
    setAmountToWithdraw(balance.toString());
  };

  // Helper to format input as Rupiah
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // Extract only numbers
    if (value === "") {
      setAmountToWithdraw("");
    } else {
      // Format visually with commas but store raw string internally? Or just keep it as raw and format in input
      setAmountToWithdraw(value);
    }
  };

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
        {/* Balance Card */}
        <div className="md:col-span-2 bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-lg border border-slate-800">
          <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-500 rounded-full blur-3xl opacity-20 translate-x-1/3 -translate-y-1/3"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-white/10 rounded-xl">
                <Wallet className="w-6 h-6 text-emerald-400" />
              </div>
              <span className="font-medium text-slate-300">
                Total Saldo Aktif
              </span>
            </div>

            <div className="mb-2">
              <span className="text-4xl md:text-6xl font-bold tracking-tighter">
                {isLoading ? "..." : `Rp ${balance.toLocaleString("id-ID")}`}
              </span>
            </div>
            <p className="text-sm text-slate-400">
              Tersedia untuk ditarik kapan saja.
            </p>
          </div>
        </div>

        {/* Action Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/60 shadow-sm flex flex-col justify-center">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl w-fit mb-4">
            <CreditCard className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-slate-900 mb-1">
            Tarik ke Rekening
          </h3>
          <p className="text-sm text-slate-500 mb-6">
            Proses pencairan dana memakan waktu 1x24 jam kerja.
          </p>

          <form onSubmit={handleWithdrawClick} className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <span className="text-slate-500 font-medium">Rp</span>
              </div>
              <input
                type="text"
                value={
                  amountToWithdraw
                    ? Number(amountToWithdraw).toLocaleString("id-ID")
                    : ""
                }
                onChange={handleAmountChange}
                placeholder="0"
                className="w-full pl-12 pr-16 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-semibold text-slate-900 outline-none transition-all"
              />
              <button
                type="button"
                onClick={handleSetMaxAmount}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-md hover:bg-slate-200 transition-colors">
                  MAX
                </span>
              </button>
            </div>

            <Button
              type="submit"
              disabled={isWithdrawing || !amountToWithdraw || isLoading}
              className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
            >
              {isWithdrawing ? "Memproses..." : "Tarik Dana Sekarang"}
              {!isWithdrawing && <ArrowUpRight className="w-4 h-4 ml-2" />}
            </Button>
          </form>
        </div>
      </div>

      {/* Transaction History (Mockup for UI) */}
      <div className="bg-white rounded-3xl border border-slate-200/60 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
            <History className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            Riwayat Penarikan
          </h2>
        </div>

        <div className="text-center py-10">
          <p className="text-slate-500">Belum ada riwayat penarikan dana.</p>
        </div>
      </div>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Penarikan</AlertDialogTitle>
            <AlertDialogDescription>
              Anda akan menarik dana sebesar <b>Rp {Number(amountToWithdraw).toLocaleString("id-ID")}</b> ke rekening yang terdaftar.
              Proses pencairan akan memakan waktu 1x24 jam kerja. Apakah Anda yakin ingin melanjutkan?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={processWithdrawal} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              Ya, Tarik Dana
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
