import { Store } from "lucide-react";
import { type UseFormRegister, type FieldErrors } from "react-hook-form";
import { type OnboardingValues } from "../constants/schemas";
import { BusinessDetailsSection } from "./BusinessDetailsSection";

interface MerchantStepOneProps {
  register: UseFormRegister<OnboardingValues>;
  errors: FieldErrors<OnboardingValues>;
}

export function MerchantStepOne({ register, errors }: MerchantStepOneProps) {
  return (
    <>
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-primary-600 font-extrabold text-xs uppercase tracking-wider">
          <Store className="w-3.5 h-3.5" /> Welcome New Merchant
        </div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
          Business Details & Contact
        </h2>
        <p className="text-sm text-slate-500 font-medium max-w-xl">
          Enter your business name and WhatsApp contact to facilitate the
          coordination of food pickup.
        </p>
      </div>

      <div className="space-y-4">
        <BusinessDetailsSection
          register={register}
          errors={errors}
          showTitle={false}
        />
      </div>
    </>
  );
}
