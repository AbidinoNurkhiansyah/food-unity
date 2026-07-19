import React from "react";
import { Wallet } from "lucide-react";

interface WalletBalanceCardProps {
  balance: number;
  isLoading: boolean;
}

export const WalletBalanceCard: React.FC<WalletBalanceCardProps> = ({ balance, isLoading }) => {
  return (
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
  );
};
