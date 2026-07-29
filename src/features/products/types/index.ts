import { z } from 'zod';

export const ProductFormSchema = z.object({
  title: z.string().min(3, 'Package name must be at least 3 characters').max(100),
  category: z.string().min(1, 'Category is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  originalPrice: z.number().min(0, 'Original price cannot be negative'),
  discountPrice: z.number().min(0, 'Discount price cannot be negative'),
  stock: z.number().min(1, 'Stock must be at least 1'),
  unit: z.enum(['pcs', 'box', 'kg', 'gram', 'porsi']),
  weightInGrams: z.number().min(1, 'Estimated weight (grams) is required'),
  pickupDeadline: z.string().min(1, 'Pickup deadline is required'),
  isDonation: z.boolean(),
  status: z.enum(['active', 'sold_out', 'expired']).optional(),
});

export type ProductFormValues = z.infer<typeof ProductFormSchema>;

export interface Product {
  id: string;
  merchantId: string;
  merchantName: string;
  title: string;
  category: string;
  description: string;
  imageUrl?: string;
  originalPrice: number;
  discountPrice: number;
  isDonation: boolean;
  stock: number;
  unit: 'pcs' | 'box' | 'kg' | 'gram' | 'porsi';
  weightInGrams: number;
  pickupDeadline: string; // ISO String
  status: 'active' | 'sold_out' | 'expired';
  createdAt: string; // ISO String
  updatedAt: string; // ISO String
}
