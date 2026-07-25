import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProductFormSchema } from '../types';
import type { ProductFormValues, Product } from '../types';
import { useCreateProduct, useUpdateProduct } from './useProducts';
import { uploadImageToCloudinary } from '../services/cloudinaryApi';
import { useAuthStore } from '@/features/auth';
import { db } from '@/config/firebase';
import { doc, getDoc } from 'firebase/firestore';

export const getEffectiveStatus = (product?: Product | null): 'active' | 'sold_out' | 'expired' => {
  if (!product) return 'active';
  if (product.status === 'expired') return 'expired';
  if (product.pickupDeadline) {
    const deadline = new Date(product.pickupDeadline).getTime();
    if (!isNaN(deadline) && deadline <= Date.now()) {
      return 'expired';
    }
  }
  if (product.status === 'sold_out' || product.stock <= 0) return 'sold_out';
  return product.status || 'active';
};

const parseEndTimeFromPickupHours = (pickupHours?: string): string => {
  if (!pickupHours) return '20:00'; // Default fallback
  const parts = pickupHours.split(' - ');
  if (parts.length === 2) {
    const time = parts[1].trim();
    if (/^\d{2}:\d{2}$/.test(time)) {
      return time;
    }
  }
  return '20:00';
};

const getTodayWithTime = (timeStr: string): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}T${timeStr}`;
};

const getFormValuesFromProduct = (prod?: Product | null): ProductFormValues => {
  return {
    title: prod?.title || '',
    category: prod?.category || '',
    description: prod?.description || '',
    originalPrice: prod?.originalPrice || 0,
    discountPrice: prod?.discountPrice || 0,
    stock: prod?.stock !== undefined ? prod.stock : 1,
    unit: prod?.unit || 'porsi',
    weightInGrams: prod?.weightInGrams || 250,
    pickupDeadline: prod?.pickupDeadline || '',
    isDonation: prod?.isDonation || false,
    status: getEffectiveStatus(prod),
  };
};

export function useProductForm(onSuccess?: () => void, initialData?: Product) {
  const { user } = useAuthStore();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imageUrl || null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: getFormValuesFromProduct(initialData),
  });

  useEffect(() => {
    if (initialData) {
      form.reset(getFormValuesFromProduct(initialData));
      setImagePreview(initialData.imageUrl || null);
      setImageFile(null);
    } else {
      form.reset(getFormValuesFromProduct(null));
      setImagePreview(null);
      setImageFile(null);
    }
  }, [initialData, form]);

  useEffect(() => {
    if (!initialData && user) {
      const fetchMerchantProfile = async () => {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const profile = userDoc.data()?.profile;
            if (profile?.pickupHours) {
              const endTime = parseEndTimeFromPickupHours(profile.pickupHours);
              const defaultDeadline = getTodayWithTime(endTime);
              form.setValue('pickupDeadline', defaultDeadline);
            }
          }
        } catch (error) {
          console.error('Error fetching merchant profile for default deadline:', error);
        }
      };
      
      fetchMerchantProfile();
    }
  }, [user, initialData, form]);

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

