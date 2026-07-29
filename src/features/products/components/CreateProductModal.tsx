import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ProductForm } from './ProductForm';
import type { Product } from '../types';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Product | null;
}

export function ProductModal({ isOpen, onClose, initialData }: ProductModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[720px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Surplus Package' : 'Create New Surplus Package'}</DialogTitle>
          <DialogDescription>
            {initialData 
              ? 'Update your surplus food details.' 
              : 'Enter the details of the unsold food. Make sure the food is still fit for consumption according to food safety standards.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          <ProductForm onSuccess={onClose} initialData={initialData || undefined} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
