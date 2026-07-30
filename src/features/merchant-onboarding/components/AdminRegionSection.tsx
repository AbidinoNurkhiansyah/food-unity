import { type UseFormRegister, type FieldErrors } from "react-hook-form";
import { Compass } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { type OnboardingValues } from "../constants/schemas";
import { type RegionItem } from "../hooks/useMerchantOnboardingForm";
import { RegionCombobox } from "./RegionCombobox";

interface AdminRegionSectionProps {
  register: UseFormRegister<OnboardingValues>;
  errors: FieldErrors<OnboardingValues>;
  provinces: RegionItem[];
  regencies: RegionItem[];
  districts: RegionItem[];
  villages: RegionItem[];
  selectedProvince: string;
  handleProvinceChange: (val: string) => void;
  selectedRegency: string;
  handleRegencyChange: (val: string) => void;
  selectedDistrict: string;
  handleDistrictChange: (val: string) => void;
  selectedVillage: string;
  setSelectedVillage: (val: string) => void;
  regionError: string;
  showTitle?: boolean;
}

export function AdminRegionSection({
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
  showTitle = true,
}: AdminRegionSectionProps) {
  return (
    <div className="space-y-4">
      {showTitle && (
        <h3 className="font-bold text-lg text-gray-900 border-b border-gray-100 pt-2 pb-2 flex items-center gap-2">
          <Compass className="w-5 h-5 text-primary-500" /> Administrative Region
        </h3>
      )}

      <div className="grid grid-cols-2 gap-4">
        {/* Provinsi */}
        <div className="space-y-1">
          <Label htmlFor="province-combobox" className="text-xs font-bold text-gray-700">
            Province <span className="text-red-500">*</span>
          </Label>
          <RegionCombobox
            id="province-combobox"
            items={provinces}
            value={selectedProvince}
            onChange={handleProvinceChange}
            placeholder="Select Province"
            searchPlaceholder="Search province..."
          />
        </div>

        {/* Kabupaten / Kota */}
        <div className="space-y-1">
          <Label htmlFor="regency-combobox" className="text-xs font-bold text-gray-700">
            City / Regency <span className="text-red-500">*</span>
          </Label>
          <RegionCombobox
            id="regency-combobox"
            items={regencies}
            value={selectedRegency}
            onChange={handleRegencyChange}
            placeholder="Select City/Regency"
            searchPlaceholder="Search city/regency..."
            disabled={!selectedProvince}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Kecamatan */}
        <div className="space-y-1">
          <Label htmlFor="district-combobox" className="text-xs font-bold text-gray-700">
            District <span className="text-red-500">*</span>
          </Label>
          <RegionCombobox
            id="district-combobox"
            items={districts}
            value={selectedDistrict}
            onChange={handleDistrictChange}
            placeholder="Select District"
            searchPlaceholder="Search district..."
            disabled={!selectedRegency}
          />
        </div>

        {/* Desa / Kelurahan */}
        <div className="space-y-1">
          <Label htmlFor="village-combobox" className="text-xs font-bold text-gray-700">
            Village <span className="text-red-500">*</span>
          </Label>
          <RegionCombobox
            id="village-combobox"
            items={villages}
            value={selectedVillage}
            onChange={setSelectedVillage}
            placeholder="Select Village"
            searchPlaceholder="Search village..."
            disabled={!selectedDistrict}
          />
        </div>
      </div>

      {regionError && (
        <p className="text-xs text-red-500 font-medium pl-1">{regionError}</p>
      )}

      {/* Alamat Detail */}
      <div className="space-y-1">
        <Label htmlFor="detailAddress" className="text-xs font-bold text-gray-700">
          Full Address <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="detailAddress"
          placeholder="Enter street name, store/house number, RT/RW clearly..."
          className="min-h-16 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white text-sm"
          {...register("detailAddress")}
        />
        {errors.detailAddress && (
          <p className="text-xs text-red-500 mt-0.5 font-medium pl-1">
            {errors.detailAddress.message}
          </p>
        )}
      </div>

      {/* Catatan Patokan */}
      <div className="space-y-1">
        <Label htmlFor="locationNotes" className="text-xs font-bold text-gray-700">
          Location Notes{" "}
          <span className="text-gray-400 font-normal">(Optional)</span>
        </Label>
        <Input
          id="locationNotes"
          placeholder="Example: Next to Alfamart, Black Fence"
          className="rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white text-sm"
          {...register("locationNotes")}
        />
      </div>
    </div>
  );
}
