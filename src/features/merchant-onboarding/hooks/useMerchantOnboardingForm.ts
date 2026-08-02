import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { db } from "@/config/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useAuthStore } from "@/features/auth";
import { onboardingSchema, type OnboardingValues } from "../constants/schemas";

// Import custom hooks
import { useRegionSelect, type RegionItem } from "./useRegionSelect";
import { useMapLocation, defaultCenter } from "./useMapLocation";
import { useImageUpload } from "./useImageUpload";

// Re-export for backward compatibility with other files (e.g., useMerchantProfileForm)
export type { RegionItem };
export { defaultCenter };

export function useMerchantOnboardingForm() {
  const { user, role, setUser } = useAuthStore();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  // Initialize sub-hooks
  const regionSelect = useRegionSelect();
  const mapLocation = useMapLocation();
  const imageUpload = useImageUpload();

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    trigger,
    control,
    formState: { errors },
  } = useForm<OnboardingValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      businessName: "",
      merchantType: "",
      phoneNumber: "",
      detailAddress: "",
      locationNotes: "",
      pickupHours: "",
      description: "",
    },
  });

  // Submit Data
  const onSubmit = async (data: OnboardingValues) => {
    // Validasi wilayah administratif
    if (
      !regionSelect.selectedProvince ||
      !regionSelect.selectedRegency ||
      !regionSelect.selectedDistrict ||
      !regionSelect.selectedVillage
    ) {
      regionSelect.setRegionError(
        "Please select the province, regency/city, district, and village location."
      );
      toast.error("Administrative region is incomplete.");
      return;
    }
    regionSelect.setRegionError("");

    if (!user) {
      toast.error("User is not authenticated.");
      return;
    }

    setSubmitting(true);
    try {
      const pName =
        regionSelect.provinces.find((p) => p.code === regionSelect.selectedProvince)?.name || "";
      const rName =
        regionSelect.regencies.find((r) => r.code === regionSelect.selectedRegency)?.name || "";
      const dName =
        regionSelect.districts.find((d) => d.code === regionSelect.selectedDistrict)?.name || "";
      const vName =
        regionSelect.villages.find((v) => v.code === regionSelect.selectedVillage)?.name || "";

      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        profile: {
          isCompleted: true,
          businessName: data.businessName || "",
          merchantType: data.merchantType,
          phoneNumber: data.phoneNumber,
          address: {
            provinceId: regionSelect.selectedProvince,
            provinceName: pName,
            regencyId: regionSelect.selectedRegency,
            regencyName: rName,
            districtId: regionSelect.selectedDistrict,
            districtName: dName,
            villageId: regionSelect.selectedVillage,
            villageName: vName,
            detailAddress: data.detailAddress,
          },
          locationNotes: data.locationNotes || "",
          coordinates: {
            latitude: parseFloat(mapLocation.customCoordinates.latitude),
            longitude: parseFloat(mapLocation.customCoordinates.longitude),
          },
          pickupHours: data.pickupHours,
          description: data.description || "",
          logoImageUrl: imageUpload.logoImageUrl || "",
          bannerImageUrl: imageUpload.bannerImageUrl || "",
          createdAt: new Date().toISOString(),
        },
      });

      toast.success("Merchant profile successfully saved!");

      // Update global state & redirect
      setUser(user, role, true);
      navigate("/dashboard", { replace: true });
    } catch (err: unknown) {
      console.error("Failed to update profile:", err);
      const errMsg = err instanceof Error ? err.message : "Failed to save profile data.";
      toast.error(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return {
    register,
    handleSubmit,
    trigger,
    control,
    errors,
    submitting,
    onSubmit,
    
    // Spread the values from sub-hooks for backwards compatibility
    ...regionSelect,
    ...mapLocation,
    ...imageUpload,
  };
}

