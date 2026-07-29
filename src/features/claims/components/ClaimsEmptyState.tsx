import React from "react";
import { PackageSearch } from "lucide-react";
import type { TabStatus } from "../hooks/useClaims";

interface ClaimsEmptyStateProps {
  activeTab: TabStatus;
}

export const ClaimsEmptyState: React.FC<ClaimsEmptyStateProps> = ({ activeTab }) => {
  const getTabLabel = (tab: TabStatus) => {
    switch (tab) {
      case 'PENDING': return 'Menunggu (Pending)';
      case 'PAID': return 'Siap Diambil (Paid)';
      case 'COMPLETED': return 'Selesai (Completed)';
      default: return 'Semua Pesanan';
    }
  };

  return (
    <div className="bg-white/50 rounded-2xl border border-gray-200/80 border-dashed p-16 text-center flex flex-col items-center justify-center">
      <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
        <PackageSearch className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1.5">Tidak Ada Pesanan</h3>
      <p className="text-sm text-gray-500 max-w-sm">
        {activeTab === 'ALL' 
          ? 'Belum ada pesanan yang masuk ke toko Anda saat ini.' 
          : `Tidak ada pesanan dengan status ${getTabLabel(activeTab)}.`}
      </p>
    </div>
  );
};
