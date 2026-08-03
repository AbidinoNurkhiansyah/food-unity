import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { toast } from "sonner";
import { db } from "@/config/firebase";
import { useAuthStore } from "@/features/auth";
import { onboardingSchema, type OnboardingValues } from "@/features/merchant-onboarding/constants/schemas";
import { defaultCenter } from "@/features/merchant-onboarding/hooks/useMerchantOnboardingForm";
import { useRegionSelect } from "@/features/merchant-onboarding/hooks/useRegionSelect";
import { useMerchantLocation } from "./useMerchantLocation";
import { useMerchantProfileImages } from "./useMerchantProfileImages";

export function useMerchantProfileForm() {
  const { user, role, setUser } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"info" | "location" | "hours">("info");

  // Custom Hooks Composition
  const regionData = useRegionSelect();
  const locationData = useMerchantLocation();
  const imagesData = useMerchantProfileImages();

  const {
    register,
    handleSubmit,
    control,
    reset,
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

  useEffect(() => {
    if (!user?.uid) return;

    const fetchProfileData = async () => {
      setLoading(true);
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const profile = userDoc.data()?.profile;
          if (profile) {
            reset({
              businessName: profile.businessName || "",
              merchantType: profile.merchantType || "",
              phoneNumber: profile.phoneNumber || "",
              detailAddress: profile.address?.detailAddress || "",
              locationNotes: profile.locationNotes || "",
              pickupHours: profile.pickupHours || "",
              description: profile.description || "",
            });
            imagesData.setBannerImageUrl(profile.bannerImageUrl || "");
            imagesData.setLogoImageUrl(profile.logoImageUrl || "");

            if (profile.coordinates) {
              locationData.setCoordinates({
                lat: profile.coordinates.latitude || defaultCenter.lat,
                lng: profile.coordinates.longitude || defaultCenter.lng,
              });
              locationData.setCustomCoordinates({
                latitude: (profile.coordinates.latitude || defaultCenter.lat).toString(),
                longitude: (profile.coordinates.longitude || defaultCenter.lng).toString(),
              });
            }

            const addr = profile.address;
            if (addr) {
              regionData.setSelectedProvince(addr.provinceId || "");
              regionData.setSelectedRegency(addr.regencyId || "");
              regionData.setSelectedDistrict(addr.districtId || "");
              regionData.setSelectedVillage(addr.villageId || "");
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch merchant profile data:", err);
        toast.error("Failed to load merchant profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user?.uid, reset]);

  const onSubmit = async (data: OnboardingValues) => {
    if (!regionData.selectedProvince || !regionData.selectedRegency || !regionData.selectedDistrict || !regionData.selectedVillage) {
      regionData.setRegionError("Administrative region must be complete.");
      toast.error("Administrative region is not complete.");
      setActiveTab("location");
      return;
    }
    regionData.setRegionError("");

    if (!user) return;

    setSubmitting(true);
    try {
      const pName = regionData.provinces.find((p: any) => p.code === regionData.selectedProvince)?.name || "";
      const rName = regionData.regencies.find((r: any) => r.code === regionData.selectedRegency)?.name || "";
      const dName = regionData.districts.find((d: any) => d.code === regionData.selectedDistrict)?.name || "";
      const vName = regionData.villages.find((v: any) => v.code === regionData.selectedVillage)?.name || "";

      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        "profile.businessName": data.businessName || "",
        "profile.merchantType": data.merchantType,
        "profile.phoneNumber": data.phoneNumber,
        "profile.address": {
          provinceId: regionData.selectedProvince,
          provinceName: pName,
          regencyId: regionData.selectedRegency,
          regencyName: rName,
          districtId: regionData.selectedDistrict,
          districtName: dName,
          villageId: regionData.selectedVillage,
          villageName: vName,
          detailAddress: data.detailAddress,
        },
        "profile.locationNotes": data.locationNotes || "",
        "profile.coordinates": {
          latitude: parseFloat(locationData.customCoordinates.latitude),
          longitude: parseFloat(locationData.customCoordinates.longitude),
        },
        "profile.pickupHours": data.pickupHours,
        "profile.description": data.description || "",
        "profile.bannerImageUrl": imagesData.bannerImageUrl,
        "profile.logoImageUrl": imagesData.logoImageUrl,
        "profile.updatedAt": new Date().toISOString(),
      });

      toast.success("Store profile successfully updated!");
      setUser(user, role, true);
    } catch (err) {
      console.error("Failed to update profile:", err);
      toast.error("Failed to save profile updates.");
    } finally {
      setSubmitting(false);
    }
  };

  return {
    loading,
    submitting,
    activeTab,
    setActiveTab,
    ...regionData,
    ...locationData,
    ...imagesData,
    register,
    handleSubmit,
    control,
    errors,
    onSubmit
  };
}
