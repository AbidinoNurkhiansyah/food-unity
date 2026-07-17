import { LoginForm } from '@/features/auth';
import { Link } from 'react-router-dom';

export function LoginPage() {
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
