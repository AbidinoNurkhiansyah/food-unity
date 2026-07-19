import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginWithEmail, loginWithGoogle } from '../services/authService';
import { useAuthStore } from './useAuthStore';

export function useLogin() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const handleEmailLogin = async (data: { email: string; password: string }) => {
    setIsLoading(true);
    setError('');
    try {
      const { user, role } = await loginWithEmail(data.email, data.password);
      setUser(user, role);
      navigate(role === 'merchant' ? '/dashboard' : '/explore', { replace: true });
    } catch (err: any) {
      if (
        err.code === 'auth/invalid-credential' || 
        err.code === 'auth/user-not-found' || 
        err.code === 'auth/wrong-password'
      ) {
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
      const { user, role } = await loginWithGoogle('consumer');
      setUser(user, role);
      navigate(role === 'merchant' ? '/dashboard' : '/explore', { replace: true });
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user') {
        return;
      }
      setError(err.message || 'Gagal login dengan Google.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    error,
    isLoading,
    handleEmailLogin,
    handleGoogleLogin
  };
}
