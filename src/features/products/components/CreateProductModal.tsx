import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ProductForm } from './ProductForm';
import type { Product } from '../types';
import { Package } from 'lucide-react';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Product | null;
}

export function ProductModal({ isOpen, onClose, initialData }: ProductModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto p-6 rounded-2xl border border-slate-200/80 shadow-2xl bg-white">
        <DialogHeader className="pb-4 border-b border-slate-100 flex flex-row items-center gap-3">
          <div className="p-2.5 rounded-xl bg-palette-50 text-palette-600 border border-palette-100/50 shadow-sm shrink-0">
            <Package className="w-5 h-5 text-palette-600 animate-pulse" />
          </div>
          <div className="space-y-0.5">
            <DialogTitle className="text-lg font-bold text-slate-800 tracking-tight">
              {initialData ? 'Edit Surplus Package' : 'Create New Surplus Package'}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400 font-medium">
              {initialData 
                ? 'Update your surplus food details and save changes.' 
                : 'Enter details of the unsold food. Make sure it complies with food safety standards.'}
            </DialogDescription>
          </div>
        </DialogHeader>
        
        <div className="mt-4">
          <ProductForm onSuccess={onClose} initialData={initialData || undefined} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
