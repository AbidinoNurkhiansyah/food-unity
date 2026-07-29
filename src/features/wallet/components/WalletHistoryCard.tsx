import React from "react";
import { History } from "lucide-react";

export const WalletHistoryCard: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-slate-50 rounded-2xl text-slate-600 border border-slate-100 shadow-sm">
            <History className="w-5 h-5" />
          </div>
           <div>
             <h2 className="text-xl font-bold text-slate-900">
               Withdrawal History
             </h2>
             <p className="text-sm text-slate-500 mt-1">Track all your withdrawal activities</p>
          </div>
        </div>
      </div>

      <div className="text-center py-16 px-4 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100">
           <History className="w-6 h-6 text-slate-400" />
        </div>
        <h3 className="text-slate-900 font-semibold mb-1">No history yet</h3>
        <p className="text-slate-500 text-sm max-w-sm mx-auto">
          You have not made any withdrawals yet. Transaction history will appear here.
        </p>
      </div>
    </div>
  );
};
