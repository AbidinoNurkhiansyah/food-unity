import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface OrderSkeletonListProps {
  count?: number;
}

export const OrderSkeletonList: React.FC<OrderSkeletonListProps> = ({ count = 3 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-4">
            <div className="space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
          <div className="space-y-3 mb-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
          <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
            <div className="space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-5 w-28" />
            </div>
            <Skeleton className="h-10 w-32 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
};
