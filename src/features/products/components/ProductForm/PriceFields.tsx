import { useCallback } from "react";
import { Controller } from "react-hook-form";
import type { Control, FieldErrors } from "react-hook-form";
import type { ProductFormValues } from "../../types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

// Format angka ke string dengan koma setiap 3 digit (e.g. 1000000 → "1,000,000")
function formatRupiah(value: number | ""): string {
  if (value === "" || value === 0) return "";
  return Number(value).toLocaleString("en-US");
}

// Hapus semua karakter non-digit dan parse ke angka
function parseRupiah(raw: string): number {
  const digits = raw.replace(/[^0-9]/g, "");
  return digits === "" ? 0 : parseInt(digits, 10);
}

interface PriceInputProps {
  id: string;
  value: number;
  onChange: (val: number) => void;
  disabled?: boolean;
  className?: string;
}

function PriceInput({ id, value, onChange, disabled, className }: PriceInputProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      // Izinkan string kosong (saat user hapus semua)
      onChange(parseRupiah(raw));
    },
    [onChange]
  );

  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none">
        Rp
      </span>
      <Input
        id={id}
        type="text"
        inputMode="numeric"
        disabled={disabled}
        value={formatRupiah(value)}
        onChange={handleChange}
        className={cn("pl-8 rounded-xl border-slate-200 transition-all", className)}
      />
    </div>
  );
}

interface PriceFieldsProps {
  control: Control<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
  isDonation: boolean;
}

export function PriceFields({ control, errors, isDonation }: PriceFieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Original Price */}
      <div className="space-y-1.5">
        <Label htmlFor="originalPrice" className="text-xs font-semibold text-slate-500">
          Original Price (Rp)
        </Label>
        <Controller
          name="originalPrice"
          control={control}
          render={({ field }) => (
            <PriceInput
              id="originalPrice"
              value={field.value ?? 0}
              onChange={field.onChange}
              className="bg-slate-50/60 focus:bg-white"
            />
          )}
        />
        {errors.originalPrice && (
          <p className="text-xs text-red-500 flex items-center gap-1">
            <AlertCircle className="w-3 h-3 shrink-0" />
            {errors.originalPrice.message}
          </p>
        )}
      </div>

      {/* Discount / Sale Price */}
      <div className="space-y-1.5">
        <Label htmlFor="discountPrice" className="text-xs font-semibold text-slate-500">
          {isDonation ? "Sale Price (Rp)" : "Discount Price (Rp)"}
        </Label>
        <Controller
          name="discountPrice"
          control={control}
          render={({ field }) => (
            <PriceInput
              id="discountPrice"
              value={field.value ?? 0}
              onChange={field.onChange}
              disabled={isDonation}
              className={
                isDonation
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : "bg-slate-50/60 focus:bg-white"
              }
            />
          )}
        />
        {errors.discountPrice && (
          <p className="text-xs text-red-500 flex items-center gap-1">
            <AlertCircle className="w-3 h-3 shrink-0" />
            {errors.discountPrice.message}
          </p>
        )}
      </div>
    </div>
  );
}
