import { Search, X } from "lucide-react";

interface ProductListToolbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: "all" | "active" | "sold_out" | "expired";
  setStatusFilter: (status: "all" | "active" | "sold_out" | "expired") => void;
  typeFilter: "all" | "discount" | "donation";
  setTypeFilter: (type: "all" | "discount" | "donation") => void;
}

export function ProductListToolbar({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  typeFilter,
  setTypeFilter,
}: ProductListToolbarProps) {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
      {/* Search */}
      <div className="relative w-full md:max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search surplus food..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-8 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-palette-500/10 focus:border-palette-500 transition-all bg-slate-50/50 hover:bg-slate-50/10"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Filters Wrapper */}
      <div className="flex flex-wrap items-center gap-4 w-full md:w-auto md:justify-end">
        {/* Status Tabs */}
        <div className="flex p-1 bg-slate-100 border border-slate-200/30 rounded-xl gap-0.5 w-full sm:w-auto">
          {(["all", "active", "sold_out", "expired"] as const).map((status) => {
            const isActive = statusFilter === status;
            const label =
              status === "all"
                ? "All"
                : status === "active"
                ? "Active"
                : status === "sold_out"
                ? "Sold Out"
                : "Expired";
            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`flex-1 sm:flex-none px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-white text-slate-900 shadow-sm border border-slate-200/20 font-bold"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Type Toggle Pills */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() =>
              setTypeFilter(typeFilter === "discount" ? "all" : "discount")
            }
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-full border transition-all duration-200 ${
              typeFilter === "discount"
                ? "bg-amber-500 border-amber-500 text-white font-bold shadow-sm"
                : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
            }`}
          >
            Discount
          </button>
          <button
            onClick={() =>
              setTypeFilter(typeFilter === "donation" ? "all" : "donation")
            }
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-full border transition-all duration-200 ${
              typeFilter === "donation"
                ? "bg-violet-600 border-violet-600 text-white font-bold shadow-sm"
                : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
            }`}
          >
            Donation
          </button>
        </div>
      </div>
    </div>
  );
}
