import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageIcon } from "lucide-react";

interface ImageUploaderProps {
  imagePreview: string | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ImageUploader({ imagePreview, onImageChange }: ImageUploaderProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label className="text-xs font-semibold text-slate-500">
        Product Photo
      </Label>
      {imagePreview ? (
        <div className="relative group w-full aspect-square rounded-xl overflow-hidden border border-slate-200 shadow-sm">
          <img
            src={imagePreview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity gap-1">
            <span className="text-[10px] text-white font-bold uppercase tracking-wider">
              Change
            </span>
          </div>
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={onImageChange}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
        </div>
      ) : (
        <div className="relative group w-full aspect-square border border-dashed border-slate-200 rounded-xl bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer text-center px-3">
          <ImageIcon className="w-7 h-7 text-slate-300 group-hover:text-slate-400 transition-colors" />
          <p className="text-xs font-semibold text-slate-500">Upload photo</p>
          <p className="text-[10px] text-slate-400 leading-tight">
            PNG, JPG · max 5MB
          </p>
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={onImageChange}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
        </div>
      )}
    </div>
  );
}
