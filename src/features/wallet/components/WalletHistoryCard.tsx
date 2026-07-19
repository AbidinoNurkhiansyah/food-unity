import React from "react";
import { History } from "lucide-react";

export const WalletHistoryCard: React.FC = () => {
  return (
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
  );
};
