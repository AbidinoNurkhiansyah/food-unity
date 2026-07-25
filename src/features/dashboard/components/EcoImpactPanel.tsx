import { Link } from "react-router-dom";
import { TrendingUp } from "lucide-react";
import { Skeleton } from "./Skeleton";

const TARGET_FOOD_KG = 100;
const TARGET_CO2_KG = 250;
const TARGET_PORTIONS = 50;

// ─── Private sub-component ────────────────────────────────────────────────────

interface EcoBarProps {
  label: string;
  value: number;
  max: number;
  unit: string;
  color: string;
  isLoading: boolean;
}

function EcoBar({ label, value, max, unit, color, isLoading }: EcoBarProps) {
  const pct = Math.min((value / Math.max(max, 1)) * 100, 100);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-slate-700">{label}</span>
        {isLoading ? (
          <Skeleton className="h-4 w-16" />
        ) : (
          <span className="font-bold text-slate-900 tabular-nums">
            {value.toFixed(1)}{" "}
            <span className="font-normal text-slate-400">{unit}</span>
          </span>
        )}
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        {isLoading ? (
          <div className="h-full w-1/3 bg-slate-200 animate-pulse rounded-full" />
        ) : (
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-out ${color}`}
            style={{ width: `${pct}%` }}
          />
        )}
      </div>
      {!isLoading && (
        <p className="text-xs text-slate-400">
          Target this month:{" "}
          <span className="font-semibold text-slate-600">
            {max} {unit}
          </span>
        </p>
      )}
    </div>
  );
}

// ─── Exported panel ───────────────────────────────────────────────────────────

export interface EcoImpactPanelProps {
  foodSavedKg: number;
  co2ReducedKg: number;
  donationPortions: number;
  isLoading: boolean;
}

export function EcoImpactPanel({
  foodSavedKg,
  co2ReducedKg,
  donationPortions,
  isLoading,
}: EcoImpactPanelProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col">
      <div className="px-5 py-4 border-b border-slate-100">
        <h2 className="font-semibold text-slate-900">Environmental Impact</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Monthly target progress
        </p>
      </div>

      <div className="flex-1 px-5 py-5 space-y-5">
        <EcoBar
          label="Food Saved"
          value={foodSavedKg}
          max={TARGET_FOOD_KG}
          unit="kg"
          color="bg-palette-500"
          isLoading={isLoading}
        />
        <EcoBar
          label="CO₂ Reduced"
          value={co2ReducedKg}
          max={TARGET_CO2_KG}
          unit="kg"
          color="bg-emerald-500"
          isLoading={isLoading}
        />
        <EcoBar
          label="Donation Portions"
          value={donationPortions}
          max={TARGET_PORTIONS}
          unit="portions"
          color="bg-rose-400"
          isLoading={isLoading}
        />
      </div>

      <div className="px-5 py-3 border-t border-slate-100 bg-white">
        <Link
          to="/dashboard/wallet"
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors"
        >
          <TrendingUp className="w-3.5 h-3.5" /> View wallet
        </Link>
      </div>
    </div>
  );
}
