import React from 'react';
import { Package, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductEmptyStateProps {
  onCreateClick: () => void;
}

export const ProductEmptyState: React.FC<ProductEmptyStateProps> = ({ onCreateClick }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-200 border-dashed mt-6">
      <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mb-4">
        <Package className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-1">Belum Ada Stok Surplus</h3>
      <p className="text-sm text-slate-500 mb-6 text-center max-w-sm">
        Anda belum mendaftarkan makanan surplus untuk dijual atau didonasikan.
      </p>
      <Button onClick={onCreateClick} className="gap-2">
        <Plus className="w-4 h-4" /> Tambah Paket Surplus
      </Button>
    </div>
  );
};
