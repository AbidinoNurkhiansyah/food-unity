import { useState } from "react";
import { toast } from "sonner";
import { uploadImageToCloudinary } from "@/features/products/services/cloudinaryApi";

export function useImageUpload() {
  const [logoImageUrl, setLogoImageUrl] = useState<string>("");
  const [bannerImageUrl, setBannerImageUrl] = useState<string>("");
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);

  const handleImageUpload = async (file: File, type: "banner" | "logo") => {
    if (type === "banner") {
      setIsUploadingBanner(true);
    } else {
      setIsUploadingLogo(true);
    }
    try {
      const url = await uploadImageToCloudinary(file);
      if (type === "banner") {
        setBannerImageUrl(url);
      } else {
        setLogoImageUrl(url);
      }
      toast.success(`Berhasil mengunggah ${type === "banner" ? "Banner" : "Logo"}`);
    } catch (error) {
      console.error(`Gagal mengunggah ${type}:`, error);
      toast.error(`Gagal mengunggah ${type === "banner" ? "Banner" : "Logo"}`);
    } finally {
      if (type === "banner") {
        setIsUploadingBanner(false);
      } else {
        setIsUploadingLogo(false);
      }
    }
  };

  return {
    logoImageUrl,
    bannerImageUrl,
    isUploadingLogo,
    isUploadingBanner,
    handleImageUpload,
  };
}
