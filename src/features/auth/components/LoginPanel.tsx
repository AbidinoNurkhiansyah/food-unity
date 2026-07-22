import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react";
import appLogo from "@/assets/logo.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent } from "@/components/ui/card";
import { useLoginForm } from "../hooks/useLoginForm";

export function LoginPanel() {
  const {
    form: {
      register,
      handleSubmit,
      formState: { errors },
    },
    showPassword,
    setShowPassword,
    error,
    isLoading,
    handleEmailLogin,
    handleGoogleLogin,
  } = useLoginForm();

  return (
    <div className="p-8 md:p-12 flex flex-col items-center justify-center overflow-y-auto overflow-x-hidden bg-white relative">
      {/* Soft background blur for the form side */}
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-primary-100 rounded-full opacity-50 pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-sm z-10 mx-auto"
      >
        {/* Header & Mobile Logo */}
        <div className="text-center md:text-left mb-8">
          <img
            src={appLogo}
            alt="FoodUnity Logo"
            className="md:hidden h-16 object-contain mx-auto mb-6"
          />
          <h3 className="font-bold text-3xl mb-2 text-gray-900 tracking-tight">
            Welcome Back
          </h3>
          <p className="text-sm text-gray-500 font-medium">
            Enter your account to login
          </p>
        </div>

        <CardContent className="p-0">
          <form onSubmit={handleSubmit(handleEmailLogin)} className="space-y-5">
            <div className="space-y-1">
              <Label htmlFor="email" className="text-xs font-bold text-gray-700">
                Email
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="enter your email"
                  className="pl-10 h-10 rounded-xl border-gray-200 bg-gray-50/50 text-sm focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-gray-900 placeholder:text-gray-400"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 font-medium pl-1 mt-0.5">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-1 relative">
              <div className="flex items-center justify-between mb-1">
                <Label htmlFor="password" className="text-xs font-bold text-gray-700">
                  Password
                </Label>
                <Link
                  to="/forgot-password"
                  className="text-[11px] font-semibold text-primary-500 hover:text-primary-700 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  id="password"
                  placeholder="enter your password"
                  type={showPassword ? "text" : "password"}
                  className="pl-10 pr-10 h-10 rounded-xl border-gray-200 bg-gray-50/50 text-sm focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-gray-900"
                  {...register("password")}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 font-medium pl-1 mt-0.5">
                  {errors.password.message}
                </p>
              )}
            </div>

            {error && (
              <div className="p-2.5 rounded-xl bg-red-50 text-red-600 text-xs font-medium border border-red-100 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0"></div>
                {error}
              </div>
            )}

            <div className="pt-2">
              <Button
                type="submit"
                className="w-full h-10 rounded-xl bg-primary-500 cursor-pointer hover:bg-primary-600 text-white font-bold text-md shadow-lg shadow-primary-500/20 transition-all flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>Login</>
                )}
              </Button>
            </div>
          </form>

          <div className="relative flex items-center my-3">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink-0 mx-3 text-gray-400 text-xs font-medium">
              or continue with
            </span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full h-10 cursor-pointer rounded-xl border border-gray-200 hover:bg-gray-50 hover:text-gray-900 font-bold text-gray-700 text-sm transition-all flex items-center justify-center gap-2.5 shadow-sm"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Google
          </Button>

          <div className="text-center mt-8 text-sm text-gray-600 font-medium">
            Don't have an account?{" "}
            <Link
              to="/register/consumer"
              className="text-primary-500 hover:text-primary-600 font-bold transition-colors"
            >
              Register
            </Link>
          </div>

          <div className="text-center mt-8 text-[11px] text-gray-400 font-medium">
            &copy; {new Date().getFullYear()} FoodUnity. All rights reserved.
          </div>
        </CardContent>
      </motion.div>
    </div>
  );
}
