import { useState } from 'react';

interface UseImageUploaderProps {
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  maxSizeInMB?: number;
}

export function useImageUploader({ onImageChange, maxSizeInMB = 2 }: UseImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const maxSizeBytes = maxSizeInMB * 1024 * 1024;

  const handleDragOver = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (file.size > maxSizeBytes) {
      setError(`File size exceeds ${maxSizeInMB}MB limit`);
      return;
    }

    const syntheticEvent = {
      target: {
        files: [file]
      }
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    
    onImageChange(syntheticEvent);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (file && file.size > maxSizeBytes) {
      setError(`File size exceeds ${maxSizeInMB}MB limit`);
      e.target.value = "";
      return;
    }
    onImageChange(e);
  };

  return {
    isDragging,
    error,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleChange
  };
}
