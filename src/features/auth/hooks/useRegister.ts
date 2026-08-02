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
      // Register dan kirim email verifikasi (via authService)
      await registerWithEmail(data.email, data.password, data.name, role);
      // Kita tidak langsung set user ke Zustand (supaya di App.tsx terdeteksi belum diverifikasi)
      // atau set user bisa saja, tapi biarkan mereka ke Verify Email page
      
      // Logout secara eksplisit supaya tidak masuk state "logged in" belum terverifikasi
      // atau kita bisa redirect ke halaman verifikasi tanpa masalah
      navigate('/verify-email', { state: { email: data.email } });
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
      setUser(result.user, result.role, result.isCompleted);
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
