import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useJsApiLoader } from "@react-google-maps/api";
import { db } from "@/config/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useAuthStore } from "@/features/auth";
import { onboardingSchema, type OnboardingValues } from "../constants/schemas";

export interface RegionItem {
  code: string;
  name: string;
}

export const defaultCenter = {
  lat: -6.2,
  lng: 106.816666,
};

const BACKEND_URL = import.meta.env.VITE_API_URL;

export function useMerchantOnboardingForm() {
  const { user, role, setUser } = useAuthStore();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  // State Wilayah
  const [provinces, setProvinces] = useState<RegionItem[]>([]);
  const [regencies, setRegencies] = useState<RegionItem[]>([]);
  const [districts, setDistricts] = useState<RegionItem[]>([]);
  const [villages, setVillages] = useState<RegionItem[]>([]);

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedRegency, setSelectedRegency] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedVillage, setSelectedVillage] = useState("");
  const [regionError, setRegionError] = useState("");

  // State Koordinat GPS
  const [coordinates, setCoordinates] = useState(defaultCenter);
  const [customCoordinates, setCustomCoordinates] = useState({
    latitude: defaultCenter.lat.toString(),
    longitude: defaultCenter.lng.toString(),
  });
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  // Load Google Maps API Script
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey:
      import.meta.env.VITE_GOOGLE_MAPS_API_KEY ||
      import.meta.env.VITE_FIREBASE_API_KEY ||
      "",
  });

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

  // Fetch Provinsi Pertama kali
  useEffect(() => {
    fetch(`${BACKEND_URL}/api/location/provinces`)
      .then((res) => res.json())
      .then((data) => setProvinces(data.data || []))
      .catch((err) => {
        console.error("Failed to fetch province data:", err);
        toast.error("Failed to load region list. Please refresh the page.");
      });
  }, []);

  // Fetch Kabupaten/Kota saat Provinsi berubah
  useEffect(() => {
    if (!selectedProvince) return;
    fetch(`${BACKEND_URL}/api/location/regencies/${selectedProvince}`)
      .then((res) => res.json())
      .then((data) => setRegencies(data.data || []))
      .catch((err) =>
        console.error("Failed to fetch regency/city data:", err)
      );
  }, [selectedProvince]);

  // Fetch Kecamatan saat Kabupaten/Kota berubah
  useEffect(() => {
    if (!selectedRegency) return;
    fetch(`${BACKEND_URL}/api/location/districts/${selectedRegency}`)
      .then((res) => res.json())
      .then((data) => setDistricts(data.data || []))
      .catch((err) => console.error("Failed to fetch district data:", err));
  }, [selectedRegency]);

  // Fetch Kelurahan/Desa saat Kecamatan berubah
  useEffect(() => {
    if (!selectedDistrict) return;
    fetch(`${BACKEND_URL}/api/location/villages/${selectedDistrict}`)
      .then((res) => res.json())
      .then((data) => setVillages(data.data || []))
      .catch((err) =>
        console.error("Failed to fetch village data:", err)
      );
  }, [selectedDistrict]);

  // Handlers untuk perubahan wilayah administratif
  const handleProvinceChange = (provinceId: string) => {
    setSelectedProvince(provinceId);
    setSelectedRegency("");
    setRegencies([]);
    setSelectedDistrict("");
    setDistricts([]);
    setSelectedVillage("");
    setVillages([]);
  };

  const handleRegencyChange = (regencyId: string) => {
    setSelectedRegency(regencyId);
    setSelectedDistrict("");
    setDistricts([]);
    setSelectedVillage("");
    setVillages([]);
  };

  const handleDistrictChange = (districtId: string) => {
    setSelectedDistrict(districtId);
    setSelectedVillage("");
    setVillages([]);
  };

  // Mengambil Koordinat dari GPS Browser
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
      toast.error("Your browser does not support location detection.");
    }
  };

  // Saat peta di-klik untuk menggeser pin
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

  // Penanganan input koordinat manual
  const handleCoordChange = (
    field: "latitude" | "longitude",
    value: string
  ) => {
    setCustomCoordinates((prev) => ({ ...prev, [field]: value }));
    const numVal = parseFloat(value);
    if (!isNaN(numVal)) {
      setCoordinates((prev) => ({
        ...prev,
        [field === "latitude" ? "lat" : "lng"]: numVal,
      }));
    }
  };

  // Submit Data
  const onSubmit = async (data: OnboardingValues) => {
    // Validasi wilayah administratif
    if (
      !selectedProvince ||
      !selectedRegency ||
      !selectedDistrict ||
      !selectedVillage
    ) {
      setRegionError(
        "Please select the province, regency/city, district, and village location."
      );
      toast.error("Administrative region is incomplete.");
      return;
    }
    setRegionError("");

    if (!user) {
      toast.error("User is not authenticated.");
      return;
    }

    setSubmitting(true);
    try {
      const pName =
        provinces.find((p) => p.code === selectedProvince)?.name || "";
      const rName =
        regencies.find((r) => r.code === selectedRegency)?.name || "";
      const dName =
        districts.find((d) => d.code === selectedDistrict)?.name || "";
      const vName =
        villages.find((v) => v.code === selectedVillage)?.name || "";

      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        profile: {
          isCompleted: true,
          businessName: data.businessName || "",
          merchantType: data.merchantType,
          phoneNumber: data.phoneNumber,
          address: {
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
          locationNotes: data.locationNotes || "",
          coordinates: {
            latitude: parseFloat(customCoordinates.latitude),
            longitude: parseFloat(customCoordinates.longitude),
          },
          pickupHours: data.pickupHours,
          description: data.description || "",
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
    provinces,
    regencies,
    districts,
    villages,
    selectedProvince,
    selectedRegency,
    selectedDistrict,
    selectedVillage,
    setSelectedVillage,
    handleProvinceChange,
    handleRegencyChange,
    handleDistrictChange,
    regionError,
    coordinates,
    customCoordinates,
    isLoaded,
    loadError,
    handleGetCurrentLocation,
    isDetectingLocation,
    onMapClick,
    handleCoordChange,
    onSubmit,
  };
}

