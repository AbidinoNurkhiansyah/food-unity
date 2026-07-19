import React from "react";
import { CreditCard, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WalletWithdrawCardProps {
  amountToWithdraw: string;
  isWithdrawing: boolean;
  isLoading: boolean;
  onAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSetMaxAmount: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const WalletWithdrawCard: React.FC<WalletWithdrawCardProps> = ({
  amountToWithdraw,
  isWithdrawing,
  isLoading,
  onAmountChange,
  onSetMaxAmount,
  onSubmit
}) => {
  return (
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

      <form onSubmit={onSubmit} className="space-y-4">
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
            onChange={onAmountChange}
            placeholder="0"
            className="w-full pl-12 pr-16 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-semibold text-slate-900 outline-none transition-all"
          />
          <button
            type="button"
            onClick={onSetMaxAmount}
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
  );
};
