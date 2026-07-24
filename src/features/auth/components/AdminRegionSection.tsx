import { type UseFormRegister, type FieldErrors } from "react-hook-form";
import { Compass } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { type OnboardingValues } from "../constants/schemas";
import { type RegionItem } from "../hooks/useMerchantOnboardingForm";

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
}: AdminRegionSectionProps) {
  return (
    <div className="space-y-4">
      {/* Pilih Wilayah Administratif */}
      <h3 className="font-bold text-lg text-gray-900 border-b border-gray-100 pt-2 pb-2 flex items-center gap-2">
        <Compass className="w-5 h-5 text-primary-500" /> Wilayah Administratif
      </h3>

      <div className="grid grid-cols-2 gap-4">
        {/* Provinsi */}
        <div className="space-y-1">
          <Label className="text-xs font-bold text-gray-700">
            Provinsi <span className="text-red-500">*</span>
          </Label>
          <select
            className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm focus:bg-white focus:outline-none transition-all"
            value={selectedProvince}
            onChange={(e) => handleProvinceChange(e.target.value)}
          >
            <option value="">Pilih Provinsi</option>
            {provinces.map((p) => (
              <option key={p.code} value={p.code}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Kabupaten / Kota */}
        <div className="space-y-1">
          <Label className="text-xs font-bold text-gray-700">
            Kota / Kabupaten <span className="text-red-500">*</span>
          </Label>
          <select
            className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm focus:bg-white focus:outline-none transition-all"
            value={selectedRegency}
            onChange={(e) => handleRegencyChange(e.target.value)}
            disabled={!selectedProvince}
          >
            <option value="">Pilih Kota/Kab</option>
            {regencies.map((r) => (
              <option key={r.code} value={r.code}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Kecamatan */}
        <div className="space-y-1">
          <Label className="text-xs font-bold text-gray-700">
            Kecamatan <span className="text-red-500">*</span>
          </Label>
          <select
            className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm focus:bg-white focus:outline-none transition-all"
            value={selectedDistrict}
            onChange={(e) => handleDistrictChange(e.target.value)}
            disabled={!selectedRegency}
          >
            <option value="">Pilih Kecamatan</option>
            {districts.map((d) => (
              <option key={d.code} value={d.code}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        {/* Desa / Kelurahan */}
        <div className="space-y-1">
          <Label className="text-xs font-bold text-gray-700">
            Kelurahan / Desa <span className="text-red-500">*</span>
          </Label>
          <select
            className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm focus:bg-white focus:outline-none transition-all"
            value={selectedVillage}
            onChange={(e) => setSelectedVillage(e.target.value)}
            disabled={!selectedDistrict}
          >
            <option value="">Pilih Kelurahan/Desa</option>
            {villages.map((v) => (
              <option key={v.code} value={v.code}>
                {v.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      {regionError && (
        <p className="text-xs text-red-500 font-medium pl-1">{regionError}</p>
      )}

      {/* Alamat Detail */}
      <div className="space-y-1">
        <Label
          htmlFor="detailAddress"
          className="text-xs font-bold text-gray-700"
        >
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
        <Label
          htmlFor="locationNotes"
          className="text-xs font-bold text-gray-700"
        >
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
