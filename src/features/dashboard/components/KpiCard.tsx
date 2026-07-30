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
    <div className="bg-white backdrop-blur-md rounded-2xl border border-slate-100 p-5 flex flex-col gap-2 shadow-sm hover:bg-white hover:shadow-md hover:-translate-y-1 hover:border-slate-200 transition-all duration-300 cursor-default group">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest group-hover:text-slate-700 transition-colors">
          {label}
        </span>
        <div
          className={`p-2 rounded-xl ${iconBg} group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm`}
        >
          {icon}
        </div>
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
