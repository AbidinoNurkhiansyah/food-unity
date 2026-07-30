import { useJsApiLoader } from "@react-google-maps/api";
import { Store, MapPin, Clock, Loader2, Save, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BusinessDetailsSection } from "@/features/merchant-onboarding/components/BusinessDetailsSection";
import { AdminRegionSection } from "@/features/merchant-onboarding/components/AdminRegionSection";
import { GPSLocationSection } from "@/features/merchant-onboarding/components/GPSLocationSection";
import { MerchantOperationsSection } from "@/features/merchant-onboarding/components/MerchantOperationsSection";
import { Button } from "@/components/ui/button";
import { useMerchantProfileForm } from "../hooks/useMerchantProfileForm";

export function MerchantProfileForm() {
  const navigate = useNavigate();
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey:
      import.meta.env.VITE_GOOGLE_MAPS_API_KEY ||
      import.meta.env.VITE_FIREBASE_API_KEY ||
      "",
  });

  const {
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
    onSubmit,
  } = useMerchantProfileForm();

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
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Overview
          </button>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            Merchant Profile
          </h1>
          <p className="mt-1.5 text-sm text-slate-500 font-medium">
            Manage store identity details, delivery coverage area, and GPS
            coordinates.
          </p>
        </div>
      </header>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center min-h-[300px]">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin mb-2" />
          <p className="text-sm font-semibold text-slate-500">
            Loading profile data...
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Custom Tab Navigation Buttons */}
          <div className="flex overflow-x-auto hide-scrollbar gap-1 pb-1 border-b border-slate-100">
            <button
              type="button"
              onClick={() => setActiveTab("info")}
              className={`cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-t-xl font-semibold text-xs uppercase tracking-wider transition-all relative ${
                activeTab === "info"
                  ? "text-primary-600 bg-primary-50/50"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Store className="w-4 h-4" />
              Store Information
              {activeTab === "info" && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 rounded-t-full" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("location")}
              className={`cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-t-xl font-semibold text-xs uppercase tracking-wider transition-all relative ${
                activeTab === "location"
                  ? "text-primary-600 bg-primary-50/50"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }`}
            >
              <MapPin className="w-4 h-4" />
              Address & Location
              {activeTab === "location" && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 rounded-t-full" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("hours")}
              className={`cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-t-xl font-semibold text-xs uppercase tracking-wider transition-all relative ${
                activeTab === "hours"
                  ? "text-primary-600 bg-primary-50/50"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Clock className="w-4 h-4" />
              Pickup Hours
              {activeTab === "hours" && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 rounded-t-full" />
              )}
            </button>
          </div>

          {/* Tab Contents */}
          <div className="min-h-[350px]">
            {activeTab === "info" && (
              <div className="space-y-4">
                <BusinessDetailsSection
                  register={register}
                  errors={errors}
                  showTitle={false}
                />
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
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="rounded-xl gap-2 cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
