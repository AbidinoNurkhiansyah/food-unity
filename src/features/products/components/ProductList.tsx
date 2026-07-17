import { useAuthStore } from '@/hooks/useAuthStore';
import { useMerchantProducts } from '../hooks/useProducts';
import { Package, Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface ProductListProps {
  onCreateClick: () => void;
  onEditClick: (product: any) => void;
  onDeleteClick: (product: any) => void;
}

export function ProductList({ onCreateClick, onEditClick, onDeleteClick }: ProductListProps) {
  const { user } = useAuthStore();
  const { data: products, isLoading, isError } = useMerchantProducts(user?.uid);

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Memuat data stok...</div>;
  }

  if (isError) {
    return <div className="p-8 text-center text-red-500">Gagal memuat data.</div>;
  }

  if (!products || products.length === 0) {
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
  }

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-900">Daftar Paket Makanan</h2>
        <Button onClick={onCreateClick} className="gap-2">
          <Plus className="w-4 h-4" /> Tambah
        </Button>
      </div>
      
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px] text-center">No.</TableHead>
              <TableHead className="w-[280px]">Produk</TableHead>
              <TableHead>Tipe</TableHead>
              <TableHead>Stok</TableHead>
              <TableHead>Batas Waktu</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Harga</TableHead>
              <TableHead className="text-center w-[100px]">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product, index) => (
              <TableRow key={product.id}>
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
                      <p className="font-semibold text-slate-900 line-clamp-1">{product.title}</p>
                      <p className="text-xs text-slate-500 line-clamp-1">{product.description}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 text-xs font-bold rounded-md ${product.isDonation ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {product.isDonation ? 'DONASI' : 'DISKON'}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="font-medium">{product.stock}</span>
                </TableCell>
                <TableCell>
                  <span className="text-slate-600">{product.pickupDeadline}</span>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    product.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 
                    product.status === 'sold' ? 'bg-slate-100 text-slate-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {product.status === 'active' ? 'Aktif' : product.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  {!product.isDonation && product.originalPrice > 0 && (
                    <div className="text-xs text-slate-400 line-through">
                      Rp {product.originalPrice.toLocaleString('id-ID')}
                    </div>
                  )}
                  <div className="font-bold text-emerald-600">
                    {product.isDonation ? 'Gratis' : `Rp ${product.discountPrice.toLocaleString('id-ID')}`}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex justify-center items-center gap-1">
                    <Button onClick={() => onEditClick(product)} variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button onClick={() => onDeleteClick(product)} variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
