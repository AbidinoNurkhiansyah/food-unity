import { CheckCircle, Store, Compass, MapPin, ShieldCheck } from "lucide-react";
import appLogo from "@/assets/logo.svg";

interface MerchantOnboardingSidebarProps {
  currentStep: number;
}

export function MerchantOnboardingSidebar({ currentStep }: MerchantOnboardingSidebarProps) {
  return (
    <div className="hidden md:flex flex-col justify-between p-8 bg-primary-600 text-white relative select-none">
      {/* Brand Logo */}
      <div className="relative">
        <img
          src={appLogo}
          alt="FoodUnity Logo"
          className="h-6 w-auto object-contain brightness-0 invert"
        />
      </div>

      {/* Stepper Progress */}
      <div className="relative flex flex-col space-y-8 my-auto py-10">
        {/* Vertical line behind step buttons */}
        <div className="absolute left-[23px] top-6 bottom-6 w-[2px] bg-primary-700 z-0"></div>

        {/* STEP 1 */}
        <div className="flex items-center gap-4 relative z-10">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm transition-all duration-300 ${
              currentStep === 1
                ? "bg-white text-primary-600 border-2 border-white scale-105"
                : currentStep > 1
                ? "bg-palette-500 text-white border-2 border-palette-500"
                : "bg-primary-700 text-primary-400/80 border-2 border-primary-700"
            }`}
          >
            {currentStep > 1 ? (
              <CheckCircle className="w-5 h-5 text-white" />
            ) : (
              <Store className="w-5 h-5" />
            )}
          </div>
          <div>
            <p
              className={`text-[11px] font-bold uppercase tracking-wider transition-colors duration-300 ${
                currentStep === 1
                  ? "text-white"
                  : currentStep > 1
                  ? "text-palette-200"
                  : "text-primary-400"
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
        <div className="flex items-center gap-4 relative z-10">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm transition-all duration-300 ${
              currentStep === 2
                ? "bg-white text-primary-600 border-2 border-white scale-105"
                : currentStep > 2
                ? "bg-palette-500 text-white border-2 border-palette-500"
                : "bg-primary-700 text-primary-400/80 border-2 border-primary-700"
            }`}
          >
            {currentStep > 2 ? (
              <CheckCircle className="w-5 h-5 text-white" />
            ) : (
              <Compass className="w-5 h-5" />
            )}
          </div>
          <div>
            <p
              className={`text-[11px] font-bold uppercase tracking-wider transition-colors duration-300 ${
                currentStep === 2
                  ? "text-white"
                  : currentStep > 2
                  ? "text-palette-200"
                  : "text-primary-400"
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
        <div className="flex items-center gap-4 relative z-10">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm transition-all duration-300 ${
              currentStep === 3
                ? "bg-white text-primary-600 border-2 border-white scale-105"
                : "bg-primary-700 text-primary-400/80 border-2 border-primary-700"
            }`}
          >
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <p
              className={`text-[11px] font-bold uppercase tracking-wider transition-colors duration-300 ${
                currentStep === 3 ? "text-white" : "text-primary-400"
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
      <div className="relative pt-4 border-t border-primary-700 text-[11px] text-primary-300 flex items-center justify-between font-medium">
        <span>© FoodUnity 2026</span>
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-palette-300" />
          Merchant Portal
        </span>
      </div>
    </div>
  );
}
