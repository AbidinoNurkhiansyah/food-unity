import type { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";
import type { ProductFormValues } from "../../types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle } from "lucide-react";

interface NameCategoryFieldsProps {
  register: UseFormRegister<ProductFormValues>;
  setValue: UseFormSetValue<ProductFormValues>;
  currentCategory: string | undefined;
  errors: FieldErrors<ProductFormValues>;
}

export function NameCategoryFields({
  register,
  setValue,
  currentCategory,
  errors,
}: NameCategoryFieldsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {/* Package Name */}
      <div className="space-y-1.5">
        <Label htmlFor="title" className="text-xs font-semibold text-slate-500">
          Package Name
        </Label>
        <Input
          id="title"
          placeholder="e.g., Afternoon Sweet Bread Package"
          className="rounded-xl border-slate-200 bg-slate-50/60 focus:bg-white transition-all"
          {...register("title")}
        />
        {errors.title && (
          <p className="text-xs text-red-500 flex items-center gap-1">
            <AlertCircle className="w-3 h-3 shrink-0" />
            {errors.title.message}
          </p>
        )}
      </div>

      {/* Category */}
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-slate-500">Category</Label>
        <Select
          value={currentCategory || ""}
          onValueChange={(val) =>
            setValue("category", val, { shouldValidate: true })
          }
        >
          <SelectTrigger className="w-full rounded-xl border-slate-200 bg-slate-50/60 focus:bg-white transition-all">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="Dry Food">Dry Food</SelectItem>
            <SelectItem value="Wet Food">Wet Food</SelectItem>
            <SelectItem value="Vegetables">Vegetables</SelectItem>
            <SelectItem value="Fruits">Fruits</SelectItem>
            <SelectItem value="Beverages">Beverages</SelectItem>
            <SelectItem value="Meat & Seafood">Meat & Seafood</SelectItem>
            <SelectItem value="Bakery">Bakery</SelectItem>
            <SelectItem value="Fast Food">Fast Food</SelectItem>
          </SelectContent>
        </Select>
        {errors.category && (
          <p className="text-xs text-red-500 flex items-center gap-1">
            <AlertCircle className="w-3 h-3 shrink-0" />
            {errors.category.message}
          </p>
        )}
      </div>
    </div>
  );
}
