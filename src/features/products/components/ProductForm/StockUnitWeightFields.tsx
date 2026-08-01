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

interface StockUnitWeightFieldsProps {
  register: UseFormRegister<ProductFormValues>;
  setValue: UseFormSetValue<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
  currentUnit: string | undefined;
  currentStatus: string | undefined;
  now: number;
}

export function StockUnitWeightFields({
  register,
  setValue,
  errors,
  currentUnit,
  currentStatus,
  now,
}: StockUnitWeightFieldsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {/* Stock */}
      <div className="space-y-1.5">
        <Label htmlFor="stock" className="text-xs font-semibold text-slate-500">
          Stock
        </Label>
        <Input
          id="stock"
          type="number"
          min="0"
          className="rounded-xl border-slate-200 bg-slate-50/60 focus:bg-white transition-all"
          {...register("stock", {
            valueAsNumber: true,
            onChange: (e) => {
              const newStock = Number(e.target.value);
              if (newStock <= 0) {
                setValue("status", "sold_out", { shouldValidate: true });
              } else if (currentStatus === "sold_out") {
                setValue("status", "active", { shouldValidate: true });
              }
            },
          })}
        />
        {errors.stock && (
          <p className="text-xs text-red-500 flex items-center gap-1">
            <AlertCircle className="w-3 h-3 shrink-0" />
            {errors.stock.message}
          </p>
        )}
      </div>

      {/* Unit */}
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-slate-500">Unit</Label>
        <Select
          value={currentUnit || "porsi"}
          onValueChange={(val) =>
            setValue(
              "unit",
              val as "pcs" | "box" | "kg" | "gram" | "porsi",
              { shouldValidate: true }
            )
          }
        >
          <SelectTrigger className="rounded-xl border-slate-200 bg-slate-50/60 focus:bg-white transition-all">
            <SelectValue placeholder="Unit" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="porsi">Portion</SelectItem>
            <SelectItem value="pcs">Pcs</SelectItem>
            <SelectItem value="box">Box</SelectItem>
            <SelectItem value="kg">Kg</SelectItem>
            <SelectItem value="gram">Gram</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Weight */}
      <div className="space-y-1.5">
        <Label
          htmlFor="weightInGrams"
          className="text-xs font-semibold text-slate-500"
        >
          Weight (g)
        </Label>
        <div className="relative">
          <Input
            id="weightInGrams"
            type="number"
            min="1"
            className="pr-6 rounded-xl border-slate-200 bg-slate-50/60 focus:bg-white transition-all"
            {...register("weightInGrams", { valueAsNumber: true })}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 pointer-events-none">
            g
          </span>
        </div>
        {errors.weightInGrams && (
          <p className="text-xs text-red-500 flex items-center gap-1">
            <AlertCircle className="w-3 h-3 shrink-0" />
            {errors.weightInGrams.message}
          </p>
        )}
      </div>

      {/* Pickup Deadline */}
      <div className="space-y-1.5">
        <Label
          htmlFor="pickupDeadline"
          className="text-xs font-semibold text-slate-500"
        >
          Pickup Deadline
        </Label>
        <Input
          id="pickupDeadline"
          type="datetime-local"
          className="rounded-xl border-amber-200 bg-amber-50/30 focus:border-amber-400 focus:bg-white transition-all"
          {...register("pickupDeadline", {
            onChange: (e) => {
              const val = e.target.value;
              if (val) {
                const deadlineTime = new Date(val).getTime();
                if (!isNaN(deadlineTime) && deadlineTime <= now) {
                  setValue("status", "expired", { shouldValidate: true });
                } else if (currentStatus === "expired") {
                  setValue("status", "active", { shouldValidate: true });
                }
              }
            },
          })}
        />
        {errors.pickupDeadline && (
          <p className="text-xs text-red-500 flex items-center gap-1">
            <AlertCircle className="w-3 h-3 shrink-0" />
            {errors.pickupDeadline.message}
          </p>
        )}
      </div>
    </div>
  );
}
