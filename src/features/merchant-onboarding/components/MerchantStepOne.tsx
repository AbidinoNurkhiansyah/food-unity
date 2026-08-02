import { Store } from "lucide-react";
import { type UseFormRegister, type FieldErrors } from "react-hook-form";
import { type OnboardingValues } from "../constants/schemas";
import { BusinessDetailsSection } from "./BusinessDetailsSection";

interface MerchantStepOneProps {
  register: UseFormRegister<OnboardingValues>;
  errors: FieldErrors<OnboardingValues>;
  bannerImageUrl?: string;
  logoImageUrl?: string;
  isUploadingLogo?: boolean;
  isUploadingBanner?: boolean;
  handleImageUpload?: (file: File, type: "banner" | "logo") => Promise<void>;
}

export function MerchantStepOne({
  register,
  errors,
  bannerImageUrl,
  logoImageUrl,
  isUploadingLogo,
  isUploadingBanner,
  handleImageUpload,
}: MerchantStepOneProps) {
  return (
    <>
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-primary-600 font-extrabold text-md uppercase tracking-wider">
          <Store className="h-5" /> Welcome New Merchant
        </div>

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
          bannerImageUrl={bannerImageUrl}
          logoImageUrl={logoImageUrl}
          isUploadingLogo={isUploadingLogo}
          isUploadingBanner={isUploadingBanner}
          handleImageUpload={handleImageUpload}
        />
      </div>
    </>
  );
}
