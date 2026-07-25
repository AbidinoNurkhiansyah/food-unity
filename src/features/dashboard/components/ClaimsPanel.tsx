import { Link } from "react-router-dom";
import { Package, ArrowRight, Clock, User } from "lucide-react";

export function ClaimsPanel() {
  return (
    <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <div>
          <h2 className="font-semibold text-slate-900">
            Pending Pickups
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            PAID orders ready for confirmation
          </p>
        </div>
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-palette-100 text-palette-700 font-bold text-xs">
          1
        </span>
      </div>

      {/* Table header */}
      <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-6 py-2.5 bg-white border-b border-slate-100">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Order
        </span>
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Time
        </span>
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Status
        </span>
      </div>

      {/* Row */}
      <div className="divide-y divide-slate-100">
        <div className="grid grid-cols-[1fr_auto_auto] gap-4 items-center px-6 py-4 hover:bg-slate-50/60 transition-colors">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 bg-slate-100 text-slate-500 rounded-lg shrink-0">
              <Package className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-slate-900 text-sm truncate">
                Evening Bread Package
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <User className="w-3 h-3 text-slate-400" />
                <p className="text-xs text-slate-400 truncate">
                  Budi Santoso · 3 items
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium shrink-0">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            20:30 WIB
          </div>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
            Pending
          </span>
        </div>
      </div>

      <div className="px-6 py-3 border-t border-slate-100 bg-white">
        <Link
          to="/dashboard/claims"
          className="flex items-center gap-1.5 text-xs font-semibold text-palette-600 hover:text-palette-700 transition-colors"
        >
          View all claims <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
