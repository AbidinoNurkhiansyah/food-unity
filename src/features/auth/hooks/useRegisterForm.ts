import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRegister } from './useRegister';
import { registerSchema, type RegisterValues } from '../constants/schemas';
import type { UserRole } from '@/features/auth';

export function useRegisterForm(role: UserRole) {
  const [showPassword, setShowPassword] = useState(false);
  const { error, isLoading, handleEmailRegister, handleGoogleRegister } = useRegister(role);

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  });

  return {
    form,
    showPassword,
    setShowPassword,
    error,
    isLoading,
    handleEmailRegister,
    handleGoogleRegister,
  };
}
