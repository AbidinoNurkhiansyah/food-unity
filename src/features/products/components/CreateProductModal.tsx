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
          <DialogTitle>{initialData ? 'Edit Paket Surplus' : 'Buat Paket Surplus Baru'}</DialogTitle>
          <DialogDescription>
            {initialData 
              ? 'Perbarui detail makanan surplus Anda.' 
              : 'Masukkan detail makanan yang belum terjual. Pastikan makanan masih layak konsumsi sesuai standar keamanan pangan.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          <ProductForm onSuccess={onClose} initialData={initialData || undefined} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
