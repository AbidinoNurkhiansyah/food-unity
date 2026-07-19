import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProductFormSchema } from '../types';
import type { ProductFormValues, Product } from '../types';
import { useCreateProduct, useUpdateProduct } from './useProducts';
import { uploadImageToCloudinary } from '../services/cloudinaryApi';
import { useAuthStore } from '@/features/auth';

export function useProductForm(onSuccess?: () => void, initialData?: Product) {
  const { user } = useAuthStore();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imageUrl || null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      originalPrice: initialData?.originalPrice || 0,
      discountPrice: initialData?.discountPrice || 0,
      stock: initialData?.stock || 1,
      pickupDeadline: initialData?.pickupDeadline || '',
      isDonation: initialData?.isDonation || false,
      status: initialData?.status || 'active',
    },
  });

  const onSubmit = async (data: ProductFormValues) => {
    if (!user) return;
    setUploadError(null);
    
    try {
      let imageUrl = undefined;
      
      if (imageFile) {
        imageUrl = await uploadImageToCloudinary(imageFile);
      }

      if (initialData) {
        await updateProduct.mutateAsync({
          productId: initialData.id,
          data,
          imageUrl,
        });
      } else {
        await createProduct.mutateAsync({
          data,
          merchantId: user.uid,
          merchantName: user.displayName || 'Mitra',
          imageUrl,
        });
      }
      onSuccess?.();
    } catch (error) {
      console.error('Failed to save product', error);
      setUploadError(error instanceof Error ? error.message : 'Gagal mengunggah gambar atau menyimpan data');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const isDonation = form.watch('isDonation');

  return {
    form,
    imagePreview,
    uploadError,
    isDonation,
    isSubmitting: form.formState.isSubmitting,
    onSubmit: form.handleSubmit(onSubmit),
    handleImageChange,
  };
}
