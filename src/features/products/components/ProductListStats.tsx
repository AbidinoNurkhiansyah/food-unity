import { Package, Eye, ShoppingBag, Heart } from "lucide-react";

interface ProductListStatsProps {
  totalProducts: number;
  activeProducts: number;
  soldOutProducts: number;
  donationProducts: number;
}

export function ProductListStats({
  totalProducts,
  activeProducts,
  soldOutProducts,
  donationProducts,
}: ProductListStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Products Card */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 flex flex-col gap-1.5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-355">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Total Food
          </span>
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100/50">
            <Package className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
            {totalProducts}
          </span>
          <span className="text-xs font-semibold text-slate-400">pkg</span>
        </div>
        <p className="text-[10.5px] text-slate-400 font-medium">
          All registered surplus items
        </p>
      </div>

      {/* Active Listings Card */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 flex flex-col gap-1.5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-355">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Active Listings
          </span>
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100/50">
            <Eye className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
            {activeProducts}
          </span>
          <span className="text-xs font-semibold text-slate-400">active</span>
        </div>
        <p className="text-[10.5px] text-slate-400 font-medium">
          Available & ready for buyers
        </p>
      </div>

      {/* Sold Out Card */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 flex flex-col gap-1.5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-355">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Sold Out
          </span>
          <div className="p-2 rounded-lg bg-slate-50 text-slate-600 border border-slate-200/60">
            <ShoppingBag className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
            {soldOutProducts}
          </span>
          <span className="text-xs font-semibold text-slate-400">sold</span>
        </div>
        <p className="text-[10.5px] text-slate-400 font-medium">
          Out of stock items
        </p>
      </div>

      {/* Donation Card */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-4 flex flex-col gap-1.5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-355">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Social Donation
          </span>
          <div className="p-2 rounded-lg bg-rose-50 text-rose-600 border border-rose-100/50">
            <Heart className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
            {donationProducts}
          </span>
          <span className="text-xs font-semibold text-slate-400">
            donated
          </span>
        </div>
        <p className="text-[10.5px] text-slate-400 font-medium">
          Shared free for those in need
        </p>
      </div>
    </div>
  );
}
