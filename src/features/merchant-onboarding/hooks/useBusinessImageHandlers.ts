import { useImageUploader } from "@/features/products/hooks/useImageUploader";

export function useBusinessImageHandlers(
  handleImageUpload?: (file: File, type: "banner" | "logo") => Promise<void>
) {
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0] && handleImageUpload) {
      handleImageUpload(e.target.files[0], "logo");
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0] && handleImageUpload) {
      handleImageUpload(e.target.files[0], "banner");
    }
  };

  const logoUploader = useImageUploader({
    onImageChange: handleLogoChange,
    maxSizeInMB: 1,
  });

  const bannerUploader = useImageUploader({
    onImageChange: handleBannerChange,
    maxSizeInMB: 1,
  });

  return {
    logoUploader,
    bannerUploader,
  };
}
