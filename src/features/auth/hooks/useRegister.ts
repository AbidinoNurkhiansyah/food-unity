import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerWithEmail, loginWithGoogle } from '../services/authService';
import { useAuthStore, type UserRole } from './useAuthStore';

export function useRegister(role: UserRole) {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const handleEmailRegister = async (data: { email: string; password: string; name: string }) => {
    setIsLoading(true);
    setError('');
    try {
      const result = await registerWithEmail(data.email, data.password, data.name, role);
      setUser(result.user, result.role);
      navigate(role === 'merchant' ? '/dashboard' : '/explore');
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Email ini sudah terdaftar. Silakan masuk (login) atau gunakan email lain.');
      } else {
        setError(err.message || 'Gagal mendaftar, silakan coba lagi.');
      }
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
      if (err.code === 'auth/popup-closed-by-user') {
        return;
      }
      setError(err.message || 'Gagal mendaftar dengan Google.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    error,
    isLoading,
    handleEmailRegister,
    handleGoogleRegister
  };
}
