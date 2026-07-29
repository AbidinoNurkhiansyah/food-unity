import React from 'react';
import { Package, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductEmptyStateProps {
  onCreateClick: () => void;
}

export const ProductEmptyState: React.FC<ProductEmptyStateProps> = ({ onCreateClick }) => {
  return (
    <div className="flex flex-col items-center justify-center p-16 bg-white rounded-2xl border-2 border-slate-200/60 border-dashed mt-6 transition-all hover:border-slate-350 hover:bg-slate-50/20">
      <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mb-5 border border-slate-200/50 shadow-inner">
        <Package className="w-8 h-8 text-slate-300 animate-pulse" />
      </div>
      <h3 className="text-lg font-extrabold text-slate-900 tracking-tight mb-2">Belum Ada Stok Surplus</h3>
      <p className="text-sm text-slate-500 mb-8 text-center max-w-xs leading-relaxed font-medium">
        Anda belum mendaftarkan makanan surplus untuk dipublikasikan sebagai diskon atau donasi sosial.
      </p>
      <Button 
        onClick={onCreateClick} 
        className="gap-2 px-5 py-2.5 bg-palette-600 hover:bg-palette-700 text-white font-semibold rounded-xl text-sm shadow-sm transition-all duration-200 active:scale-98"
      >
        <Plus className="w-4 h-4" /> Mulai Tambah Paket
      </Button>
    </div>
  );
};
