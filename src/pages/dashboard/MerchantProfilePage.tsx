import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useJsApiLoader } from "@react-google-maps/api";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Store, MapPin, Clock, Loader2, Save, ArrowLeft } from "lucide-react";
import { db } from "@/config/firebase";
import { useAuthStore } from "@/features/auth";
import { onboardingSchema, type OnboardingValues } from "@/features/merchant-onboarding/constants/schemas";
import { BusinessDetailsSection } from "@/features/merchant-onboarding/components/BusinessDetailsSection";
import { AdminRegionSection } from "@/features/merchant-onboarding/components/AdminRegionSection";
import { GPSLocationSection } from "@/features/merchant-onboarding/components/GPSLocationSection";
import { MerchantOperationsSection } from "@/features/merchant-onboarding/components/MerchantOperationsSection";
import { type RegionItem, defaultCenter } from "@/features/merchant-onboarding/hooks/useMerchantOnboardingForm";
import { Button } from "@/components/ui/button";

const BACKEND_URL = import.meta.env.VITE_API_URL;

export function MerchantProfilePage() {
  const { user, role, setUser } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"info" | "location" | "hours">("info");

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

  // State GPS
  const [coordinates, setCoordinates] = useState(defaultCenter);
  const [customCoordinates, setCustomCoordinates] = useState({
    latitude: defaultCenter.lat.toString(),
    longitude: defaultCenter.lng.toString(),
  });
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  // Load Google Maps
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

  // Load existing profile details
  useEffect(() => {
    if (!user?.uid) return;

    const fetchProfileData = async () => {
      setLoading(true);
      try {
        // Fetch Provinces first
        const provRes = await fetch(`${BACKEND_URL}/api/location/provinces`);
        const provData = await provRes.json();
        const provincesList = provData.data || [];
        setProvinces(provincesList);

        // Fetch User profile doc
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
        console.error("Gagal mengambil data profil merchant:", err);
        toast.error("Gagal memuat profil merchant.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user?.uid, reset]);

  // Dropdown manual change handlers
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

  // GPS Map Handlers
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
          toast.success("Berhasil mendeteksi lokasi GPS Anda!");
          setIsDetectingLocation(false);
        },
        (error) => {
          console.error("Geolocation error:", error);
          toast.error("Gagal mendapatkan lokasi. Pastikan izin lokasi aktif.");
          setIsDetectingLocation(false);
        },
        { enableHighAccuracy: true }
      );
    } else {
      toast.error("Browser tidak mendukung deteksi lokasi.");
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

  // Form Submit
  const onSubmit = async (data: OnboardingValues) => {
    if (!selectedProvince || !selectedRegency || !selectedDistrict || !selectedVillage) {
      setRegionError("Wilayah administratif harus lengkap.");
      toast.error("Wilayah administratif belum lengkap.");
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

      toast.success("Profil toko berhasil diperbarui!");
      setUser(user, role, true); // Refresh state
    } catch (err) {
      console.error("Gagal memperbarui profil:", err);
      toast.error("Gagal menyimpan pembaruan profil.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full font-sans">
      {/* Header */}
      <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-3 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Ringkasan
          </button>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            Profil Mitra Toko
          </h1>
          <p className="mt-1.5 text-sm text-slate-500 font-medium">
            Kelola detail identitas toko, cakupan wilayah pengantaran, dan koordinat GPS.
          </p>
        </div>
      </header>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center min-h-[300px]">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin mb-2" />
          <p className="text-sm font-semibold text-slate-500">Memuat data profil...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Custom Tab Navigation Buttons */}
          <div className="flex overflow-x-auto hide-scrollbar gap-1 pb-1 border-b border-slate-100">
            <button
              type="button"
              onClick={() => setActiveTab("info")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl font-semibold text-xs uppercase tracking-wider transition-all relative ${
                activeTab === "info"
                  ? "text-primary-600 bg-primary-50/50"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Store className="w-4 h-4" />
              Informasi Toko
              {activeTab === "info" && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 rounded-t-full" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("location")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl font-semibold text-xs uppercase tracking-wider transition-all relative ${
                activeTab === "location"
                  ? "text-primary-600 bg-primary-50/50"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }`}
            >
              <MapPin className="w-4 h-4" />
              Alamat & Lokasi
              {activeTab === "location" && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 rounded-t-full" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("hours")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl font-semibold text-xs uppercase tracking-wider transition-all relative ${
                activeTab === "hours"
                  ? "text-primary-600 bg-primary-50/50"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Clock className="w-4 h-4" />
              Jam Pengambilan
              {activeTab === "hours" && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 rounded-t-full" />
              )}
            </button>
          </div>

          {/* Tab Contents */}
          <div className="min-h-[350px]">
            {activeTab === "info" && (
              <div className="space-y-4">
                <BusinessDetailsSection register={register} errors={errors} showTitle={false} />
              </div>
            )}

            {activeTab === "location" && (
              <div className="space-y-6">
                <AdminRegionSection
                  register={register}
                  errors={errors}
                  provinces={provinces}
                  regencies={regencies}
                  districts={districts}
                  villages={villages}
                  selectedProvince={selectedProvince}
                  handleProvinceChange={handleProvinceChange}
                  selectedRegency={selectedRegency}
                  handleRegencyChange={handleRegencyChange}
                  selectedDistrict={selectedDistrict}
                  handleDistrictChange={handleDistrictChange}
                  selectedVillage={selectedVillage}
                  setSelectedVillage={setSelectedVillage}
                  regionError={regionError}
                  showTitle={false}
                />
                <GPSLocationSection
                  isLoaded={isLoaded}
                  loadError={loadError}
                  coordinates={coordinates}
                  customCoordinates={customCoordinates}
                  onMapClick={onMapClick}
                  handleGetCurrentLocation={handleGetCurrentLocation}
                  isDetectingLocation={isDetectingLocation}
                  handleCoordChange={handleCoordChange}
                  showTitle={false}
                />
              </div>
            )}

            {activeTab === "hours" && (
              <div className="space-y-4">
                <MerchantOperationsSection control={control} />
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/dashboard")}
              disabled={submitting}
              className="rounded-xl cursor-pointer"
            >
              Batal
            </Button>
            <Button type="submit" disabled={submitting} className="rounded-xl gap-2 cursor-pointer">
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Simpan Perubahan
                </>
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
