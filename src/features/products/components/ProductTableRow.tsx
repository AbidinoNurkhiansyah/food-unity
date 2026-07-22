import React from "react";
import { Package, Pencil, Trash2 } from "lucide-react";
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
  const isExpired = product.pickupDeadline
    ? new Date(product.pickupDeadline).getTime() <= Date.now()
    : false;

  return (
    <TableRow>
      <TableCell className="text-center font-medium text-slate-500">
        {index + 1}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          {product.imageUrl ? (
            <div className="h-12 w-12 rounded-lg bg-slate-100 overflow-hidden shrink-0">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="h-12 w-12 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
              <Package className="h-5 w-5 text-slate-300" />
            </div>
          )}
          <div>
            <p className="font-semibold text-slate-900 line-clamp-1">
              {product.title}
            </p>
            <p className="text-xs text-slate-500 line-clamp-1">
              {product.description}
            </p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <span
          className={`px-2 py-1 text-xs font-bold rounded-md ${
            product.isDonation
              ? "bg-palette-100 text-palette-700"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          {product.isDonation ? "DONASI" : "DISKON"}
        </span>
      </TableCell>
      <TableCell>
        <span className="font-medium">{product.stock}</span>
      </TableCell>
      <TableCell>
        <span className="text-slate-600">{product.pickupDeadline}</span>
      </TableCell>
      <TableCell>
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            product.stock <= 0
              ? "bg-slate-100 text-slate-700"
              : isExpired
              ? "bg-red-100 text-red-700"
              : product.status === "active"
              ? "bg-palette-100 text-palette-700"
              : product.status === "sold_out"
              ? "bg-slate-100 text-slate-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {product.stock <= 0
            ? "Habis Terjual"
            : isExpired
            ? "Expired"
            : product.status === "active"
            ? "Active"
            : product.status}
        </span>
      </TableCell>
      <TableCell className="text-right">
        {!product.isDonation && product.originalPrice > 0 && (
          <div className="text-xs text-slate-400 line-through">
            Rp {product.originalPrice.toLocaleString("id-ID")}
          </div>
        )}
        <div className="font-bold text-palette-600">
          {product.isDonation
            ? "Gratis"
            : `Rp ${product.discountPrice.toLocaleString("id-ID")}`}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex justify-center items-center gap-1">
          <Button
            onClick={() => onEditClick(product)}
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => onDeleteClick(product)}
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};
