import { useState } from "react";
import { toast } from "sonner";
import { uploadImageToCloudinary } from "@/features/products/services/cloudinaryApi";

export function useMerchantProfileImages() {
  const [bannerImageUrl, setBannerImageUrl] = useState("");
  const [logoImageUrl, setLogoImageUrl] = useState("");
  const [isUploadingImages, setIsUploadingImages] = useState(false);

  const handleImageUpload = async (file: File, type: "banner" | "logo") => {
    setIsUploadingImages(true);
    try {
      const url = await uploadImageToCloudinary(file);
      if (type === "banner") {
        setBannerImageUrl(url);
      } else {
        setLogoImageUrl(url);
      }
      toast.success(type === "banner" ? "Banner uploaded successfully!" : "Logo uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setIsUploadingImages(false);
    }
  };

  return {
    bannerImageUrl,
    setBannerImageUrl,
    logoImageUrl,
    setLogoImageUrl,
    isUploadingImages,
    handleImageUpload,
  };
}
