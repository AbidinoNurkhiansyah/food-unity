import { type UseFormRegister, type FieldErrors } from "react-hook-form";
import {
  Store,
  Phone,
  Building,
  Upload,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { type OnboardingValues } from "../constants/schemas";

interface BusinessDetailsSectionProps {
  register: UseFormRegister<OnboardingValues>;
  errors: FieldErrors<OnboardingValues>;
  showTitle?: boolean;
  bannerImageUrl?: string;
  logoImageUrl?: string;
  isUploadingImages?: boolean;
  handleImageUpload?: (file: File, type: "banner" | "logo") => Promise<void>;
}

export function BusinessDetailsSection({
  register,
  errors,
  showTitle = true,
  bannerImageUrl,
  logoImageUrl,
  isUploadingImages,
  handleImageUpload,
}: BusinessDetailsSectionProps) {
  return (
    <div className="space-y-6">
      {handleImageUpload && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Logo Upload */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700">
                Bussiness Logo
              </label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center bg-slate-50 overflow-hidden shrink-0 relative group">
                  {isUploadingImages && (
                    <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
                      <Loader2 className="w-4 h-4 animate-spin text-primary-500" />
                    </div>
                  )}
                  {logoImageUrl ? (
                    <img
                      src={logoImageUrl}
                      alt="Logo"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Store className="w-6 h-6 text-slate-400" />
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="logo-upload"
                    onChange={(e) => {
                      if (e.target.files?.[0] && handleImageUpload) {
                        handleImageUpload(e.target.files[0], "logo");
                      }
                      e.target.value = "";
                    }}
                    disabled={isUploadingImages}
                  />
                  <label
                    htmlFor="logo-upload"
                    className={`flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50 w-max transition-colors ${
                      isUploadingImages
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" /> Upload Logo
                  </label>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Format: JPG, PNG. Rekomendasi 1:1.
                  </p>
                </div>
              </div>
            </div>

            {/* Banner Upload */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700">
                Foto Lokasi / Banner
              </label>
              <div className="flex items-start gap-4">
                <div className="w-32 h-16 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center bg-slate-50 overflow-hidden shrink-0 relative group">
                  {isUploadingImages && (
                    <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
                      <Loader2 className="w-4 h-4 animate-spin text-primary-500" />
                    </div>
                  )}
                  {bannerImageUrl ? (
                    <img
                      src={bannerImageUrl}
                      alt="Banner"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-slate-400" />
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="banner-upload"
                    onChange={(e) => {
                      if (e.target.files?.[0] && handleImageUpload) {
                        handleImageUpload(e.target.files[0], "banner");
                      }
                      e.target.value = "";
                    }}
                    disabled={isUploadingImages}
                  />
                  <label
                    htmlFor="banner-upload"
                    className={`flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50 w-max transition-colors ${
                      isUploadingImages
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" /> Upload Banner
                  </label>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Format: JPG, PNG. Rekomendasi 16:9.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {showTitle && (
          <h3 className="font-bold text-lg text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
            <Store className="w-5 h-5 text-primary-500" /> Business / Donor
            Details
          </h3>
        )}

        {/* Nama Usaha */}
        <div className="space-y-1">
          <Label
            htmlFor="businessName"
            className="text-xs font-bold text-gray-700"
          >
            Business Name / Donor Name{" "}
            <span className="text-gray-400 font-normal">(Optional)</span>
          </Label>
          <Input
            id="businessName"
            placeholder="Example: Barokah Bakery / Mrs. Aminah"
            className="rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white text-sm"
            {...register("businessName")}
          />
          <p className="text-[10px] text-gray-400 pl-1 mt-0.5">
            Leave blank if you want to use the full name of your main profile.
          </p>
        </div>

        {/* Grid Tipe Merchant & WhatsApp */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label
              htmlFor="merchantType"
              className="text-xs font-bold text-gray-700"
            >
              Donor / Business Type <span className="text-red-500">*</span>
            </Label>
            <select
              id="merchantType"
              className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-gray-50/50 text-sm focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:outline-none transition-all"
              {...register("merchantType")}
            >
              <option value="">Select Type</option>
              <option value="Rumah Tangga / Personal">
                Household / Personal
              </option>
              <option value="Restoran / Kafe">Restaurant / Cafe</option>
              <option value="Toko Roti / Bakery">Bakery</option>
              <option value="Katering">Catering</option>
              <option value="Supermarket / Toko Kelontong">
                Supermarket / Grocery Store
              </option>
              <option value="Lainnya">Other</option>
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
              WhatsApp Number <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                id="phoneNumber"
                placeholder="Example: 08123456789"
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

        {/* Deskripsi Usaha / Donor */}
        <div className="space-y-1">
          <Label
            htmlFor="description"
            className="text-xs font-bold text-gray-700 flex items-center gap-1.5"
          >
            <Building className="w-4 h-4 text-gray-400" /> Business / Donor
            Description{" "}
            <span className="text-gray-450 font-normal">(Optional)</span>
          </Label>
          <Textarea
            id="description"
            placeholder="Write a short description or friendly message about your business/donor profile..."
            className="min-h-[100px] rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white text-sm"
            {...register("description")}
          />
        </div>
      </div>
    </div>
  );
}
