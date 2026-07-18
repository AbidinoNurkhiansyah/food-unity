import { Link, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/hooks/useAuthStore';

export function HomePage() {
  const { isAuthenticated, isLoading, role } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={role === 'merchant' ? '/dashboard' : '/explore'} replace />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4 text-primary">
        Penyelamat Makanan
      </h1>
      <p className="text-xl text-muted-foreground mb-8 text-center max-w-2xl">
        Platform untuk menghubungkan makanan surplus layak konsumsi dengan yang membutuhkan. #ZeroHunger
      </p>
      <div className="flex gap-4">
        <Link to="/login" className="bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors">
          Mulai Sekarang
        </Link>
      </div>
    </div>
  );
}
