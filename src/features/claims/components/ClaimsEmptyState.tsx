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
    <div className="bg-white rounded-xl border border-gray-100 p-16 text-center shadow-sm">
      <PackageSearch className="mx-auto h-16 w-16 text-gray-300 mb-4" />
      <h3 className="text-xl font-bold text-gray-900 mb-2">Tidak Ada Pesanan</h3>
      <p className="text-gray-500">
        {activeTab === 'ALL' 
          ? 'Belum ada pesanan yang masuk ke toko Anda.' 
          : `Tidak ada pesanan dengan status ${getTabLabel(activeTab)}.`}
      </p>
    </div>
  );
};
