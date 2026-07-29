import { Scanner } from "@yudiel/react-qr-scanner";
import { useScanner } from "@/features/claims/hooks/useScanner";
import { Button } from "@/components/ui/button";
import { Camera, Keyboard, AlertCircle } from "lucide-react";
import { claimsApi } from "@/features/claims/services/claimsApi";
import { toast } from "sonner";
import { useAuthStore } from "@/features/auth";

export function ScannerPage() {
  const { user } = useAuthStore();

  const handleGlobalScan = async (scannedCode: string) => {
    try {
      const claim = await claimsApi.getClaimById(scannedCode);

      if (!claim) {
        toast.error("Tiket tidak ditemukan! Pastikan kode benar.");
        return;
      }

      if (!user?.uid || !claim.merchantIds?.includes(user.uid)) {
        toast.error("Tiket ini bukan untuk toko Anda.");
        return;
      }

      if (claim.status === "COMPLETED") {
        toast.warning("Pesanan ini sudah diambil sebelumnya!");
        return;
      }

      if (claim.status !== "PAID") {
        toast.warning(`Tiket tidak bisa divalidasi. Status: ${claim.status}`);
        return;
      }

      await claimsApi.completeClaim(scannedCode);
      toast.success("Pesanan berhasil ditandai selesai (sudah diambil)");
      // navigate('/dashboard/claims'); // Optional: redirect after success
    } catch (error) {
      console.error(error);
      toast.error("Gagal memvalidasi tiket");
    }
  };

  const {
    mode,
    setMode,
    manualCode,
    setManualCode,
    error,
    setError,
    handleScan,
    handleManualSubmit,
  } = useScanner(true, handleGlobalScan);

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm max-w-full mx-auto overflow-hidden gap-6">
      <div className="w-full">
        <div className="flex bg-gray-100 p-1.5 w-full">
          <button
            onClick={() => setMode("CAMERA")}
            className={`flex-1 flex cursor-pointer items-center justify-center gap-2 py-3 text-sm font-medium rounded-md transition-all ${
              mode === "CAMERA"
                ? "bg-white shadow text-gray-900"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Camera size={18} /> Kamera
          </button>
          <button
            onClick={() => setMode("MANUAL")}
            className={`flex-1 flex items-center cursor-pointer justify-center gap-2 py-3 text-sm font-medium rounded-md transition-all ${
              mode === "MANUAL"
                ? "bg-white shadow text-gray-900"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Keyboard size={18} /> Input Manual
          </button>
        </div>
      </div>

      {mode === "CAMERA" ? (
        <div className="overflow-hidden bg-black flex-1 min-h-[300px] flex items-center justify-center relative w-full shadow-inner">
          <Scanner
            onScan={(result) => handleScan(result[0].rawValue)}
            onError={(error) => setError(error.message)}
            components={{
              finder: true,
            }}
            styles={{
              container: { width: "100%", height: "100%" },
            }}
          />
          {error && (
            <div className="absolute bottom-4 left-4 right-4 bg-red-500/90 backdrop-blur-sm text-white p-3 rounded-xl text-sm flex items-center gap-2 shadow-lg max-w-md mx-auto">
              <AlertCircle size={18} className="shrink-0" />
              <span>Gagal mengakses kamera atau scan error.</span>
            </div>
          )}
        </div>
      ) : (
        <form
          onSubmit={handleManualSubmit}
          className="space-y-5 px-4 pb-4 md:px-6 md:pb-6 w-full"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
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
              className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-palette-500 focus:border-palette-500 outline-none transition-all text-base"
              autoFocus
            />
            {error && (
              <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                <AlertCircle size={14} /> {error}
              </p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full h-12 text-base font-semibold bg-palette-600 hover:bg-palette-700 rounded-xl shadow-md shadow-palette-600/20"
          >
            Validasi Kode
          </Button>
        </form>
      )}
    </div>
  );
}
