import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { productApi } from '../services/productApi';
import type { ProductFormValues } from '../types';

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, merchantId, merchantName, imageUrl }: { data: ProductFormValues, merchantId: string, merchantName: string, imageUrl?: string }) => 
      productApi.createProduct(data, merchantId, merchantName, imageUrl),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useMerchantProducts = (merchantId: string | undefined) => {
  return useQuery({
    queryKey: ['products', merchantId],
    queryFn: () => {
      if (!merchantId) throw new Error('Merchant ID is required');
      return productApi.getMerchantProducts(merchantId);
    },
    enabled: !!merchantId,
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, data, imageUrl }: { productId: string, data: Partial<ProductFormValues>, imageUrl?: string }) => 
      productApi.updateProduct(productId, data, imageUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => productApi.deleteProduct(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};
