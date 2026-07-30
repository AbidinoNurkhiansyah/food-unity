import React from "react";
import { Wallet, ArrowRight } from "lucide-react";
import { Skeleton } from "./Skeleton";
import { useCountUp } from "../hooks/useCountUp";

interface CompactWalletCardProps {
  balance: number;
  isLoading: boolean;
  onClick?: () => void;
}

export const CompactWalletCard: React.FC<CompactWalletCardProps> = ({
  balance,
  isLoading,
  onClick,
}) => {
  const animatedBalance = useCountUp({
    end: balance,
    duration: 1500,
    enabled: !isLoading,
  });

  return (
    <div
      onClick={onClick}
      className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col justify-between hover:border-slate-700 hover:shadow-primary-500/10 transition-all cursor-pointer group h-full relative"
    >
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary-500/20 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
      
      <div className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white/10 text-primary-300 rounded-xl group-hover:scale-110 transition-transform">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-semibold text-white">Wallet Balance</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Available to withdraw
            </p>
          </div>
        </div>
        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-slate-400 group-hover:bg-white/10 group-hover:text-white transition-colors">
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>

      <div className="relative z-10 px-5 py-6 md:py-8 flex-1 flex flex-col justify-center">
        {isLoading ? (
          <Skeleton className="h-8 w-3/4 mb-2 bg-slate-800" />
        ) : (
          <div className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white truncate drop-shadow-sm">
            Rp {Number(animatedBalance).toLocaleString("id-ID")}
          </div>
        )}
      </div>

      <div className="relative z-10 px-6 py-3 border-t border-white/10 bg-slate-800/30 backdrop-blur-sm">
        <p className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]"></span>
          Your balance is secure and ready
        </p>
      </div>
    </div>
  );
};
