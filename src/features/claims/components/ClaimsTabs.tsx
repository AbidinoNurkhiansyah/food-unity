import React from "react";
import type { TabStatus } from "../hooks/useClaims";

interface ClaimsTabsProps {
  activeTab: TabStatus;
  setActiveTab: (tab: TabStatus) => void;
}

export const ClaimsTabs: React.FC<ClaimsTabsProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const tabs: { label: string; value: TabStatus }[] = [
    { label: "All", value: "ALL" },
    { label: "Pending", value: "PENDING" },
    { label: "Paid", value: "PAID" },
    { label: "Completed", value: "COMPLETED" },
  ];

  return (
    <div className="flex overflow-x-auto hide-scrollbar gap-6 border-b border-gray-200/80">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => setActiveTab(tab.value)}
          className={`whitespace-nowrap py-3 font-medium cursor-pointer text-sm transition-colors relative ${
            activeTab === tab.value
              ? "text-primary-600"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          {tab.label}
          {activeTab === tab.value && (
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary-600 rounded-t-full" />
          )}
        </button>
      ))}
    </div>
  );
};
