import { useEffect, useRef, useState } from 'react';

interface UseCountUpOptions {
  end: number;
  duration?: number; // ms
  decimals?: number;
  enabled?: boolean; // mulai animasi hanya saat enabled=true
}

/**
 * useCountUp — Animasi angka naik dari 0 ke `end` dalam `duration` ms.
 * Menggunakan requestAnimationFrame agar halus dan tidak membuang timer.
 */
export function useCountUp({
  end,
  duration = 1200,
  decimals = 0,
  enabled = true,
}: UseCountUpOptions): string {
  const [displayValue, setDisplayValue] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const prevEndRef = useRef<number>(0);

  useEffect(() => {
    if (!enabled) return;

    // Cancel animasi sebelumnya jika ada
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
    }

    const startValue = prevEndRef.current;
    startTimeRef.current = null;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Easing: ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (end - startValue) * eased;

      setDisplayValue(current);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(end);
        prevEndRef.current = end;
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [end, duration, enabled]);

  if (decimals > 0) {
    return displayValue.toFixed(decimals);
  }
  return Math.floor(displayValue).toString();
}
