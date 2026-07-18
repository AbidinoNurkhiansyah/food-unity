import { createBrowserRouter } from 'react-router-dom';
import { HomePage } from '@/pages/HomePage';
import { LoginPage } from '@/pages/LoginPage';
import { ConsumerRegisterPage } from '@/pages/auth/ConsumerRegisterPage';
import { MerchantRegisterPage } from '@/pages/auth/MerchantRegisterPage';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardLayout } from '@/features/dashboard/components/DashboardLayout';
import { MerchantDashboardPage } from '@/pages/dashboard/MerchantDashboardPage';
import { ProductsPage } from '@/pages/dashboard/ProductsPage';
import { ExplorePage } from '@/pages/consumer/ExplorePage';
import { MyOrdersPage } from '@/pages/consumer/MyOrdersPage';

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
      }
    ]
  }
]);
