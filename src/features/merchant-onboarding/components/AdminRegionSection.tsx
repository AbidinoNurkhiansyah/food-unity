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
          <Compass className="w-5 h-5 text-primary-500" /> Wilayah Administratif
        </h3>
      )}

      <div className="grid grid-cols-2 gap-4">
        {/* Provinsi */}
        <div className="space-y-1">
          <Label htmlFor="province-combobox" className="text-xs font-bold text-gray-700">
            Provinsi <span className="text-red-500">*</span>
          </Label>
          <RegionCombobox
            id="province-combobox"
            items={provinces}
            value={selectedProvince}
            onChange={handleProvinceChange}
            placeholder="Pilih Provinsi"
            searchPlaceholder="Cari provinsi..."
          />
        </div>

        {/* Kabupaten / Kota */}
        <div className="space-y-1">
          <Label htmlFor="regency-combobox" className="text-xs font-bold text-gray-700">
            Kota / Kabupaten <span className="text-red-500">*</span>
          </Label>
          <RegionCombobox
            id="regency-combobox"
            items={regencies}
            value={selectedRegency}
            onChange={handleRegencyChange}
            placeholder="Pilih Kota/Kab"
            searchPlaceholder="Cari kota/kabupaten..."
            disabled={!selectedProvince}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Kecamatan */}
        <div className="space-y-1">
          <Label htmlFor="district-combobox" className="text-xs font-bold text-gray-700">
            Kecamatan <span className="text-red-500">*</span>
          </Label>
          <RegionCombobox
            id="district-combobox"
            items={districts}
            value={selectedDistrict}
            onChange={handleDistrictChange}
            placeholder="Pilih Kecamatan"
            searchPlaceholder="Cari kecamatan..."
            disabled={!selectedRegency}
          />
        </div>

        {/* Desa / Kelurahan */}
        <div className="space-y-1">
          <Label htmlFor="village-combobox" className="text-xs font-bold text-gray-700">
            Kelurahan / Desa <span className="text-red-500">*</span>
          </Label>
          <RegionCombobox
            id="village-combobox"
            items={villages}
            value={selectedVillage}
            onChange={setSelectedVillage}
            placeholder="Pilih Kelurahan/Desa"
            searchPlaceholder="Cari kelurahan/desa..."
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
          Alamat Lengkap <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="detailAddress"
          placeholder="Masukkan nama jalan, nomor toko/rumah, RT/RW dengan jelas..."
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
          Catatan Patokan Lokasi{" "}
          <span className="text-gray-400 font-normal">(Optional)</span>
        </Label>
        <Input
          id="locationNotes"
          placeholder="Contoh: Samping Alfamart, Pagar Hitam"
          className="rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white text-sm"
          {...register("locationNotes")}
        />
      </div>
    </div>
  );
}
