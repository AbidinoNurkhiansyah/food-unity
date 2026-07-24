import { type UseFormRegister, type FieldErrors } from "react-hook-form";
import { Store, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type OnboardingValues } from "../constants/schemas";

interface BusinessDetailsSectionProps {
  register: UseFormRegister<OnboardingValues>;
  errors: FieldErrors<OnboardingValues>;
}

export function BusinessDetailsSection({
  register,
  errors,
}: BusinessDetailsSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-bold text-lg text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
        <Store className="w-5 h-5 text-primary-500" /> Detail Usaha / Donor
      </h3>

      {/* Nama Usaha */}
      <div className="space-y-1">
        <Label
          htmlFor="businessName"
          className="text-xs font-bold text-gray-700"
        >
          Nama Usaha / Nama Donor{" "}
          <span className="text-gray-400 font-normal">(Optional)</span>
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
          <Label
            htmlFor="merchantType"
            className="text-xs font-bold text-gray-700"
          >
            Tipe Donor / Usaha <span className="text-red-500">*</span>
          </Label>
          <select
            id="merchantType"
            className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none transition-all"
            {...register("merchantType")}
          >
            <option value="">Pilih Tipe</option>
            <option value="Rumah Tangga / Personal">
              Rumah Tangga / Personal
            </option>
            <option value="Restoran / Kafe">Restoran / Kafe</option>
            <option value="Toko Roti / Bakery">Toko Roti / Bakery</option>
            <option value="Katering">Katering</option>
            <option value="Supermarket / Toko Kelontong">
              Supermarket / Toko Kelontong
            </option>
            <option value="Lainnya">Lainnya</option>
          </select>
          {errors.merchantType && (
            <p className="text-xs text-red-500 mt-0.5 font-medium pl-1">
              {errors.merchantType.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label
            htmlFor="phoneNumber"
            className="text-xs font-bold text-gray-700"
          >
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
            <p className="text-xs text-red-500 mt-0.5 font-medium pl-1">
              {errors.phoneNumber.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
