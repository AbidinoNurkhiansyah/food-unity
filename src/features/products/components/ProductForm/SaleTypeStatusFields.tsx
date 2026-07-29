import type { UseFormSetValue } from "react-hook-form";
import type { ProductFormValues } from "../../types";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SaleTypeStatusFieldsProps {
  setValue: UseFormSetValue<ProductFormValues>;
  isDonation: boolean;
  currentStatus: string | undefined;
}

export function SaleTypeStatusFields({
  setValue,
  isDonation,
  currentStatus,
}: SaleTypeStatusFieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Sale Type */}
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-slate-500">Sale Type</Label>
        <Select
          value={isDonation ? "true" : "false"}
          onValueChange={(val) => {
            const valBool = val === "true";
            setValue("isDonation", valBool, { shouldValidate: true });
            if (valBool)
              setValue("discountPrice", 0, { shouldValidate: true });
          }}
        >
          <SelectTrigger className="w-full rounded-xl border-slate-200 bg-slate-50/60 focus:bg-white transition-all">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="false">Discounted (Paid)</SelectItem>
            <SelectItem value="true">Donation (Free)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Status */}
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-slate-500">Status</Label>
        <Select
          value={currentStatus || "active"}
          onValueChange={(val) =>
            setValue("status", val as "active" | "sold_out" | "expired", {
              shouldValidate: true,
            })
          }
        >
          <SelectTrigger className="w-full rounded-xl border-slate-200 bg-slate-50/60 focus:bg-white transition-all">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="sold_out">Sold Out</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
