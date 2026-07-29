import { useState } from "react";
import { useProductList } from "../hooks/useProductList";
import {
  Plus,
  Search,
  X,
} from "lucide-react";
import { ProductListSkeleton } from "./ProductListSkeleton";
import { ProductListStats } from "./ProductListStats";
import { ProductListToolbar } from "./ProductListToolbar";
import { Button } from "@/components/ui/button";
import { ProductEmptyState } from "./ProductEmptyState";
import { ProductTableRow } from "./ProductTableRow";
import type { Product } from "../types";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ProductListProps {
  onCreateClick: () => void;
  onEditClick: (product: Product) => void;
  onDeleteClick: (product: Product) => void;
}

export function ProductList({
  onCreateClick,
  onEditClick,
  onDeleteClick,
}: ProductListProps) {
  const { products, isLoading, isError } = useProductList();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "sold_out" | "expired"
  >("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "discount" | "donation">(
    "all"
  );
  const [now] = useState(() => Date.now());

  if (isLoading) {
    return <ProductListSkeleton />;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-rose-50/20 rounded-2xl border border-rose-100 mt-6 text-center">
        <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-3 border border-rose-100">
          <X className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900 mb-1">
          Failed to Load Stock
        </h3>
        <p className="text-sm text-slate-500 max-w-sm mb-4">
          An error occurred while fetching surplus product data from the server.
          Please try again later.
        </p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return <ProductEmptyState onCreateClick={onCreateClick} />;
  }

  // Calculate dynamic stats from all products
  const totalProducts = products.length;
  const activeProducts = products.filter((p) => {
    const isExpired = p.pickupDeadline
      ? new Date(p.pickupDeadline).getTime() <= now
      : false;
    return p.status === "active" && p.stock > 0 && !isExpired;
  }).length;
  const soldOutProducts = products.filter(
    (p) => p.status === "sold_out" || p.stock <= 0
  ).length;
  const donationProducts = products.filter((p) => p.isDonation).length;

  // Filter listings based on toolbar filters
  const filteredProducts = products.filter((product) => {
    // 1. Search Query Filter
    const matchesSearch =
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());

    // 2. Status Filter
    const isExpired = product.pickupDeadline
      ? new Date(product.pickupDeadline).getTime() <= now
      : false;

    let matchesStatus = true;
    if (statusFilter === "active") {
      matchesStatus =
        product.status === "active" && product.stock > 0 && !isExpired;
    } else if (statusFilter === "sold_out") {
      matchesStatus = product.status === "sold_out" || product.stock <= 0;
    } else if (statusFilter === "expired") {
      matchesStatus = product.status === "expired" || isExpired;
    }

    // 3. Type Filter
    let matchesType = true;
    if (typeFilter === "discount") {
      matchesType = !product.isDonation;
    } else if (typeFilter === "donation") {
      matchesType = product.isDonation;
    }

    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="mt-6 space-y-6">
      {/* 1. KPI Stats Summary Cards */}
      <ProductListStats
        totalProducts={totalProducts}
        activeProducts={activeProducts}
        soldOutProducts={soldOutProducts}
        donationProducts={donationProducts}
      />

      {/* 2. Title & Action Row */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Surplus Packages List
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Manage your discounts, donations, stock, and product expiration.
          </p>
        </div>
        <Button
          onClick={onCreateClick}
          className="gap-2 px-4 cursor-pointer shadow-sm bg-palette-600 hover:bg-palette-700 text-white font-semibold rounded-xl text-sm transition-all duration-200 active:scale-98"
        >
          <Plus className="w-4 h-4" /> Add Product
        </Button>
      </div>

      {/* 3. Search & Filters Toolbar */}
      <ProductListToolbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
      />

      {/* 4. Table view */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-12 text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mb-3 border border-slate-100">
            <Search className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 mb-1">
            No Results Found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm">
            No surplus products match your filters or search keywords. Try
            changing filters or search.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setStatusFilter("all");
              setTypeFilter("all");
            }}
            className="mt-4 text-xs font-bold text-palette-600 hover:text-palette-700 transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/75 border-b-0 [&_tr]:border-b-0">
                <TableRow className="hover:bg-transparent border-b-0">
                  <TableHead className="w-[50px] text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider py-3.5">
                    No.
                  </TableHead>
                  <TableHead className="w-[300px] text-[10px] font-bold text-slate-400 uppercase tracking-wider py-3.5">
                    Product
                  </TableHead>
                  <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-wider py-3.5">
                    Type
                  </TableHead>
                  <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-wider py-3.5">
                    Stock
                  </TableHead>
                  <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-wider py-3.5">
                    Pickup Deadline
                  </TableHead>
                  <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-wider py-3.5">
                    Status
                  </TableHead>
                  <TableHead className="text-right text-[10px] font-bold text-slate-400 uppercase tracking-wider py-3.5">
                    Price
                  </TableHead>
                  <TableHead className="text-center w-[100px] text-[10px] font-bold text-slate-400 uppercase tracking-wider py-3.5">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product, index) => (
                  <ProductTableRow
                    key={product.id}
                    product={product}
                    index={index}
                    onEditClick={onEditClick}
                    onDeleteClick={onDeleteClick}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
          {/* Table Footer Count indicator */}
          <div className="px-4 py-3.5 bg-slate-50/50 border-t border-slate-200/50 flex justify-between items-center text-xs font-medium text-slate-500">
            <span>
              Showing {filteredProducts.length} of {products.length} products
            </span>
            {filteredProducts.length < products.length && (
              <span className="text-slate-400 italic">(filtered)</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
