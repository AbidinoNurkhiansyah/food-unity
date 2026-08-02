import { CheckCircle, Store, Compass, MapPin, ShieldCheck } from "lucide-react";
import appLogo from "@/assets/logo.svg";

interface MerchantOnboardingSidebarProps {
  currentStep: number;
}

export function MerchantOnboardingSidebar({ currentStep }: MerchantOnboardingSidebarProps) {
  return (
    <div className="hidden md:flex flex-col justify-between p-8 bg-primary-950 text-white relative select-none overflow-hidden">
      {/* Decorative gradient blob */}
      <div className="absolute top-0 left-0 w-full h-64 bg-primary/10 blur-[100px] rounded-full pointer-events-none transform -translate-y-1/2"></div>
      
      {/* Brand Logo */}
      <div className="relative z-10">
        <img
          src={appLogo}
          alt="FoodUnity Logo"
          className="h-7 w-auto object-contain brightness-0 invert opacity-90"
        />
      </div>

      {/* Stepper Progress */}
      <div className="relative flex flex-col space-y-8 my-auto py-10 z-10">
        {/* Vertical line behind step buttons */}
        <div className="absolute left-[23px] top-6 bottom-6 w-[2px] bg-primary-900 z-0"></div>

        {/* STEP 1 */}
        <div className="flex items-center gap-4 relative z-10 group">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm transition-all duration-500 ${
              currentStep === 1
                ? "bg-primary text-primary-950 border-2 border-primary scale-110 shadow-[0_0_20px_var(--color-primary)]"
                : currentStep > 1
                ? "bg-palette-500 text-white border-2 border-palette-500 shadow-[0_0_15px_var(--color-palette-500)]"
                : "bg-primary-900 text-primary-500/50 border-2 border-primary-900"
            }`}
          >
            {currentStep > 1 ? (
              <CheckCircle className="w-5 h-5 text-white" />
            ) : (
              <Store className="w-5 h-5" />
            )}
          </div>
          <div className="transition-transform duration-300 group-hover:translate-x-1">
            <p
              className={`text-[11px] font-bold uppercase tracking-widest transition-colors duration-300 ${
                currentStep === 1
                  ? "text-primary"
                  : currentStep > 1
                  ? "text-palette-400"
                  : "text-primary-600/50"
              }`}
            >
              Step 01
            </p>
            <h4
              className={`text-sm transition-colors duration-300 ${
                currentStep === 1
                  ? "text-white font-black"
                  : currentStep > 1
                  ? "text-white/90 font-bold"
                  : "text-white/30 font-medium"
              }`}
            >
              Business / Donor Details
            </h4>
          </div>
        </div>

        {/* STEP 2 */}
        <div className="flex items-center gap-4 relative z-10 group">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm transition-all duration-500 ${
              currentStep === 2
                ? "bg-primary text-primary-950 border-2 border-primary scale-110 shadow-[0_0_20px_var(--color-primary)]"
                : currentStep > 2
                ? "bg-palette-500 text-white border-2 border-palette-500 shadow-[0_0_15px_var(--color-palette-500)]"
                : "bg-primary-900 text-primary-500/50 border-2 border-primary-900"
            }`}
          >
            {currentStep > 2 ? (
              <CheckCircle className="w-5 h-5 text-white" />
            ) : (
              <Compass className="w-5 h-5" />
            )}
          </div>
          <div className="transition-transform duration-300 group-hover:translate-x-1">
            <p
              className={`text-[11px] font-bold uppercase tracking-widest transition-colors duration-300 ${
                currentStep === 2
                  ? "text-primary"
                  : currentStep > 2
                  ? "text-palette-400"
                  : "text-primary-600/50"
              }`}
            >
              Step 02
            </p>
            <h4
              className={`text-sm transition-colors duration-300 ${
                currentStep === 2
                  ? "text-white font-black"
                  : currentStep > 2
                  ? "text-white/90 font-bold"
                  : "text-white/30 font-medium"
              }`}
            >
              Administrative Region
            </h4>
          </div>
        </div>

        {/* STEP 3 */}
        <div className="flex items-center gap-4 relative z-10 group">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm transition-all duration-500 ${
              currentStep === 3
                ? "bg-primary text-primary-950 border-2 border-primary scale-110 shadow-[0_0_20px_var(--color-primary)]"
                : "bg-primary-900 text-primary-500/50 border-2 border-primary-900"
            }`}
          >
            <MapPin className="w-5 h-5" />
          </div>
          <div className="transition-transform duration-300 group-hover:translate-x-1">
            <p
              className={`text-[11px] font-bold uppercase tracking-widest transition-colors duration-300 ${
                currentStep === 3 ? "text-primary" : "text-primary-600/50"
              }`}
            >
              Step 03
            </p>
            <h4
              className={`text-sm transition-colors duration-300 ${
                currentStep === 3
                  ? "text-white font-black"
                  : "text-white/30 font-medium"
              }`}
            >
              GPS Location & Operations
            </h4>
          </div>
        </div>
      </div>

      {/* Left Panel Footer */}
      <div className="relative z-10 pt-4 border-t border-primary-900 text-[11px] text-primary-400/60 flex items-center justify-between font-medium">
        <span>© FoodUnity 2026</span>
        <span className="flex items-center gap-1.5 text-primary-200">
          <ShieldCheck className="w-3.5 h-3.5 text-palette-400" />
          Merchant Portal
        </span>
      </div>
    </div>
  );
}
