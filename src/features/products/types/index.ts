import { z } from 'zod';

export const ProductFormSchema = z.object({
  title: z.string().min(3, 'Nama paket minimal 3 karakter').max(100),
  description: z.string().min(10, 'Deskripsi minimal 10 karakter'),
  originalPrice: z.number().min(0, 'Harga tidak boleh negatif'),
  discountPrice: z.number().min(0, 'Harga diskon tidak boleh negatif'),
  stock: z.number().min(1, 'Stok minimal 1'),
  pickupDeadline: z.string().min(1, 'Batas waktu pengambilan wajib diisi'),
  isDonation: z.boolean(),
  status: z.enum(['active', 'sold_out', 'expired']).optional(),
});

export type ProductFormValues = z.infer<typeof ProductFormSchema>;

export interface Product {
  id: string;
  merchantId: string;
  merchantName: string;
  title: string;
  description: string;
  imageUrl?: string;
  originalPrice: number;
  discountPrice: number;
  isDonation: boolean;
  stock: number;
  pickupDeadline: string; // ISO String
  status: 'active' | 'sold_out' | 'expired';
  createdAt: string; // ISO String
  updatedAt: string; // ISO String
}
