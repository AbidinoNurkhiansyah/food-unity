import { useProductList } from '../hooks/useProductList';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductEmptyState } from './ProductEmptyState';
import { ProductTableRow } from './ProductTableRow';
import {
  Table,
  TableBody,
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
  const { products, isLoading, isError } = useProductList();

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Memuat data stok...</div>;
  }

  if (isError) {
    return <div className="p-8 text-center text-red-500">Gagal memuat data.</div>;
  }

  if (!products || products.length === 0) {
    return <ProductEmptyState onCreateClick={onCreateClick} />;
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
    </div>
  );
}
