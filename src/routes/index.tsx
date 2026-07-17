import { createBrowserRouter } from 'react-router-dom';
import { HomePage } from '@/pages/HomePage';
import { LoginPage } from '@/pages/LoginPage';
import { ConsumerRegisterPage } from '@/pages/auth/ConsumerRegisterPage';
import { MerchantRegisterPage } from '@/pages/auth/MerchantRegisterPage';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardLayout } from '@/features/dashboard/components/DashboardLayout';
import { MerchantDashboardPage } from '@/pages/dashboard/MerchantDashboardPage';
import { ExplorePage } from '@/pages/consumer/ExplorePage';

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
      }
    ]
  }
]);
