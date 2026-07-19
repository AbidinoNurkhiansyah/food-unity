import { useState } from 'react';
import type { Product } from '../types';
import { useDeleteProduct } from './useProducts';

export function useProductManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const deleteProduct = useDeleteProduct();

  const handleCreate = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (deletingProduct) {
      await deleteProduct.mutateAsync(deletingProduct.id);
      setDeletingProduct(null);
    }
  };

  return {
    isModalOpen,
    setIsModalOpen,
    editingProduct,
    deletingProduct,
    setDeletingProduct,
    isDeleting: deleteProduct.isPending,
    handleCreate,
    handleEdit,
    handleDelete
  };
}
