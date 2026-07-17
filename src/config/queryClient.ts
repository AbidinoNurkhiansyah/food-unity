import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Default to false for better UX, can be overridden per query
      retry: 1, // Only retry once by default
      staleTime: 1000 * 60 * 5, // 5 minutes cache
    },
  },
});
