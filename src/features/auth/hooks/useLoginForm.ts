import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin } from "./useLogin";
import { loginSchema, type LoginValues } from "../constants/schemas";

export function useLoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { error, isLoading, handleEmailLogin, handleGoogleLogin } = useLogin();

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  return {
    form,
    showPassword,
    setShowPassword,
    error,
    isLoading,
    handleEmailLogin,
    handleGoogleLogin,
  };
}
