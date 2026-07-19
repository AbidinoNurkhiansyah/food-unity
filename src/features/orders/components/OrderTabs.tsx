import React from 'react';

interface OrderTabsProps {
  activeTab: "ALL" | "PENDING" | "PAID" | "FAILED";
  onTabChange: (tab: "ALL" | "PENDING" | "PAID" | "FAILED") => void;
}

export const OrderTabs: React.FC<OrderTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex overflow-x-auto gap-2 mb-6 pb-2 scrollbar-hide">
      {["ALL", "PENDING", "PAID", "FAILED"].map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab as any)}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
            activeTab === tab
              ? "bg-gray-900 text-white shadow-md"
              : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          {tab === "ALL" ? "Semua" : tab === "PENDING" ? "Belum Dibayar" : tab === "PAID" ? "Lunas" : "Dibatalkan"}
        </button>
      ))}
    </div>
  );
};
