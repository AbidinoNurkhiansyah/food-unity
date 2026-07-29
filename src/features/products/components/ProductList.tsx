import { useState } from 'react';
import { useProductList } from '../hooks/useProductList';
import { Plus, Search, X, Package, Heart, Eye, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductEmptyState } from './ProductEmptyState';
import { ProductTableRow } from './ProductTableRow';
import type { Product } from '../types';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface ProductListProps {
  onCreateClick: () => void;
  onEditClick: (product: Product) => void;
  onDeleteClick: (product: Product) => void;
}

export function ProductList({ onCreateClick, onEditClick, onDeleteClick }: ProductListProps) {
  const { products, isLoading, isError } = useProductList();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'sold_out' | 'expired'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'discount' | 'donation'>('all');
  const [now] = useState(() => Date.now());

  if (isLoading) {
    return (
      <div className="mt-8 space-y-6">
        {/* KPI Skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200/80 p-4 space-y-3 shadow-sm animate-pulse">
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
              <div key={i} className="flex items-center gap-4 py-2 border-b border-slate-50 last:border-0">
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

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-rose-50/20 rounded-2xl border border-rose-100 mt-6 text-center">
        <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-3 border border-rose-100">
          <X className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900 mb-1">Failed to Load Stock</h3>
        <p className="text-sm text-slate-500 max-w-sm mb-4">
          An error occurred while fetching surplus product data from the server. Please try again later.
        </p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return <ProductEmptyState onCreateClick={onCreateClick} />;
  }

  // Calculate dynamic stats from all products
  const totalProducts = products.length;
  const activeProducts = products.filter(p => {
    const isExpired = p.pickupDeadline ? new Date(p.pickupDeadline).getTime() <= now : false;
    return p.status === 'active' && p.stock > 0 && !isExpired;
  }).length;
  const soldOutProducts = products.filter(p => p.status === 'sold_out' || p.stock <= 0).length;
  const donationProducts = products.filter(p => p.isDonation).length;

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
    if (statusFilter === 'active') {
      matchesStatus = product.status === 'active' && product.stock > 0 && !isExpired;
    } else if (statusFilter === 'sold_out') {
      matchesStatus = product.status === 'sold_out' || product.stock <= 0;
    } else if (statusFilter === 'expired') {
      matchesStatus = product.status === 'expired' || isExpired;
    }

    // 3. Type Filter
    let matchesType = true;
    if (typeFilter === 'discount') {
      matchesType = !product.isDonation;
    } else if (typeFilter === 'donation') {
      matchesType = product.isDonation;
    }

    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="mt-6 space-y-6">
      {/* 1. KPI Stats Summary Cards */}
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
          <p className="text-[10.5px] text-slate-400 font-medium">All registered surplus items</p>
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
          <p className="text-[10.5px] text-slate-400 font-medium">Available & ready for buyers</p>
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
          <p className="text-[10.5px] text-slate-400 font-medium">Out of stock items</p>
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
            <span className="text-xs font-semibold text-slate-400">donated</span>
          </div>
          <p className="text-[10.5px] text-slate-400 font-medium">Shared free for those in need</p>
        </div>
      </div>

      {/* 2. Title & Action Row */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Surplus Packages List</h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Manage your discounts, donations, stock, and product expiration.
          </p>
        </div>
        <Button onClick={onCreateClick} className="gap-2 px-4 shadow-sm bg-palette-600 hover:bg-palette-700 text-white font-semibold rounded-xl text-sm transition-all duration-200 active:scale-98">
          <Plus className="w-4 h-4" /> Add Package
        </Button>
      </div>

      {/* 3. Search & Filters Toolbar */}
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
              onClick={() => setSearchQuery('')}
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
            {(['all', 'active', 'sold_out', 'expired'] as const).map((status) => {
              const isActive = statusFilter === status;
              const label = 
                status === 'all' ? 'All' :
                status === 'active' ? 'Active' :
                status === 'sold_out' ? 'Sold Out' : 'Expired';
              return (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`flex-1 sm:flex-none px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-white text-slate-900 shadow-sm border border-slate-200/20 font-bold' 
                      : 'text-slate-500 hover:text-slate-800'
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
              onClick={() => setTypeFilter(typeFilter === 'discount' ? 'all' : 'discount')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-full border transition-all duration-200 ${
                typeFilter === 'discount'
                  ? 'bg-amber-500 border-amber-500 text-white font-bold shadow-sm'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              Discount
            </button>
            <button
              onClick={() => setTypeFilter(typeFilter === 'donation' ? 'all' : 'donation')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-full border transition-all duration-200 ${
                typeFilter === 'donation'
                  ? 'bg-violet-600 border-violet-600 text-white font-bold shadow-sm'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              Donation
            </button>
          </div>
        </div>
      </div>

      {/* 4. Table view */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-12 text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mb-3 border border-slate-100">
            <Search className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 mb-1">No Results Found</h3>
          <p className="text-xs text-slate-500 max-w-sm">
            No surplus products match your filters or search keywords. Try changing filters or search.
          </p>
          <button 
            onClick={() => { setSearchQuery(''); setStatusFilter('all'); setTypeFilter('all'); }}
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
            <span>Showing {filteredProducts.length} of {products.length} products</span>
            {filteredProducts.length < products.length && (
              <span className="text-slate-400 italic">(filtered)</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
