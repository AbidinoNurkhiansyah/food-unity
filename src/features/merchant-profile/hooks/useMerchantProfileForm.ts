import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { toast } from "sonner";
import { db } from "@/config/firebase";
import { useAuthStore } from "@/features/auth";
import { onboardingSchema, type OnboardingValues } from "@/features/merchant-onboarding/constants/schemas";
import { type RegionItem, defaultCenter } from "@/features/merchant-onboarding/hooks/useMerchantOnboardingForm";

const BACKEND_URL = import.meta.env.VITE_API_URL;

export function useMerchantProfileForm() {
  const { user, role, setUser } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"info" | "location" | "hours">("info");

  // Region State
  const [provinces, setProvinces] = useState<RegionItem[]>([]);
  const [regencies, setRegencies] = useState<RegionItem[]>([]);
  const [districts, setDistricts] = useState<RegionItem[]>([]);
  const [villages, setVillages] = useState<RegionItem[]>([]);

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedRegency, setSelectedRegency] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedVillage, setSelectedVillage] = useState("");
  const [regionError, setRegionError] = useState("");

  // GPS State
  const [coordinates, setCoordinates] = useState(defaultCenter);
  const [customCoordinates, setCustomCoordinates] = useState({
    latitude: defaultCenter.lat.toString(),
    longitude: defaultCenter.lng.toString(),
  });
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

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
        const provRes = await fetch(`${BACKEND_URL}/api/location/provinces`);
        const provData = await provRes.json();
        setProvinces(provData.data || []);

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

            if (profile.coordinates) {
              setCoordinates({
                lat: profile.coordinates.latitude || defaultCenter.lat,
                lng: profile.coordinates.longitude || defaultCenter.lng,
              });
              setCustomCoordinates({
                latitude: (profile.coordinates.latitude || defaultCenter.lat).toString(),
                longitude: (profile.coordinates.longitude || defaultCenter.lng).toString(),
              });
            }

            const addr = profile.address;
            if (addr) {
              setSelectedProvince(addr.provinceId || "");
              if (addr.provinceId) {
                const regRes = await fetch(`${BACKEND_URL}/api/location/regencies/${addr.provinceId}`);
                const regData = await regRes.json();
                setRegencies(regData.data || []);
                setSelectedRegency(addr.regencyId || "");
                
                if (addr.regencyId) {
                  const distRes = await fetch(`${BACKEND_URL}/api/location/districts/${addr.regencyId}`);
                  const distData = await distRes.json();
                  setDistricts(distData.data || []);
                  setSelectedDistrict(addr.districtId || "");
                  
                  if (addr.districtId) {
                    const vilRes = await fetch(`${BACKEND_URL}/api/location/villages/${addr.districtId}`);
                    const vilData = await vilRes.json();
                    setVillages(vilData.data || []);
                    setSelectedVillage(addr.villageId || "");
                  }
                }
              }
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

  const handleProvinceChange = async (provId: string) => {
    setSelectedProvince(provId);
    setSelectedRegency("");
    setRegencies([]);
    setSelectedDistrict("");
    setDistricts([]);
    setSelectedVillage("");
    setVillages([]);
    try {
      const res = await fetch(`${BACKEND_URL}/api/location/regencies/${provId}`);
      const data = await res.json();
      setRegencies(data.data || []);
    } catch (e) {
      console.error("Error fetching regencies:", e);
    }
  };

  const handleRegencyChange = async (regId: string) => {
    setSelectedRegency(regId);
    setSelectedDistrict("");
    setDistricts([]);
    setSelectedVillage("");
    setVillages([]);
    try {
      const res = await fetch(`${BACKEND_URL}/api/location/districts/${regId}`);
      const data = await res.json();
      setDistricts(data.data || []);
    } catch (e) {
      console.error("Error fetching districts:", e);
    }
  };

  const handleDistrictChange = async (distId: string) => {
    setSelectedDistrict(distId);
    setSelectedVillage("");
    setVillages([]);
    try {
      const res = await fetch(`${BACKEND_URL}/api/location/villages/${distId}`);
      const data = await res.json();
      setVillages(data.data || []);
    } catch (e) {
      console.error("Error fetching villages:", e);
    }
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsDetectingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoordinates({ lat: latitude, lng: longitude });
          setCustomCoordinates({
            latitude: latitude.toString(),
            longitude: longitude.toString(),
          });
          toast.success("Successfully detected your GPS location!");
          setIsDetectingLocation(false);
        },
        (error) => {
          console.error("Geolocation error:", error);
          toast.error("Failed to get location. Ensure location permissions are active.");
          setIsDetectingLocation(false);
        },
        { enableHighAccuracy: true }
      );
    } else {
      toast.error("Browser does not support location detection.");
    }
  };

  const onMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setCoordinates({ lat, lng });
      setCustomCoordinates({
        latitude: lat.toString(),
        longitude: lng.toString(),
      });
    }
  };

  const handleCoordChange = (field: "latitude" | "longitude", value: string) => {
    setCustomCoordinates((prev) => ({ ...prev, [field]: value }));
    const numVal = parseFloat(value);
    if (!isNaN(numVal)) {
      setCoordinates((prev) => ({
        ...prev,
        [field === "latitude" ? "lat" : "lng"]: numVal,
      }));
    }
  };

  const onSubmit = async (data: OnboardingValues) => {
    if (!selectedProvince || !selectedRegency || !selectedDistrict || !selectedVillage) {
      setRegionError("Administrative region must be complete.");
      toast.error("Administrative region is not complete.");
      setActiveTab("location");
      return;
    }
    setRegionError("");

    if (!user) return;

    setSubmitting(true);
    try {
      const pName = provinces.find((p) => p.code === selectedProvince)?.name || "";
      const rName = regencies.find((r) => r.code === selectedRegency)?.name || "";
      const dName = districts.find((d) => d.code === selectedDistrict)?.name || "";
      const vName = villages.find((v) => v.code === selectedVillage)?.name || "";

      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        "profile.businessName": data.businessName || "",
        "profile.merchantType": data.merchantType,
        "profile.phoneNumber": data.phoneNumber,
        "profile.address": {
          provinceId: selectedProvince,
          provinceName: pName,
          regencyId: selectedRegency,
          regencyName: rName,
          districtId: selectedDistrict,
          districtName: dName,
          villageId: selectedVillage,
          villageName: vName,
          detailAddress: data.detailAddress,
        },
        "profile.locationNotes": data.locationNotes || "",
        "profile.coordinates": {
          latitude: parseFloat(customCoordinates.latitude),
          longitude: parseFloat(customCoordinates.longitude),
        },
        "profile.pickupHours": data.pickupHours,
        "profile.description": data.description || "",
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
    provinces,
    regencies,
    districts,
    villages,
    selectedProvince,
    selectedRegency,
    selectedDistrict,
    selectedVillage,
    setSelectedVillage,
    regionError,
    coordinates,
    customCoordinates,
    isDetectingLocation,
    register,
    handleSubmit,
    control,
    errors,
    handleProvinceChange,
    handleRegencyChange,
    handleDistrictChange,
    handleGetCurrentLocation,
    onMapClick,
    handleCoordChange,
    onSubmit
  };
}
