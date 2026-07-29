import { useState } from 'react';
import type { Product } from "../types";
import { useProductForm } from "../hooks/useProductForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, Image as ImageIcon, Coins, PackageOpen, Clock, Heart, AlertCircle } from "lucide-react";

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
        
        {/* Left Column: General & Media */}
        <div className="space-y-6">
          
          {/* Card 1: Basic Information */}
          <Card className="border border-slate-200/60 shadow-sm bg-white">
            <CardHeader className="pb-4 border-b border-slate-100 flex flex-row items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100/50 mt-0.5">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <CardTitle className="text-sm font-bold text-slate-800 tracking-tight">Basic Information</CardTitle>
                <CardDescription className="text-[11px] text-slate-400 mt-0.5">Surplus item name, category, and explanation.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-5">
              
              {/* Product Title */}
              <div className="space-y-1.5">
                <Label htmlFor="title" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Product / Package Name</Label>
                <Input
                  id="title"
                  placeholder="e.g., Afternoon Sweet Bread Package"
                  className="bg-slate-50/50 hover:bg-slate-50/20 focus:bg-white focus:ring-4 focus:ring-palette-500/10 border-slate-200/80 rounded-xl transition-all"
                  {...register("title")}
                />
                {errors.title && (
                  <p className="text-xs text-red-500 font-semibold flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Product Category */}
              <div className="space-y-1.5">
                <Label htmlFor="category" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Product Category</Label>
                <Select
                  value={currentCategory || ""}
                  onValueChange={(val) =>
                    setValue("category", val, { shouldValidate: true })
                  }
                >
                  <SelectTrigger className="bg-slate-50/50 hover:bg-slate-50/20 focus:bg-white focus:ring-4 focus:ring-palette-500/10 border-slate-200/80 rounded-xl transition-all text-left">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border border-slate-200/80">
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
                  <p className="text-xs text-red-500 font-semibold flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.category.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <Label htmlFor="description" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the product condition, reason for surplus, etc."
                  rows={4}
                  className="bg-slate-50/50 hover:bg-slate-50/20 focus:bg-white focus:ring-4 focus:ring-palette-500/10 border-slate-200/80 rounded-xl transition-all resize-none leading-relaxed"
                  {...register("description")}
                />
                {errors.description && (
                  <p className="text-xs text-red-500 font-semibold flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.description.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Product Image */}
          <Card className="border border-slate-200/60 shadow-sm bg-white">
            <CardHeader className="pb-4 border-b border-slate-100 flex flex-row items-start gap-3">
              <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100/50 mt-0.5">
                <ImageIcon className="w-4 h-4" />
              </div>
              <div>
                <CardTitle className="text-sm font-bold text-slate-800 tracking-tight">Product Photo</CardTitle>
                <CardDescription className="text-[11px] text-slate-400 mt-0.5">Attach a photo of the food package (optional).</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-5">
              <div className="space-y-1.5">
                <Label htmlFor="image" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Product Image</Label>
                <div className="mt-1 flex items-center gap-4">
                  {imagePreview ? (
                    <div className="relative group w-20 h-20 rounded-xl overflow-hidden border border-slate-200 shadow-sm shrink-0">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                        <span className="text-[10px] text-white font-bold uppercase tracking-wider">Change</span>
                      </div>
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="relative group flex-1 h-24 border border-slate-200/80 border-dashed rounded-xl bg-slate-50/45 hover:bg-slate-50/20 hover:border-slate-350 transition-all flex flex-col items-center justify-center text-slate-400 cursor-pointer">
                      <ImageIcon className="w-5 h-5 text-slate-300 group-hover:text-slate-455 transition-colors mb-1" />
                      <span className="text-xs font-semibold text-slate-600">Upload product photo</span>
                      <span className="text-[9.5px] text-slate-400 mt-0.5">PNG, JPG up to 5MB</span>
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Pricing & Logistics */}
        <div className="space-y-6">
          
          {/* Card 3: Pricing & Sale Type */}
          <Card className="border border-slate-200/60 shadow-sm bg-white">
            <CardHeader className="pb-4 border-b border-slate-100 flex flex-row items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-50 text-amber-600 border border-amber-100/50 mt-0.5">
                <Coins className="w-4 h-4" />
              </div>
              <div>
                <CardTitle className="text-sm font-bold text-slate-800 tracking-tight">Pricing & Sale Type</CardTitle>
                <CardDescription className="text-[11px] text-slate-400 mt-0.5">Select whether this package is discounted or free donation.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-5 pt-5">
              
              {/* Sale Type Radio Cards */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sale Type</Label>
                <div className="grid grid-cols-2 gap-3 mt-1">
                  
                  {/* Discount option card */}
                  <div
                    onClick={() => {
                      setValue("isDonation", false, { shouldValidate: true });
                    }}
                    className={cn(
                      "flex flex-col p-3 border rounded-xl cursor-pointer text-left transition-all duration-200",
                      !isDonation
                        ? "bg-amber-50/20 border-amber-500 ring-2 ring-amber-500/10"
                        : "bg-white border-slate-200 hover:border-slate-350"
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-850 text-xs">Discounted</span>
                      <div className={cn(
                        "w-3.5 h-3.5 rounded-full border flex items-center justify-center",
                        !isDonation ? "border-amber-500 bg-amber-500 text-white" : "border-slate-300"
                      )}>
                        {!isDonation && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium leading-normal">Sell surplus food at discount.</span>
                  </div>

                  {/* Donation option card */}
                  <div
                    onClick={() => {
                      setValue("isDonation", true, { shouldValidate: true });
                      setValue("discountPrice", 0, { shouldValidate: true });
                    }}
                    className={cn(
                      "flex flex-col p-3 border rounded-xl cursor-pointer text-left transition-all duration-200",
                      isDonation
                        ? "bg-rose-50/20 border-rose-500 ring-2 ring-rose-500/10"
                        : "bg-white border-slate-200 hover:border-slate-350"
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-850 text-xs flex items-center gap-1">
                        Donation <Heart className="w-3 h-3 text-rose-500 fill-rose-550" />
                      </span>
                      <div className={cn(
                        "w-3.5 h-3.5 rounded-full border flex items-center justify-center",
                        isDonation ? "border-rose-500 bg-rose-500 text-white" : "border-slate-300"
                      )}>
                        {isDonation && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium leading-normal">Share items for free to help out.</span>
                  </div>
                </div>
              </div>

              {/* Product Status */}
              <div className="space-y-1.5">
                <Label htmlFor="status" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Product Status</Label>
                <Select
                  value={currentStatus || "active"}
                  onValueChange={(val) =>
                    setValue("status", val as 'active' | 'sold_out' | 'expired', { shouldValidate: true })
                  }
                >
                  <SelectTrigger className="bg-slate-50/50 hover:bg-slate-50/20 focus:bg-white focus:ring-4 focus:ring-palette-500/10 border-slate-200/80 rounded-xl transition-all text-left">
                    <SelectValue placeholder="Select product status" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border border-slate-200/80">
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="sold_out">Sold Out</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && (
                  <p className="text-xs text-red-500 font-semibold flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.status.message}
                  </p>
                )}
              </div>

              {/* Price Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="originalPrice" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Original Price (Rp)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Rp</span>
                    <Input
                      id="originalPrice"
                      type="number"
                      min="0"
                      className="pl-8 bg-slate-50/50 hover:bg-slate-50/20 focus:bg-white focus:ring-4 focus:ring-palette-500/10 border-slate-200/80 rounded-xl transition-all"
                      {...register("originalPrice", { valueAsNumber: true })}
                    />
                  </div>
                  {errors.originalPrice && (
                    <p className="text-xs text-red-500 font-semibold flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.originalPrice.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="discountPrice" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Discount Price (Rp)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Rp</span>
                    <Input
                      id="discountPrice"
                      type="number"
                      min="0"
                      disabled={isDonation}
                      className={cn(
                        "pl-8 border-slate-200/80 rounded-xl transition-all",
                        isDonation 
                          ? "bg-slate-100 text-slate-400 border-slate-200/40" 
                          : "bg-slate-50/50 hover:bg-slate-50/20 focus:bg-white focus:ring-4 focus:ring-palette-500/10"
                      )}
                      {...register("discountPrice", { valueAsNumber: true })}
                    />
                  </div>
                  {errors.discountPrice && (
                    <p className="text-xs text-red-500 font-semibold flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.discountPrice.message}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 4: Inventory & Logistics */}
          <Card className="border border-slate-200/60 shadow-sm bg-white">
            <CardHeader className="pb-4 border-b border-slate-100 flex flex-row items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100/50 mt-0.5">
                <PackageOpen className="w-4 h-4" />
              </div>
              <div>
                <CardTitle className="text-sm font-bold text-slate-800 tracking-tight">Stock & Logistics</CardTitle>
                <CardDescription className="text-[11px] text-slate-400 mt-0.5">Logistical quantities and unit measurements.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-5">
              
              <div className="grid grid-cols-2 gap-4">
                {/* Remaining Stock */}
                <div className="space-y-1.5">
                  <Label htmlFor="stock" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Remaining Stock</Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    className="bg-slate-50/50 hover:bg-slate-50/20 focus:bg-white focus:ring-4 focus:ring-palette-500/10 border-slate-200/80 rounded-xl transition-all"
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
                    <p className="text-xs text-red-500 font-semibold flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.stock.message}
                    </p>
                  )}
                </div>

                {/* Unit Selector */}
                <div className="space-y-1.5">
                  <Label htmlFor="unit" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Unit</Label>
                  <Select
                    value={currentUnit || "porsi"}
                    onValueChange={(val) =>
                      setValue("unit", val as 'pcs' | 'box' | 'kg' | 'gram' | 'porsi', { shouldValidate: true })
                    }
                  >
                    <SelectTrigger className="bg-slate-50/50 hover:bg-slate-50/20 focus:bg-white focus:ring-4 focus:ring-palette-500/10 border-slate-200/80 rounded-xl transition-all text-left">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border border-slate-200/80">
                      <SelectItem value="porsi">Portion</SelectItem>
                      <SelectItem value="pcs">Pcs</SelectItem>
                      <SelectItem value="box">Box</SelectItem>
                      <SelectItem value="kg">Kg</SelectItem>
                      <SelectItem value="gram">Gram</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.unit && (
                    <p className="text-xs text-red-500 font-semibold flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.unit.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Weight per Unit */}
              <div className="space-y-1.5">
                <Label htmlFor="weightInGrams" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Weight per Unit (Grams)</Label>
                <div className="relative">
                  <Input
                    id="weightInGrams"
                    type="number"
                    min="1"
                    className="pr-12 bg-slate-50/50 hover:bg-slate-50/20 focus:bg-white focus:ring-4 focus:ring-palette-500/10 border-slate-200/80 rounded-xl transition-all"
                    {...register("weightInGrams", { valueAsNumber: true })}
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">grams</span>
                </div>
                {errors.weightInGrams && (
                  <p className="text-xs text-red-500 font-semibold flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.weightInGrams.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Card 5: Final Pickup Deadline */}
          <Card className="border border-amber-200/60 bg-amber-50/15 shadow-sm">
            <CardHeader className="pb-3 border-b border-amber-200/20 flex flex-row items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-50 border border-amber-100 text-amber-600 animate-pulse mt-0.5">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <CardTitle className="text-sm font-bold text-amber-900 tracking-tight">Pickup Deadline</CardTitle>
                <CardDescription className="text-[11px] text-amber-600 mt-0.5">Temporal limit for food rescue.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-5 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="pickupDeadline" className="text-xs font-bold text-amber-800 uppercase tracking-wider">Final Pickup Deadline</Label>
                <Input
                  id="pickupDeadline"
                  type="datetime-local"
                  className="bg-white border-amber-200/80 focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 rounded-xl transition-all"
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
                <p className="text-[10px] text-amber-650 leading-relaxed font-medium">
                  We highly recommend setting this automatically based on your daily operating hours.
                </p>
                {errors.pickupDeadline && (
                  <p className="text-xs text-red-500 font-semibold flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.pickupDeadline.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {uploadError && (
        <p className="text-xs text-red-500 font-bold flex items-center gap-1 bg-red-50 border border-red-150 p-3.5 rounded-xl">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <span>{uploadError}</span>
        </p>
      )}

      {/* Form Action */}
      <Button 
        type="submit" 
        className="w-full font-bold py-5 bg-palette-600 hover:bg-palette-700 text-white rounded-xl text-sm shadow-md transition-all active:scale-[98.5%]" 
        disabled={isSubmitting}
      >
        {isSubmitting ? "Saving Surplus Package..." : initialData ? "Update Package Details" : "Publish Surplus Package"}
      </Button>
    </form>
  );
}
