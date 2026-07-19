import { useState, useEffect } from 'react';

export type ScanMode = 'CAMERA' | 'MANUAL';

export function useScanner(isOpen: boolean, onScan: (orderId: string) => void) {
  const [mode, setMode] = useState<ScanMode>('CAMERA');
  const [manualCode, setManualCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleScan = (data: string) => {
    if (data) {
      onScan(data);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) {
      setError('Kode tidak boleh kosong');
      return;
    }
    onScan(manualCode.trim());
  };

  // Reset state when opened/closed
  useEffect(() => {
    if (isOpen) {
      setMode('CAMERA');
      setManualCode('');
      setError(null);
    }
  }, [isOpen]);

  return {
    mode,
    setMode,
    manualCode,
    setManualCode,
    error,
    setError,
    handleScan,
    handleManualSubmit
  };
}
