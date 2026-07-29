import { Package, AlertCircle } from 'lucide-react';
import { 
  ProductList, 
  ProductModal, 
  useProductManagement 
} from '@/features/products';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export function ProductsPage() {
  const {
    isModalOpen,
    setIsModalOpen,
    editingProduct,
    deletingProduct,
    setDeletingProduct,
    isDeleting,
    handleCreate,
    handleEdit,
    handleDelete
  } = useProductManagement();

  return (
    <div className="w-full px-6 py-6 font-sans bg-slate-50/30 min-h-screen">
      
      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white shadow-sm border border-slate-200/60 text-slate-600 rounded-full text-xs font-semibold mb-4 transition-all hover:border-slate-300">
          <Package className="w-3.5 h-3.5 text-palette-600 animate-pulse" />
          <span>Manajemen Stok</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Kelola Produk Surplus
        </h1>
        <p className="mt-2 text-sm text-slate-500 font-medium leading-relaxed max-w-2xl">
          Pantau dan distribusikan makanan surplus Anda ke publik sebagai diskon atau donasi sosial untuk mengurangi limbah makanan.
        </p>
      </header>

      <ProductList 
        onCreateClick={handleCreate} 
        onEditClick={handleEdit}
        onDeleteClick={setDeletingProduct}
      />

      <ProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialData={editingProduct}
      />

      <AlertDialog open={!!deletingProduct} onOpenChange={(open) => !open && setDeletingProduct(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Hapus Produk?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus produk <strong>{deletingProduct?.title}</strong>? Data yang sudah dihapus tidak dapat dikembalikan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

