import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProductFormSchema } from '../types';
import type { ProductFormValues, Product } from '../types';
import { useCreateProduct, useUpdateProduct } from '../hooks/useProducts';
import { uploadImageToCloudinary } from '../services/cloudinaryApi';
import { useAuthStore } from '@/hooks/useAuthStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ProductFormProps {
  onSuccess?: () => void;
  initialData?: Product;
}

export function ProductForm({ onSuccess, initialData }: ProductFormProps) {
  const { user } = useAuthStore();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imageUrl || null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
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

  const isDonation = watch('isDonation');

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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Nama Produk / Paket</Label>
        <Input 
          id="title" 
          placeholder="Contoh: Paket Roti Manis Sore" 
          {...register('title')} 
        />
        {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Foto Produk (Opsional)</Label>
        {imagePreview && (
          <div className="relative w-28 h-28 rounded-lg overflow-hidden border border-slate-200 shadow-sm">
            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
          </div>
        )}
        <Input 
          id="image" 
          type="file" 
          accept="image/*"
          onChange={handleImageChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Deskripsi</Label>
        <Textarea 
          id="description" 
          placeholder="Deskripsikan kondisi produk, alasan surplus, dll." 
          {...register('description')} 
        />
        {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="originalPrice">Harga Asli (Rp)</Label>
          <Input 
            id="originalPrice" 
            type="number" 
            min="0"
            {...register('originalPrice', { valueAsNumber: true })} 
          />
          {errors.originalPrice && <p className="text-sm text-red-500">{errors.originalPrice.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="discountPrice">Harga Diskon (Rp)</Label>
          <Input 
            id="discountPrice" 
            type="number"
            min="0"
            disabled={isDonation}
            {...register('discountPrice', { valueAsNumber: true })} 
          />
          {errors.discountPrice && <p className="text-sm text-red-500">{errors.discountPrice.message}</p>}
        </div>
      </div>

      <div className={initialData ? "grid grid-cols-2 gap-4" : "space-y-2 flex flex-col justify-center"}>
        <div className="space-y-2 flex flex-col justify-center">
          <Label>Tipe Penjualan</Label>
          <Select 
            onValueChange={(val) => {
              const valBool = val === 'true';
              setValue('isDonation', valBool);
              if (valBool) {
                setValue('discountPrice', 0);
              }
            }} 
            defaultValue={initialData?.isDonation ? "true" : "false"}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih tipe penjualan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="false">Berbayar (Diskon)</SelectItem>
              <SelectItem value="true">Donasi (Gratis)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {initialData && (
          <div className="space-y-2 flex flex-col justify-center">
            <Label>Status Produk</Label>
            <Select 
              onValueChange={(val) => setValue('status', val as any)} 
              defaultValue={initialData.status || 'active'}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih status produk" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Aktif</SelectItem>
                <SelectItem value="sold_out">Habis Terjual</SelectItem>
                <SelectItem value="expired">Kadaluarsa</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="stock">Sisa Stok (Porsi/Paket)</Label>
          <Input 
            id="stock" 
            type="number" 
            min="1"
            {...register('stock', { valueAsNumber: true })} 
          />
          {errors.stock && <p className="text-sm text-red-500">{errors.stock.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="pickupDeadline">Batas Waktu Ambil</Label>
          <Input 
            id="pickupDeadline" 
            type="time" 
            {...register('pickupDeadline')} 
          />
          {errors.pickupDeadline && <p className="text-sm text-red-500">{errors.pickupDeadline.message}</p>}
        </div>
      </div>

      {uploadError && <p className="text-sm text-red-500 font-medium">{uploadError}</p>}

      <Button type="submit" className="w-full mt-6" disabled={isSubmitting}>
        {isSubmitting ? 'Menyimpan...' : (initialData ? 'Simpan Perubahan' : 'Unggah Produk Surplus')}
      </Button>
    </form>
  );
}
