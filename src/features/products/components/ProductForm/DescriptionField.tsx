import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { ProductFormValues } from "../../types";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle } from "lucide-react";

interface DescriptionFieldProps {
  register: UseFormRegister<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
}

export function DescriptionField({ register, errors }: DescriptionFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label
        htmlFor="description"
        className="text-xs font-semibold text-slate-500"
      >
        Description
      </Label>
      <Textarea
        id="description"
        placeholder="Describe the product condition, reason for surplus, etc."
        rows={3}
        className="rounded-xl border-slate-200 bg-slate-50/60 focus:bg-white resize-none transition-all"
        {...register("description")}
      />
      {errors.description && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <AlertCircle className="w-3 h-3 shrink-0" />
          {errors.description.message}
        </p>
      )}
    </div>
  );
}
