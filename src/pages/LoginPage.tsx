import { LoginForm } from '@/features/auth';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

export function LoginPage() {
  const { isAuthenticated, isLoading, role } = useAuthStore();
  const isInitialCheck = useRef(true);

  useEffect(() => {
    if (isLoading) return;

    if (isInitialCheck.current) {
      isInitialCheck.current = false;
      return;
    }

    if (isAuthenticated) {
      toast.success('Berhasil login!');
    }
  }, [isAuthenticated, isLoading]);

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

