import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { loginWithEmail, loginWithGoogle } from '../services/authService';
import { useAuthStore } from '@/hooks/useAuthStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const loginSchema = z.object({
  email: z.string().email({ message: 'Email tidak valid' }),
  password: z.string().min(6, { message: 'Password minimal 6 karakter' }),
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginValues) => {
    setIsLoading(true);
    setError('');
    try {
      const { user, role } = await loginWithEmail(data.email, data.password);
      setUser(user, role);
      navigate(role === 'merchant' ? '/dashboard' : '/explore');
    } catch (err: any) {
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Email atau password salah.');
      } else {
        setError(err.message || 'Gagal login, periksa kembali email & password Anda.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      const { user, role } = await loginWithGoogle('consumer'); // Default to consumer on direct login, but gets actual role if exists
      setUser(user, role);
      navigate(role === 'merchant' ? '/dashboard' : '/explore');
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user') {
        return;
      }
      setError(err.message || 'Gagal login dengan Google.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Masuk</CardTitle>
        <CardDescription>
          Masukkan email Anda untuk login ke akun Penyelamat Makanan.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" {...register('email')} />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input 
                id="password" 
                type={showPassword ? 'text' : 'password'} 
                className="pr-10"
                {...register('password')} 
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
          </div>
          
          {error && <p className="text-sm text-destructive font-medium">{error}</p>}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Memproses...' : 'Masuk'}
          </Button>
        </form>

        <div className="mt-4 flex items-center justify-center">
          <span className="text-sm text-muted-foreground">atau</span>
        </div>

        <Button 
          type="button" 
          variant="outline" 
          className="w-full mt-4" 
          onClick={handleGoogleLogin}
          disabled={isLoading}
        >
          Masuk dengan Google
        </Button>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <div className="text-sm text-center text-muted-foreground mt-2">
          Belum punya akun?{' '}
          <Link to="/register/consumer" className="text-primary hover:underline font-medium">
            Daftar Konsumen
          </Link>{' '}
          |{' '}
          <Link to="/register/merchant" className="text-primary hover:underline font-medium">
            Daftar Mitra
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
