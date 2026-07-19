import React from "react";
import type { TabStatus } from "../hooks/useClaims";

interface ClaimsTabsProps {
  activeTab: TabStatus;
  setActiveTab: (tab: TabStatus) => void;
}

export const ClaimsTabs: React.FC<ClaimsTabsProps> = ({ activeTab, setActiveTab }) => {
  const tabs: { label: string; value: TabStatus }[] = [
    { label: 'Semua Pesanan', value: 'ALL' },
    { label: 'Menunggu (Pending)', value: 'PENDING' },
    { label: 'Siap Diambil (Paid)', value: 'PAID' },
    { label: 'Selesai (Completed)', value: 'COMPLETED' },
  ];

  return (
    <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-2 border-b border-gray-200">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => setActiveTab(tab.value)}
          className={`whitespace-nowrap px-4 py-2.5 rounded-t-lg font-medium text-sm transition-colors relative ${
            activeTab === tab.value
              ? 'text-orange-600 bg-orange-50/50'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          {tab.label}
          {activeTab === tab.value && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500 rounded-t-full" />
          )}
        </button>
      ))}
    </div>
  );
};
