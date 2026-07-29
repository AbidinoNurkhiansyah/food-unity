import { useState } from "react";
import type { Product } from "../../types";
import { useProductForm } from "../../hooks/useProductForm";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

import { ImageUploader } from "./ImageUploader";
import { NameCategoryFields } from "./NameCategoryFields";
import { DescriptionField } from "./DescriptionField";
import { SaleTypeStatusFields } from "./SaleTypeStatusFields";
import { PriceFields } from "./PriceFields";
import { StockUnitWeightFields } from "./StockUnitWeightFields";

interface ProductFormProps {
  onSuccess?: () => void;
  initialData?: Product;
}

export function ProductForm({ onSuccess, initialData }: ProductFormProps) {
  const [now] = useState(() => Date.now());
  const {
    form,
    imagePreview,
    uploadError,
    isDonation,
    isSubmitting,
    onSubmit,
    handleImageChange,
  } = useProductForm(onSuccess, initialData);

  const {
    register,
    control,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const currentCategory = watch("category");
  const currentUnit = watch("unit");
  const currentStatus = watch("status");

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-[180px_1fr_1fr] gap-5 items-start">
        {/* Col 1: Image Upload */}
        <ImageUploader
          imagePreview={imagePreview}
          onImageChange={handleImageChange}
        />

        {/* Col 2 + 3: Form Fields */}
        <div className="col-span-2 space-y-3">
          <NameCategoryFields
            register={register}
            setValue={setValue}
            currentCategory={currentCategory}
            errors={errors}
          />
          <DescriptionField register={register} errors={errors} />
          <SaleTypeStatusFields
            setValue={setValue}
            isDonation={isDonation}
            currentStatus={currentStatus}
          />
          <PriceFields
            control={control}
            errors={errors}
            isDonation={isDonation}
          />
          <StockUnitWeightFields
            register={register}
            setValue={setValue}
            errors={errors}
            currentUnit={currentUnit}
            currentStatus={currentStatus}
            now={now}
          />
        </div>
      </div>

      {uploadError && (
        <div className="text-xs text-red-500 font-semibold flex items-center gap-2 bg-red-50 border border-red-200/60 p-3 rounded-xl">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {uploadError}
        </div>
      )}

      <Button
        type="submit"
        className="w-full font-bold py-5 rounded-xl text-sm cursor-pointer"
        disabled={isSubmitting}
      >
        {isSubmitting
          ? "Saving..."
          : initialData
          ? "Update Package"
          : "Publish Surplus Package"}
      </Button>
    </form>
  );
}
