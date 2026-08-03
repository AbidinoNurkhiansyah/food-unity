import React from "react";
import { History, ArrowUpRight, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface WalletHistoryCardProps {
  history: any[];
  isLoading: boolean;
}

export const WalletHistoryCard: React.FC<WalletHistoryCardProps> = ({ history, isLoading }) => {
  return (
    <div className="flex flex-col gap-4 mt-4">
      <div className="flex items-center gap-3 px-2">
        <div className="p-2.5 bg-white rounded-xl text-slate-600 border border-slate-200 shadow-sm">
          <History className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Withdrawal History
          </h2>
          <p className="text-xs text-slate-500">Recent withdrawal transactions</p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-4">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div>
                  <Skeleton className="h-5 w-32 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <Skeleton className="h-6 w-24" />
            </div>
          ))}
        </div>
      ) : history && history.length > 0 ? (
        <div className="space-y-3">
          {history.map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md transition-all gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center border border-red-100 text-red-600 shrink-0">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-slate-900 font-semibold mb-1 text-sm sm:text-base">
                    Withdrawal to Bank Account
                  </h3>
                  <div className="flex items-center text-xs text-slate-500 gap-2">
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      {new Date(item.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center">
                <span className="font-bold text-slate-900 text-sm sm:text-base">
                  - Rp {Number(item.amount).toLocaleString("id-ID")}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide mt-1 ${item.status === 'SUCCESS' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                  {item.status || 'PENDING'}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 px-4 bg-white rounded-2xl border border-dashed border-slate-300">
          <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
             <History className="w-6 h-6 text-slate-400" />
          </div>
          <h3 className="text-slate-900 font-semibold mb-1">No history yet</h3>
          <p className="text-slate-500 text-sm max-w-sm mx-auto">
            You have not made any withdrawals yet. Transaction history will appear here.
          </p>
        </div>
      )}
    </div>
  );
};
