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
      const { user, role, isCompleted } = await loginWithEmail(data.email, data.password);
      setUser(user, role, isCompleted);
      navigate(role === 'merchant' ? '/dashboard' : '/explore', { replace: true });
    } catch (err: any) {
      if (
        err.code === 'auth/invalid-credential' || 
        err.code === 'auth/user-not-found' || 
        err.code === 'auth/wrong-password'
      ) {
        setError('Incorrect email or password.');
      } else {
        setError(err.message || 'Login failed, please check your email and password.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      const { user, role, isCompleted } = await loginWithGoogle('consumer', true);
      setUser(user, role, isCompleted);
      navigate(role === 'merchant' ? '/dashboard' : '/explore', { replace: true });
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user') {
        return;
      }
      if (err.code === 'auth/user-not-found') {
        setError('Account not registered. Please register first.');
      } else {
        setError(err.message || 'Failed to login with Google.');
      }
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
