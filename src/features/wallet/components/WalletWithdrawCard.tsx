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
  onSubmit,
}) => {
  return (
    <div className="bg-white rounded-2xl mx-4 p-6 md:p-8 border border-slate-200 shadow-sm flex flex-col justify-center relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-bl-[100px] -z-0 opacity-50 pointer-events-none"></div>

      <div className="relative z-10">
        <div className="p-3.5 bg-primary-50 text-primary-600 rounded-2xl w-fit mb-5 shadow-sm border border-primary-100/50">
          <CreditCard className="w-6 h-6" />
        </div>
        <h3 className="font-bold text-xl text-slate-900 mb-2">
          Withdraw to Bank Account
        </h3>
        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
          The withdrawal process takes{" "}
          <span className="font-medium text-slate-700">1x24 working hours</span>
          .
        </p>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Withdrawal Amount
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <span className="text-slate-500 font-semibold text-lg">Rp</span>
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
                className="w-full pl-14 pr-24 py-4 text-lg border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 font-bold text-slate-900 outline-none transition-all shadow-sm bg-slate-50 focus:bg-white"
              />
              <button
                type="button"
                onClick={onSetMaxAmount}
                className="absolute inset-y-0 right-2 flex items-center"
              >
                <span className="text-xs font-bold bg-primary-100 text-primary-700 px-3 py-1.5 rounded-xl hover:bg-primary-200 transition-colors shadow-sm">
                  MAX
                </span>
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isWithdrawing || !amountToWithdraw || isLoading}
            className="w-full h-14 rounded-2xl bg-primary-600 hover:bg-primary-700 active:scale-[0.98] transition-all text-white font-bold text-base shadow-lg shadow-primary-600/25"
          >
            {isWithdrawing ? "Processing..." : "Withdraw Funds Now"}
            {!isWithdrawing && <ArrowUpRight className="w-5 h-5 ml-2" />}
          </Button>
        </form>
      </div>
    </div>
  );
};
