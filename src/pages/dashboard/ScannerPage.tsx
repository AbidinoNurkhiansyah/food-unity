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
        toast.error("Ticket not found! Make sure the code is correct.");
        return;
      }

      if (!user?.uid || !claim.merchantIds?.includes(user.uid)) {
        toast.error("This ticket is not for your store.");
        return;
      }

      if (claim.status === "COMPLETED") {
        toast.warning("This order has already been picked up!");
        return;
      }

      if (claim.status !== "PAID") {
        toast.warning(`Ticket cannot be validated. Status: ${claim.status}`);
        return;
      }

      await claimsApi.completeClaim(scannedCode);
      toast.success("Order successfully marked as completed (picked up)");
      // navigate('/dashboard/claims'); // Optional: redirect after success
    } catch (error) {
      console.error(error);
      toast.error("Failed to validate ticket");
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
            <Camera size={18} /> Camera
          </button>
          <button
            onClick={() => setMode("MANUAL")}
            className={`flex-1 flex items-center cursor-pointer justify-center gap-2 py-3 text-sm font-medium rounded-md transition-all ${
              mode === "MANUAL"
                ? "bg-white shadow text-gray-900"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Keyboard size={18} /> Manual Input
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
              <span>Failed to access camera or scan error.</span>
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
              Enter Unique Code / Order ID
            </label>
            <input
              type="text"
              value={manualCode}
              onChange={(e) => {
                setManualCode(e.target.value);
                setError(null);
              }}
              placeholder="Example: ORDER-1234567..."
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
            Validate Code
          </Button>
        </form>
      )}
    </div>
  );
}
