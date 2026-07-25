import { Compass } from "lucide-react";
import { type UseFormRegister, type FieldErrors } from "react-hook-form";
import { type OnboardingValues } from "../constants/schemas";
import { type RegionItem } from "../hooks/useMerchantOnboardingForm";
import { AdminRegionSection } from "./AdminRegionSection";

interface MerchantStepTwoProps {
  register: UseFormRegister<OnboardingValues>;
  errors: FieldErrors<OnboardingValues>;
  provinces: RegionItem[];
  regencies: RegionItem[];
  districts: RegionItem[];
  villages: RegionItem[];
  selectedProvince: string;
  handleProvinceChange: (provinceId: string) => void;
  selectedRegency: string;
  handleRegencyChange: (regencyId: string) => void;
  selectedDistrict: string;
  handleDistrictChange: (districtId: string) => void;
  selectedVillage: string;
  setSelectedVillage: (villageId: string) => void;
  regionError: string;
}

export function MerchantStepTwo({
  register,
  errors,
  provinces,
  regencies,
  districts,
  villages,
  selectedProvince,
  handleProvinceChange,
  selectedRegency,
  handleRegencyChange,
  selectedDistrict,
  handleDistrictChange,
  selectedVillage,
  setSelectedVillage,
  regionError,
}: MerchantStepTwoProps) {
  return (
    <>
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-primary-600 font-extrabold text-xs uppercase tracking-wider">
          <Compass className="w-3.5 h-3.5 animate-pulse" /> Location
          Configuration
        </div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
          Administrative Region
        </h2>
        <p className="text-sm text-slate-500 font-medium max-w-xl">
          Determine your merchant's operational area. This selection will filter
          search results for nearby consumers.
        </p>
      </div>

      <div className="space-y-4">
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
      </div>
    </>
  );
}
