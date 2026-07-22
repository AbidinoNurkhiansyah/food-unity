import authIllustration from "@/assets/auth-ilustration.webp";
import appLogo from "@/assets/logo.svg";
import { ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export function AuthIllustration() {
  return (
    <div className="hidden md:flex flex-col justify-between p-7 md:p-9 bg-primary-900 text-white relative overflow-hidden">
      {/* Full Background Image */}
      <motion.img
        initial={{ scale: 1.05, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        src={authIllustration}
        alt="FoodUnity Illustration"
        className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
      />
      {/* Gradient Overlay for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-t to-transparent" />

      {/* Brand Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        className="relative z-10 flex items-center gap-3"
      >
        <img
          src={appLogo}
          alt="FoodUnity Logo"
          className="w-32 h-32 object-contain"
        />
      </motion.div>

      {/* Hero Text di Bawah Kiri */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
        className="relative z-10 mt-auto mb-8 space-y-3"
      >
        <h3 className="text-3xl font-bold text-white tracking-tight drop-shadow-md">
          Zero Food Waste Movement
        </h3>
        <p className="text-sm text-white/90 leading-relaxed max-w-md drop-shadow-sm font-medium">
          Connecting surplus high-quality food with consumers affordably. Reduce food waste and share goodness for a better environment.
        </p>
      </motion.div>

      {/* Footer Ilustrasi */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
        className="relative z-10 pt-4 border-t border-white/20 text-xs text-white/80 flex items-center justify-between font-medium"
      >
        <span>© FoodUnity 2026</span>
        <span className="flex items-center gap-1.5 text-white">
          <ShieldCheck className="w-4 h-4 text-primary-400" />
          Safe & Trusted
        </span>
      </motion.div>
    </div>
  );
}
