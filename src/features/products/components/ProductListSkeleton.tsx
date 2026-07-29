export function ProductListSkeleton() {
  return (
    <div className="mt-8 space-y-6">
      {/* KPI Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-slate-200/80 p-4 space-y-3 shadow-sm animate-pulse"
          >
            <div className="flex justify-between items-center">
              <div className="h-3 w-16 bg-slate-200 rounded"></div>
              <div className="h-8 w-8 bg-slate-100 rounded-lg"></div>
            </div>
            <div className="h-6 w-12 bg-slate-200 rounded"></div>
            <div className="h-3 w-24 bg-slate-100 rounded"></div>
          </div>
        ))}
      </div>
      {/* Table Skeleton */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-pulse">
        <div className="p-4 border-b border-slate-100 flex justify-between">
          <div className="h-8 w-48 bg-slate-200 rounded-lg"></div>
          <div className="h-8 w-20 bg-slate-200 rounded-lg"></div>
        </div>
        <div className="space-y-4 p-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 py-2 border-b border-slate-50 last:border-0"
            >
              <div className="h-10 w-10 bg-slate-200 rounded-lg shrink-0"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/4 bg-slate-200 rounded"></div>
                <div className="h-3 w-1/3 bg-slate-150 rounded"></div>
              </div>
              <div className="h-6 w-16 bg-slate-200 rounded-full"></div>
              <div className="h-4 w-12 bg-slate-200 rounded"></div>
              <div className="h-8 w-16 bg-slate-100 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
