import {
  Clock,
  Loader2,
  Building,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useMerchantOnboardingForm } from "../hooks/useMerchantOnboardingForm";
import { BusinessDetailsSection } from "./BusinessDetailsSection";
import { AdminRegionSection } from "./AdminRegionSection";
import { GPSLocationSection } from "./GPSLocationSection";

export function MerchantOnboardingForm() {
  const {
    register,
    handleSubmit,
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
    onMapClick,
    handleCoordChange,
    onSubmit,
  } = useMerchantOnboardingForm();

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-4 flex justify-center items-center">
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary-100/40 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-palette-100/30 rounded-full blur-3xl pointer-events-none"></div>

      <Card className="w-full max-w-5xl shadow-xl rounded-2xl border-gray-100 bg-white/95 backdrop-blur z-10 overflow-hidden">
        <div className="bg-primary-500 py-6 px-6 md:px-8 text-white relative">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-white animate-pulse" />
            <div>
              <CardTitle className="text-2xl font-black tracking-tight">
                Onboarding Merchant
              </CardTitle>
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
                <BusinessDetailsSection register={register} errors={errors} />

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
                />
              </div>

              {/* KOLOM KANAN: Maps Pinpoint & Share Location */}
              <div className="space-y-4">
                <GPSLocationSection
                  isLoaded={isLoaded}
                  loadError={loadError}
                  coordinates={coordinates}
                  customCoordinates={customCoordinates}
                  onMapClick={onMapClick}
                  handleGetCurrentLocation={handleGetCurrentLocation}
                  handleCoordChange={handleCoordChange}
                />

                {/* Jam Pengambilan */}
                <div className="space-y-1">
                  <Label
                    htmlFor="pickupHours"
                    className="text-xs font-bold text-gray-700 flex items-center gap-1.5"
                  >
                    <Clock className="w-4 h-4 text-gray-400" /> Jam Pengambilan
                    Makanan Surplus <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="pickupHours"
                    placeholder="Contoh: Setiap hari Pukul 18:00 - 20:00"
                    className="rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white text-sm"
                    {...register("pickupHours")}
                  />
                  {errors.pickupHours && (
                    <p className="text-xs text-red-500 mt-0.5 font-medium pl-1">
                      {errors.pickupHours.message}
                    </p>
                  )}
                </div>

                {/* Deskripsi Toko / Donor */}
                <div className="space-y-1">
                  <Label
                    htmlFor="description"
                    className="text-xs font-bold text-gray-700 flex items-center gap-1.5"
                  >
                    <Building className="w-4 h-4 text-gray-400" /> Deskripsi Toko / Donor{" "}
                    <span className="text-gray-400 font-normal">(Optional)</span>
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
