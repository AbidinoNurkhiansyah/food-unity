import React from "react";
import { Wallet, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WalletBalanceCardProps {
  balance: number;
  isLoading: boolean;
  onWithdrawClick: () => void;
}

export const WalletBalanceCard: React.FC<WalletBalanceCardProps> = ({
  balance,
  isLoading,
  onWithdrawClick,
}) => {
  return (
    <div className="bg-slate-900 rounded-3xl p-8 md:p-10 text-white relative overflow-hidden shadow-2xl border border-slate-800">
      {/* Decorative Gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-primary-500/30 to-primary-700/0 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-gradient-to-tr from-primary-500/20 to-transparent rounded-full blur-3xl -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

      <div className="relative z-10 flex flex-col h-full justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md shadow-inner border border-white/10">
            <Wallet className="w-6 h-6 text-primary-300" />
          </div>
          <span className="font-semibold text-lg text-slate-300 tracking-wide">
            Total Active Balance
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="mb-1">
              <span className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">
                {isLoading ? "..." : `Rp ${balance.toLocaleString("id-ID")}`}
              </span>
            </div>
            <p className="text-sm md:text-base text-slate-400 font-medium max-w-sm mt-2">
              Your balance is available to withdraw at any time to your registered bank account.
            </p>
          </div>

          <Button
            onClick={onWithdrawClick}
            className="h-12 px-6 md:h-14 md:px-8 rounded-2xl bg-primary-500 hover:bg-primary-400 text-white font-bold text-sm md:text-base shadow-lg shadow-primary-500/30 active:scale-[0.98] transition-all cursor-pointer"
          >
            Withdraw Funds
            <ArrowUpRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};
