import type { Product } from "../types";
import { useProductForm } from "../hooks/useProductForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductFormProps {
  onSuccess?: () => void;
  initialData?: Product;
}

export function ProductForm({ onSuccess, initialData }: ProductFormProps) {
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
    setValue,
    watch,
    formState: { errors },
  } = form;

  const currentCategory = watch("category");
  const currentUnit = watch("unit");
  const currentStatus = watch("status");

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Kolom Kiri */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Nama Produk / Paket</Label>
            <Input
              id="title"
              placeholder="Contoh: Paket Roti Manis Sore"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Kategori Produk</Label>
            <Select
              value={currentCategory || ""}
              onValueChange={(val) =>
                setValue("category", val, { shouldValidate: true })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
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
              <p className="text-sm text-red-500">{errors.category.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              placeholder="Deskripsikan kondisi produk, alasan surplus, dll."
              rows={4}
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Foto Produk (Opsional)</Label>
            <div className="flex items-center gap-4">
              {imagePreview && (
                <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-slate-200 shadow-sm shrink-0">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="flex-1"
              />
            </div>
          </div>
        </div>

        {/* Kolom Kanan */}
        <div className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Tipe Penjualan</Label>
              <Select
                value={isDonation ? "true" : "false"}
                onValueChange={(val) => {
                  const valBool = val === "true";
                  setValue("isDonation", valBool, { shouldValidate: true });
                  if (valBool) {
                    setValue("discountPrice", 0, { shouldValidate: true });
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tipe penjualan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="false">Berbayar (Diskon)</SelectItem>
                  <SelectItem value="true">Donasi (Gratis)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status Produk</Label>
              <Select
                value={currentStatus || "active"}
                onValueChange={(val) =>
                  setValue("status", val as any, { shouldValidate: true })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status produk" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="sold_out">Sold Out</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-sm text-red-500">{errors.status.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="originalPrice">Harga Asli (Rp)</Label>
              <Input
                id="originalPrice"
                type="number"
                min="0"
                {...register("originalPrice", { valueAsNumber: true })}
              />
              {errors.originalPrice && (
                <p className="text-sm text-red-500">
                  {errors.originalPrice.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="discountPrice">Harga Diskon (Rp)</Label>
              <Input
                id="discountPrice"
                type="number"
                min="0"
                disabled={isDonation}
                {...register("discountPrice", { valueAsNumber: true })}
              />
              {errors.discountPrice && (
                <p className="text-sm text-red-500">
                  {errors.discountPrice.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stock">Sisa Stok</Label>
              <Input
                id="stock"
                type="number"
                min="0"
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
                <p className="text-sm text-red-500">{errors.stock.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">Satuan</Label>
              <Select
                value={currentUnit || "porsi"}
                onValueChange={(val) =>
                  setValue("unit", val as any, { shouldValidate: true })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih satuan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="porsi">Porsi</SelectItem>
                  <SelectItem value="pcs">Pcs</SelectItem>
                  <SelectItem value="box">Box</SelectItem>
                  <SelectItem value="kg">Kg</SelectItem>
                  <SelectItem value="gram">Gram</SelectItem>
                </SelectContent>
              </Select>
              {errors.unit && (
                <p className="text-sm text-red-500">{errors.unit.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weightInGrams">Berat per Satuan (Gram)</Label>
              <Input
                id="weightInGrams"
                type="number"
                min="1"
                {...register("weightInGrams", { valueAsNumber: true })}
              />
              {errors.weightInGrams && (
                <p className="text-sm text-red-500">
                  {errors.weightInGrams.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="pickupDeadline">Batas Waktu Ambil</Label>
              <Input
                id="pickupDeadline"
                type="datetime-local"
                {...register("pickupDeadline", {
                  onChange: (e) => {
                    const val = e.target.value;
                    if (val) {
                      const deadlineTime = new Date(val).getTime();
                      if (!isNaN(deadlineTime) && deadlineTime <= Date.now()) {
                        setValue("status", "expired", { shouldValidate: true });
                      } else if (currentStatus === "expired") {
                        setValue("status", "active", { shouldValidate: true });
                      }
                    }
                  },
                })}
              />
              {errors.pickupDeadline && (
                <p className="text-sm text-red-500">
                  {errors.pickupDeadline.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {uploadError && (
        <p className="text-sm text-red-500 font-medium">{uploadError}</p>
      )}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Menyimpan..." : initialData ? "Update" : "Add Product"}
      </Button>
    </form>
  );
}
