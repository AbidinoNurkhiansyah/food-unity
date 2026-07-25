import React from "react";
import { CheckCircle, HeartHandshake, Wind, Sprout } from "lucide-react";
import { useMerchantStats } from "../hooks/useMerchantStats";
import { KpiCard } from "./KpiCard";
import { ClaimsPanel } from "./ClaimsPanel";
import { EcoImpactPanel } from "./EcoImpactPanel";

interface MerchantBentoGridProps {
  user: any;
}

export const MerchantBentoGrid: React.FC<MerchantBentoGridProps> = ({
  user,
}) => {
  const { stats, isLoading } = useMerchantStats();

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Hi, {user?.displayName || "Partner"} 👋
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Monitor your food rescue impact and operations in real-time.
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard
          label="Food Saved"
          value={stats.foodSavedKg}
          decimals={1}
          suffix="kg"
          icon={<Sprout className="w-4 h-4 text-palette-600" />}
          iconBg="bg-palette-50"
          subtext="Total all time"
          isLoading={isLoading}
        />
        <KpiCard
          label="CO₂ Reduced"
          value={stats.co2ReducedKg}
          decimals={1}
          suffix="kg"
          icon={<Wind className="w-4 h-4 text-emerald-600" />}
          iconBg="bg-emerald-50"
          subtext={`≈ ${(stats.co2ReducedKg / 0.21).toFixed(0)} km car travel`}
          isLoading={isLoading}
        />
        <KpiCard
          label="Donation Portions"
          value={stats.donationPortions}
          suffix="portions"
          icon={<HeartHandshake className="w-4 h-4 text-rose-500" />}
          iconBg="bg-rose-50"
          subtext="Free meals distributed"
          isLoading={isLoading}
        />
        <KpiCard
          label="Completed Orders"
          value={stats.completedOrders}
          suffix="claims"
          icon={<CheckCircle className="w-4 h-4 text-blue-500" />}
          iconBg="bg-blue-50"
          subtext="Pickups successfully confirmed"
          isLoading={isLoading}
        />
      </div>

      {/* Middle panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ClaimsPanel />
        <EcoImpactPanel
          foodSavedKg={stats.foodSavedKg}
          co2ReducedKg={stats.co2ReducedKg}
          donationPortions={stats.donationPortions}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
