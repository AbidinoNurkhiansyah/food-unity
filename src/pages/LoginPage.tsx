import { LoginForm } from '@/features/auth';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth';

export function LoginPage() {
  const { isAuthenticated, isLoading, role } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={role === 'merchant' ? '/dashboard' : '/explore'} replace />;
  }

  return (
    <div className="min-h-screen bg-white">
      <LoginForm />
    </div>
  );
}

