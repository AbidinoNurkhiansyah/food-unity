import { createBrowserRouter } from 'react-router-dom';
import { HomePage } from '@/pages/HomePage';
import { LoginPage } from '@/pages/LoginPage';
import { ConsumerRegisterPage } from '@/pages/auth/ConsumerRegisterPage';
import { MerchantRegisterPage } from '@/pages/auth/MerchantRegisterPage';
import { ProtectedRoute } from '@/features/auth';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { MerchantDashboardPage } from '@/pages/dashboard/MerchantDashboardPage';
import { ProductsPage } from '@/pages/dashboard/ProductsPage';
import { ExplorePage } from '@/pages/consumer/ExplorePage';
import { MyOrdersPage } from '@/pages/consumer/MyOrdersPage';
import { CartPage } from '@/pages/consumer/CartPage';
import { WalletPage } from '@/pages/dashboard/WalletPage';
import { ClaimsPage } from '@/pages/dashboard/ClaimsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/explore',
    element: (
      <ProtectedRoute allowedRoles={['consumer']}>
        <ExplorePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/orders',
    element: (
      <ProtectedRoute allowedRoles={['consumer']}>
        <MyOrdersPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/cart',
    element: (
      <ProtectedRoute allowedRoles={['consumer']}>
        <CartPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register/consumer',
    element: <ConsumerRegisterPage />,
  },
  {
    path: '/register/merchant',
    element: <MerchantRegisterPage />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute allowedRoles={['merchant']}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <MerchantDashboardPage />
      },
      {
        path: 'products',
        element: <ProductsPage />
      },
      {
        path: 'wallet',
        element: <WalletPage />
      },
      {
        path: 'claims',
        element: <ClaimsPage />
      }
    ]
  }
]);
