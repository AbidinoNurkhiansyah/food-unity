import { useAuthStore } from '@/features/auth';
import { useMerchantProducts } from './useProducts';

export function useProductList() {
  const { user } = useAuthStore();
  const { data: products, isLoading, isError } = useMerchantProducts(user?.uid);

  return {
    products,
    isLoading,
    isError,
  };
}
