import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageIcon } from "lucide-react";
import { useImageUploader } from "../../hooks/useImageUploader";

interface ImageUploaderProps {
  imagePreview: string | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ImageUploader({ imagePreview, onImageChange }: ImageUploaderProps) {
  const {
    isDragging,
    error,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleChange
  } = useImageUploader({ onImageChange });

  return (
    <div className="flex flex-col gap-2">
      <Label className="text-xs font-semibold text-slate-500">
        Product Photo
      </Label>
      {imagePreview ? (
        <div 
          className={`relative group w-full aspect-square rounded-xl overflow-hidden border shadow-sm ${isDragging ? 'border-primary ring-2 ring-primary/20' : 'border-slate-200'}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
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
            onChange={handleChange}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
        </div>
      ) : (
        <div 
          className={`relative group w-full aspect-square border border-dashed rounded-xl transition-all flex flex-col items-center justify-center gap-2 cursor-pointer text-center px-3 ${
            isDragging 
              ? 'border-primary bg-primary/5' 
              : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <ImageIcon className={`w-7 h-7 transition-colors ${isDragging ? 'text-primary' : 'text-slate-300 group-hover:text-slate-400'}`} />
          <p className="text-xs font-semibold text-slate-500">
            {isDragging ? 'Drop photo here' : 'Upload photo'}
          </p>
          <p className="text-[10px] text-slate-400 leading-tight">
            PNG, JPG · max 2MB
          </p>
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
        </div>
      )}
      {error && (
        <p className="text-[10px] text-red-500 font-medium text-center">
          {error}
        </p>
      )}
    </div>
  );
}
