import { LoginForm } from '@/features/auth';
import { Link, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth';

export function LoginPage() {
  const { isAuthenticated, isLoading, role } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={role === 'merchant' ? '/dashboard' : '/explore'} replace />;
  }

  return (
    <div className="min-h-screen bg-muted/50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-card text-card-foreground shadow-sm rounded-xl p-6">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight">Selamat Datang Kembali</h1>
          <p className="text-sm text-muted-foreground">Login ke akun Penyelamat Makanan</p>
        </div>
        <LoginForm />
        <div className="mt-4 text-center text-sm">
          <Link to="/" className="text-primary hover:underline">
            &larr; Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
