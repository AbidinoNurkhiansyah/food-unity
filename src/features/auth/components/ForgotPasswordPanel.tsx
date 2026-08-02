import { motion } from "framer-motion";
import { Mail, Loader2, CheckCircle2 } from "lucide-react";
import appLogo from "@/assets/logo.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent } from "@/components/ui/card";
import { useForgotPasswordForm } from "../hooks/useForgotPasswordForm";

export function ForgotPasswordPanel() {
  const { email, setEmail, isLoading, error, success, handleSubmit } =
    useForgotPasswordForm();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary-50/20 backdrop-blur-3xl -z-10"></div>

      <div className="w-full max-w-md p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className=" overflow-hidden relative"
        >
          <div className="p-8 md:p-10 flex flex-col">
            <img src={appLogo} alt="FoodUnity" className="h-10 mb-12  " />

            <h2 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">
              Forgot Password?
            </h2>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              Enter the email registered to your account, and we will send you a
              link to reset your password.
            </p>

            <CardContent className="p-0">
              {success ? (
                <div className="bg-green-50 border border-green-100 rounded-xl p-5 flex flex-col items-center text-center animate-in fade-in zoom-in duration-300">
                  <CheckCircle2 className="w-10 h-10 text-green-500 mb-3" />
                  <h4 className="font-bold text-green-800 text-sm mb-1">
                    Email Sent!
                  </h4>
                  <p className="text-green-700 text-xs">
                    Please check your inbox or spam folder for further
                    instructions.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <Label
                      htmlFor="email"
                      className="text-xs font-bold text-gray-700"
                    >
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
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-10 rounded-xl border-gray-200 bg-gray-50/50 text-sm focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-gray-900"
                        required
                      />
                    </div>
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
                        "Send Reset Link"
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
