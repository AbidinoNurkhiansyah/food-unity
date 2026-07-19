import React, { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Camera, Keyboard, AlertCircle } from 'lucide-react';

interface ScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (orderId: string) => void;
}

type ScanMode = 'CAMERA' | 'MANUAL';

export const ScannerModal: React.FC<ScannerModalProps> = ({ isOpen, onClose, onScan }) => {
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
  React.useEffect(() => {
    if (isOpen) {
      setMode('CAMERA');
      setManualCode('');
      setError(null);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Scan Tiket Pembeli</DialogTitle>
        </DialogHeader>

        <div className="flex bg-gray-100 p-1 rounded-lg mb-4">
          <button
            onClick={() => setMode('CAMERA')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${
              mode === 'CAMERA' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Camera size={16} /> Kamera
          </button>
          <button
            onClick={() => setMode('MANUAL')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${
              mode === 'MANUAL' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Keyboard size={16} /> Input Manual
          </button>
        </div>

        {mode === 'CAMERA' ? (
          <div className="rounded-xl overflow-hidden bg-black aspect-square flex items-center justify-center relative">
            <Scanner
              onScan={(result) => handleScan(result[0].rawValue)}
              onError={(error) => setError(error.message)}
              components={{
                finder: true,
              }}
              styles={{
                container: { width: '100%', height: '100%' },
              }}
            />
            {error && (
              <div className="absolute bottom-4 left-4 right-4 bg-red-500/90 text-white p-3 rounded-lg text-sm flex items-center gap-2">
                <AlertCircle size={16} />
                <span>Gagal mengakses kamera atau scan error.</span>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleManualSubmit} className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Masukkan Kode Unik / Order ID
              </label>
              <input
                type="text"
                value={manualCode}
                onChange={(e) => {
                  setManualCode(e.target.value);
                  setError(null);
                }}
                placeholder="Contoh: ORDER-1234567..."
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                autoFocus
              />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>
            <Button type="submit" className="w-full h-12 bg-emerald-600 hover:bg-emerald-700">
              Validasi Kode
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
