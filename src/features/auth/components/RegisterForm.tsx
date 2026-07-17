import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { registerWithEmail, loginWithGoogle } from '../services/authService';
import { useAuthStore, type UserRole } from '@/hooks/useAuthStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const registerSchema = z.object({
  name: z.string().min(2, { message: 'Nama minimal 2 karakter' }),
  email: z.string().email({ message: 'Email tidak valid' }),
  password: z.string().min(6, { message: 'Password minimal 6 karakter' }),
});

type RegisterValues = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  role: UserRole;
}

export function RegisterForm({ role }: RegisterFormProps) {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterValues) => {
    setIsLoading(true);
    setError('');
    try {
      const result = await registerWithEmail(data.email, data.password, data.name, role);
      setUser(result.user, result.role);
      navigate(role === 'merchant' ? '/dashboard' : '/explore');
    } catch (err: any) {
      setError(err.message || 'Gagal mendaftar, silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setIsLoading(true);
    setError('');
    try {
      const result = await loginWithGoogle(role);
      setUser(result.user, result.role);
      navigate(result.role === 'merchant' ? '/dashboard' : '/explore');
    } catch (err: any) {
      setError(err.message || 'Gagal mendaftar dengan Google.');
    } finally {
      setIsLoading(false);
    }
  };

  const isMerchant = role === 'merchant';

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">
          Daftar sebagai {isMerchant ? 'Mitra Toko' : 'Konsumen'}
        </CardTitle>
        <CardDescription>
          {isMerchant 
            ? 'Bergabunglah untuk menyelamatkan makanan surplus dari tokomu.' 
            : 'Buat akun untuk mulai mencari makanan lezat yang terjangkau.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{isMerchant ? 'Nama Toko' : 'Nama Lengkap'}</Label>
            <Input id="name" placeholder={isMerchant ? 'Budi Bakery' : 'John Doe'} {...register('name')} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" {...register('email')} />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" {...register('password')} />
            {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
          </div>
          
          {error && <p className="text-sm text-destructive font-medium">{error}</p>}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Memproses...' : 'Daftar Sekarang'}
          </Button>
        </form>

        <div className="mt-4 flex items-center justify-center">
          <span className="text-sm text-muted-foreground">atau</span>
        </div>

        <Button 
          type="button" 
          variant="outline" 
          className="w-full mt-4" 
          onClick={handleGoogleRegister}
          disabled={isLoading}
        >
          Daftar dengan Google
        </Button>
      </CardContent>
      <CardFooter>
        <div className="text-sm text-center text-muted-foreground w-full mt-2">
          Sudah punya akun?{' '}
          <Link to="/login" className="text-primary hover:underline font-medium">
            Masuk di sini
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
