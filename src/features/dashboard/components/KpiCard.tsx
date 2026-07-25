import React from "react";
import { useCountUp } from "../hooks/useCountUp";
import { Skeleton } from "./Skeleton";

export interface KpiCardProps {
  label: string;
  value: number;
  decimals?: number;
  suffix?: string;
  icon: React.ReactNode;
  iconBg: string;
  subtext?: string;
  isLoading: boolean;
}

export function KpiCard({
  label,
  value,
  decimals = 0,
  suffix = "",
  icon,
  iconBg,
  subtext,
  isLoading,
}: KpiCardProps) {
  const display = useCountUp({
    end: value,
    duration: 1400,
    decimals,
    enabled: !isLoading,
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-4 flex flex-col gap-2 shadow-sm hover:shadow-md hover:border-slate-300 transition-all">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
          {label}
        </span>
        <div className={`p-1.5 rounded-lg ${iconBg}`}>{icon}</div>
      </div>

      {isLoading ? (
        <>
          <Skeleton className="h-7 w-20" />
          <Skeleton className="h-3 w-28" />
        </>
      ) : (
        <>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
              {display}
            </span>
            {suffix && (
              <span className="text-sm font-medium text-slate-500">
                {suffix}
              </span>
            )}
          </div>
          {subtext && (
            <p className="text-xs text-slate-400 leading-relaxed">{subtext}</p>
          )}
        </>
      )}
    </div>
  );
}
