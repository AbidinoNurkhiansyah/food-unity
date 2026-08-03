import React from "react";
import { Package, Pencil, Trash2, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableRow, TableCell } from "@/components/ui/table";
import type { Product } from "../types";

interface ProductTableRowProps {
  product: Product;
  index: number;
  onEditClick: (product: Product) => void;
  onDeleteClick: (product: Product) => void;
}

export const ProductTableRow: React.FC<ProductTableRowProps> = ({
  product,
  index,
  onEditClick,
  onDeleteClick,
}) => {
  const [now] = React.useState(() => Date.now());
  const isExpired = product.pickupDeadline
    ? new Date(product.pickupDeadline).getTime() <= now
    : false;

  const formatDeadline = (deadlineStr: string) => {
    try {
      const date = new Date(deadlineStr);
      if (isNaN(date.getTime())) return deadlineStr;
      
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      }) + ' WIB';
    } catch {
      return deadlineStr;
    }
  };

  const getStatusBadge = () => {
    if (product.stock <= 0 || product.status === "sold_out") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-600 border border-slate-200/60">
          <CheckCircle className="w-3 h-3 text-slate-400" />
          Sold Out
        </span>
      );
    }
    
    if (isExpired || product.status === "expired") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-50 text-rose-700 border border-rose-100">
          <AlertTriangle className="w-3 h-3 text-rose-500 animate-bounce" />
          Expired
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
        <Clock className="w-3 h-3 text-emerald-500" />
        Active
      </span>
    );
  };

  return (
    <TableRow className="group hover:bg-slate-50/70 cursor-pointer transition-colors duration-250 border-b border-slate-200/50">
      <TableCell className="text-center font-medium text-slate-400 text-xs tabular-nums py-4">
        {index + 1}
      </TableCell>
      <TableCell className="py-4 max-w-[200px] lg:max-w-[300px]">
        <div className="flex items-center gap-3">
          {product.imageUrl ? (
            <div className="h-11 w-11 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200/40 shadow-sm transition-all group-hover:border-slate-350">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          ) : (
            <div className="h-11 w-11 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 border border-slate-200/50 text-slate-400 shadow-sm">
              <Package className="h-5 w-5 text-slate-300" />
            </div>
          )}
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-slate-800 line-clamp-1 text-sm tracking-tight group-hover:text-slate-900 transition-colors" title={product.title}>
              {product.title}
            </span>
            <span className="text-[11px] text-slate-400 font-medium line-clamp-1 leading-normal" title={product.description}>
              {product.description}
            </span>
          </div>
        </div>
      </TableCell>
      <TableCell className="py-4">
        <span
          className={`inline-flex px-2.5 py-1 text-[10.5px] font-bold rounded-lg border tracking-wide ${
            product.isDonation
              ? "bg-violet-50 text-violet-700 border-violet-100"
              : "bg-amber-50 text-amber-700 border-amber-100"
          }`}
        >
          {product.isDonation ? "DONATION" : "DISCOUNT"}
        </span>
      </TableCell>
      <TableCell className="py-4">
        <div className="flex items-baseline gap-0.5">
          <span className="font-bold text-slate-800 text-sm tabular-nums">{product.stock}</span>
          <span className="text-[10px] font-bold text-slate-400">
            {product.unit === "porsi" ? "portion" : product.unit}
          </span>
        </div>
      </TableCell>
      <TableCell className="py-4 text-xs font-semibold text-slate-500 tabular-nums">
        {formatDeadline(product.pickupDeadline)}
      </TableCell>
      <TableCell className="py-4">
        {getStatusBadge()}
      </TableCell>
      <TableCell className="text-right py-4">
        <div className="flex flex-col items-end">
          {!product.isDonation && product.originalPrice > 0 && (
            <span className="text-[10.5px] text-slate-400 line-through font-medium tabular-nums">
              Rp {product.originalPrice.toLocaleString("id-ID")}
            </span>
          )}
          <span className={`font-extrabold text-sm tabular-nums ${
            product.isDonation ? "text-rose-600" : "text-palette-600"
          }`}>
            {product.isDonation
              ? "Free"
              : `Rp ${product.discountPrice.toLocaleString("id-ID")}`}
          </span>
        </div>
      </TableCell>
      <TableCell className="py-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-center items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
          <Button
            onClick={() => onEditClick(product)}
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-500 hover:text-blue-600 hover:bg-blue-50/50 rounded-lg transition-all"
            title="Edit Product"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => onDeleteClick(product)}
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-500 hover:text-red-600 hover:bg-red-50/50 rounded-lg transition-all"
            title="Delete Product"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};
