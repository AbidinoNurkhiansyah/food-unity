import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { db } from "@/config/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useAuthStore } from "@/features/auth";
import { 
  MapPin, 
  Store, 
  Phone, 
  Clock, 
  Compass, 
  Loader2, 
  Building,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

// Validasi Form menggunakan Zod
const onboardingSchema = z.object({
  businessName: z.string().optional(),
  merchantType: z.string().min(1, "Silakan pilih tipe donor/merchant Anda."),
  phoneNumber: z.string()
    .min(8, "Nomor kontak minimal terdiri dari 8 digit.")
    .max(15, "Nomor kontak maksimal terdiri dari 15 digit.")
    .regex(/^[0-9+]+$/, "Format nomor kontak hanya boleh angka dan +"),
  detailAddress: z.string().min(10, "Alamat detail minimal 10 karakter (masukkan nama jalan, RT/RW, no rumah)."),
  locationNotes: z.string().optional(),
  pickupHours: z.string().min(1, "Silakan isi jam pengambilan makanan surplus."),
  description: z.string().optional(),
});

type OnboardingValues = z.infer<typeof onboardingSchema>;

interface RegionItem {
  code: string;
  name: string;
}

const mapContainerStyle = {
  width: "100%",
  height: "350px",
  borderRadius: "12px",
};

// Default center di Jakarta
const defaultCenter = {
  lat: -6.200000,
  lng: 106.816666,
};

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export function MerchantOnboardingPage() {
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

  // Load Google Maps API Script
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || import.meta.env.VITE_FIREBASE_API_KEY || "",
  });

  const {
    register,
    handleSubmit,
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
        console.error("Gagal mengambil data provinsi:", err);
        toast.error("Gagal memuat daftar wilayah. Silakan segarkan halaman.");
      });
  }, []);

  // Fetch Kabupaten/Kota saat Provinsi berubah
  useEffect(() => {
    if (!selectedProvince) {
      setRegencies([]);
      setSelectedRegency("");
      return;
    }
    fetch(`${BACKEND_URL}/api/location/regencies/${selectedProvince}`)
      .then((res) => res.json())
      .then((data) => setRegencies(data.data || []))
      .catch((err) => console.error("Gagal mengambil data kabupaten/kota:", err));
  }, [selectedProvince]);

  // Fetch Kecamatan saat Kabupaten/Kota berubah
  useEffect(() => {
    if (!selectedRegency) {
      setDistricts([]);
      setSelectedDistrict("");
      return;
    }
    fetch(`${BACKEND_URL}/api/location/districts/${selectedRegency}`)
      .then((res) => res.json())
      .then((data) => setDistricts(data.data || []))
      .catch((err) => console.error("Gagal mengambil data kecamatan:", err));
  }, [selectedRegency]);

  // Fetch Kelurahan/Desa saat Kecamatan berubah
  useEffect(() => {
    if (!selectedDistrict) {
      setVillages([]);
      setSelectedVillage("");
      return;
    }
    fetch(`${BACKEND_URL}/api/location/villages/${selectedDistrict}`)
      .then((res) => res.json())
      .then((data) => setVillages(data.data || []))
      .catch((err) => console.error("Gagal mengambil data desa/kelurahan:", err));
  }, [selectedDistrict]);

  // Mengambil Koordinat dari GPS Browser
  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoordinates({ lat: latitude, lng: longitude });
          setCustomCoordinates({
            latitude: latitude.toString(),
            longitude: longitude.toString(),
          });
          toast.success("Berhasil mendeteksi lokasi GPS Anda!");
        },
        (error) => {
          console.error("Geolocation error:", error);
          toast.error("Gagal mendapatkan lokasi. Pastikan izin lokasi aktif.");
        },
        { enableHighAccuracy: true }
      );
    } else {
      toast.error("Browser Anda tidak mendukung fitur deteksi lokasi.");
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

  // Submit Data
  const onSubmit = async (data: OnboardingValues) => {
    // Validasi wilayah administratif
    if (!selectedProvince || !selectedRegency || !selectedDistrict || !selectedVillage) {
      setRegionError("Harap pilih lokasi provinsi, kabupaten/kota, kecamatan, dan kelurahan.");
      toast.error("Wilayah administratif belum lengkap.");
      return;
    }
    setRegionError("");

    if (!user) {
      toast.error("Pengguna tidak terautentikasi.");
      return;
    }

    setSubmitting(true);
    try {
      const pName = provinces.find((p) => p.code === selectedProvince)?.name || "";
      const rName = regencies.find((r) => r.code === selectedRegency)?.name || "";
      const dName = districts.find((d) => d.code === selectedDistrict)?.name || "";
      const vName = villages.find((v) => v.code === selectedVillage)?.name || "";

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

      toast.success("Profil merchant berhasil disimpan!");
      
      // Update global state & redirect
      setUser(user, role, true);
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      console.error("Gagal mengupdate profil:", err);
      toast.error(err.message || "Gagal menyimpan data profil.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-4 flex justify-center items-center">
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary-100/40 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-palette-100/30 rounded-full blur-3xl pointer-events-none"></div>

      <Card className="w-full max-w-5xl shadow-xl rounded-2xl border-gray-100 bg-white/95 backdrop-blur z-10 overflow-hidden">
        <div className="bg-primary-500 py-6 px-6 md:px-8 text-white relative">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-white animate-pulse" />
            <div>
              <CardTitle className="text-2xl font-black tracking-tight">Onboarding Merchant</CardTitle>
              <CardDescription className="text-white/80 font-medium text-sm mt-0.5">
                Lengkapi detail profil Anda untuk mulai berbagi makanan surplus di FoodUnity.
              </CardDescription>
            </div>
          </div>
        </div>

        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* KOLOM KIRI: Data Profil & Wilayah */}
              <div className="space-y-4">
                <h3 className="font-bold text-lg text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
                  <Store className="w-5 h-5 text-primary-500" /> Detail Usaha / Donor
                </h3>

                {/* Nama Usaha */}
                <div className="space-y-1">
                  <Label htmlFor="businessName" className="text-xs font-bold text-gray-700">
                    Nama Usaha / Nama Donor <span className="text-gray-400 font-normal">(Optional)</span>
                  </Label>
                  <Input
                    id="businessName"
                    placeholder="Contoh: Bakery Barokah / Ibu Aminah"
                    className="rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white text-sm"
                    {...register("businessName")}
                  />
                  <p className="text-[10px] text-gray-400 pl-1 mt-0.5">
                    Kosongkan jika ingin menggunakan nama lengkap profil utama Anda.
                  </p>
                </div>

                {/* Grid Tipe Merchant & WhatsApp */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="merchantType" className="text-xs font-bold text-gray-700">
                      Tipe Donor / Usaha <span className="text-red-500">*</span>
                    </Label>
                    <select
                      id="merchantType"
                      className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none transition-all"
                      {...register("merchantType")}
                    >
                      <option value="">Pilih Tipe</option>
                      <option value="Rumah Tangga / Personal">Rumah Tangga / Personal</option>
                      <option value="Restoran / Kafe">Restoran / Kafe</option>
                      <option value="Toko Roti / Bakery">Toko Roti / Bakery</option>
                      <option value="Katering">Katering</option>
                      <option value="Supermarket / Toko Kelontong">Supermarket / Toko Kelontong</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                    {errors.merchantType && (
                      <p className="text-xs text-red-500 mt-0.5 font-medium pl-1">{errors.merchantType.message}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="phoneNumber" className="text-xs font-bold text-gray-700">
                      Nomor WhatsApp <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-4 w-4 text-gray-400" />
                      </div>
                      <Input
                        id="phoneNumber"
                        placeholder="Contoh: 08123456789"
                        className="pl-9 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white text-sm"
                        {...register("phoneNumber")}
                      />
                    </div>
                    {errors.phoneNumber && (
                      <p className="text-xs text-red-500 mt-0.5 font-medium pl-1">{errors.phoneNumber.message}</p>
                    )}
                  </div>
                </div>

                {/* Pilih Wilayah Administratif */}
                <h3 className="font-bold text-lg text-gray-900 border-b border-gray-100 pt-2 pb-2 flex items-center gap-2">
                  <Compass className="w-5 h-5 text-primary-500" /> Wilayah Administratif
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  {/* Provinsi */}
                  <div className="space-y-1">
                    <Label className="text-xs font-bold text-gray-700">Provinsi <span className="text-red-500">*</span></Label>
                    <select
                      className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm focus:bg-white focus:outline-none transition-all"
                      value={selectedProvince}
                      onChange={(e) => setSelectedProvince(e.target.value)}
                    >
                      <option value="">Pilih Provinsi</option>
                      {provinces.map((p) => (
                        <option key={p.code} value={p.code}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Kabupaten / Kota */}
                  <div className="space-y-1">
                    <Label className="text-xs font-bold text-gray-700">Kota / Kabupaten <span className="text-red-500">*</span></Label>
                    <select
                      className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm focus:bg-white focus:outline-none transition-all"
                      value={selectedRegency}
                      onChange={(e) => setSelectedRegency(e.target.value)}
                      disabled={!selectedProvince}
                    >
                      <option value="">Pilih Kota/Kab</option>
                      {regencies.map((r) => (
                        <option key={r.code} value={r.code}>{r.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Kecamatan */}
                  <div className="space-y-1">
                    <Label className="text-xs font-bold text-gray-700">Kecamatan <span className="text-red-500">*</span></Label>
                    <select
                      className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm focus:bg-white focus:outline-none transition-all"
                      value={selectedDistrict}
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                      disabled={!selectedRegency}
                    >
                      <option value="">Pilih Kecamatan</option>
                      {districts.map((d) => (
                        <option key={d.code} value={d.code}>{d.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Desa / Kelurahan */}
                  <div className="space-y-1">
                    <Label className="text-xs font-bold text-gray-700">Kelurahan / Desa <span className="text-red-500">*</span></Label>
                    <select
                      className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm focus:bg-white focus:outline-none transition-all"
                      value={selectedVillage}
                      onChange={(e) => setSelectedVillage(e.target.value)}
                      disabled={!selectedDistrict}
                    >
                      <option value="">Pilih Kelurahan/Desa</option>
                      {villages.map((v) => (
                        <option key={v.code} value={v.code}>{v.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                {regionError && (
                  <p className="text-xs text-red-500 font-medium pl-1">{regionError}</p>
                )}

                {/* Alamat Detail */}
                <div className="space-y-1">
                  <Label htmlFor="detailAddress" className="text-xs font-bold text-gray-700">
                    Alamat Lengkap <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="detailAddress"
                    placeholder="Masukkan nama jalan, nomor toko/rumah, RT/RW dengan jelas..."
                    className="min-h-16 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white text-sm"
                    {...register("detailAddress")}
                  />
                  {errors.detailAddress && (
                    <p className="text-xs text-red-500 mt-0.5 font-medium pl-1">{errors.detailAddress.message}</p>
                  )}
                </div>

                {/* Catatan Patokan */}
                <div className="space-y-1">
                  <Label htmlFor="locationNotes" className="text-xs font-bold text-gray-700">
                    Catatan Patokan Lokasi <span className="text-gray-400 font-normal">(Optional)</span>
                  </Label>
                  <Input
                    id="locationNotes"
                    placeholder="Contoh: Samping Alfamart, Pagar Hitam"
                    className="rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white text-sm"
                    {...register("locationNotes")}
                  />
                </div>
              </div>

              {/* KOLOM KANAN: Maps Pinpoint & Share Location */}
              <div className="space-y-4">
                <h3 className="font-bold text-lg text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary-500" /> Lokasi GPS & Navigasi
                </h3>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 cursor-pointer border border-primary-500 text-primary-600 font-bold hover:bg-primary-50 rounded-xl"
                    onClick={handleGetCurrentLocation}
                  >
                    <Compass className="w-4 h-4 mr-2 text-primary-500 animate-spin" style={{ animationDuration: '6s' }} /> Deteksi GPS Saya (Share Location)
                  </Button>
                </div>

                {/* Google Maps / Fallback Container */}
                <div className="relative">
                  {isLoaded && !loadError ? (
                    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                      <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        center={coordinates}
                        zoom={15}
                        onClick={onMapClick}
                      >
                        <Marker position={coordinates} />
                      </GoogleMap>
                    </div>
                  ) : (
                    <div className="bg-gray-100 rounded-xl border border-gray-200 h-[350px] flex flex-col items-center justify-center p-4 text-center">
                      <AlertCircle className="w-10 h-10 text-gray-400 mb-2 animate-bounce" />
                      <p className="text-sm font-semibold text-gray-700">Peta Interaktif Dimuat Statis</p>
                      <p className="text-xs text-gray-400 mt-1 max-w-sm">
                        Layanan peta menggunakan koordinat GPS perangkat. Anda dapat memverifikasi koordinat Latitude & Longitude secara manual di bawah.
                      </p>
                    </div>
                  )}
                  <p className="text-[10px] text-gray-400 text-center mt-1">
                    * Klik/sentuh peta di atas untuk menggeser penanda lokasi pengambilan secara presisi.
                  </p>
                </div>

                {/* Input Koordinat Lat & Lng */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="latitude" className="text-xs font-bold text-gray-700">Latitude</Label>
                    <Input
                      id="latitude"
                      type="text"
                      className="rounded-xl border-gray-200 bg-gray-50 focus:bg-white text-sm"
                      value={customCoordinates.latitude}
                      onChange={(e) => handleCoordChange("latitude", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="longitude" className="text-xs font-bold text-gray-700">Longitude</Label>
                    <Input
                      id="longitude"
                      type="text"
                      className="rounded-xl border-gray-200 bg-gray-50 focus:bg-white text-sm"
                      value={customCoordinates.longitude}
                      onChange={(e) => handleCoordChange("longitude", e.target.value)}
                    />
                  </div>
                </div>

                {/* Jam Pengambilan */}
                <div className="space-y-1">
                  <Label htmlFor="pickupHours" className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-gray-400" /> Jam Pengambilan Makanan Surplus <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="pickupHours"
                    placeholder="Contoh: Setiap hari Pukul 18:00 - 20:00"
                    className="rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white text-sm"
                    {...register("pickupHours")}
                  />
                  {errors.pickupHours && (
                    <p className="text-xs text-red-500 mt-0.5 font-medium pl-1">{errors.pickupHours.message}</p>
                  )}
                </div>

                {/* Deskripsi Toko / Donor */}
                <div className="space-y-1">
                  <Label htmlFor="description" className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-gray-400" /> Deskripsi Toko / Donor <span className="text-gray-400 font-normal">(Optional)</span>
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Tulis pesan ramah atau penjelasan singkat mengenai merchant Anda..."
                    className="min-h-16 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white text-sm"
                    {...register("description")}
                  />
                </div>
              </div>
            </div>

            {/* BUTTON SUBMIT */}
            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <Button
                type="submit"
                disabled={submitting}
                className="w-full md:w-auto px-8 h-12 bg-primary-500 hover:bg-primary-600 text-white font-bold text-md rounded-xl cursor-pointer shadow-lg shadow-primary-500/20 transition-all flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>Simpan & Selesai</>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
