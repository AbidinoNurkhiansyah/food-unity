import { GoogleMap, Marker } from "@react-google-maps/api";
import { MapPin, Compass, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const mapContainerStyle = {
  width: "100%",
  height: "350px",
  borderRadius: "12px",
};

interface GPSLocationSectionProps {
  isLoaded: boolean;
  loadError: Error | undefined;
  coordinates: { lat: number; lng: number };
  customCoordinates: { latitude: string; longitude: string };
  onMapClick: (e: google.maps.MapMouseEvent) => void;
  handleGetCurrentLocation: () => void;
  isDetectingLocation: boolean;
  handleCoordChange: (field: "latitude" | "longitude", value: string) => void;
  showTitle?: boolean;
}

export function GPSLocationSection({
  isLoaded,
  loadError,
  coordinates,
  customCoordinates,
  onMapClick,
  handleGetCurrentLocation,
  isDetectingLocation,
  handleCoordChange,
  showTitle = true,
}: GPSLocationSectionProps) {
  return (
    <div className="space-y-4">
      {showTitle && (
        <h3 className="font-bold text-lg text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary-500" /> Lokasi GPS & Navigasi
        </h3>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          type="button"
          variant="outline"
          disabled={isDetectingLocation}
          className="flex-1 cursor-pointer border border-primary-500 text-primary-600 font-bold hover:bg-primary-50 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleGetCurrentLocation}
        >
          {isDetectingLocation ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin text-primary-500" />
              Mendeteksi Lokasi GPS...
            </>
          ) : (
            <>
              <Compass className="w-4 h-4 mr-2 text-primary-500" />
              Deteksi GPS Saya (Share Location)
            </>
          )}
        </Button>
      </div>

      {/* Google Maps / Fallback Container */}
      <div className="relative">
        {isLoaded && !loadError ? (
          <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={coordinates}
              zoom={15}
              onClick={onMapClick}
            >
              <Marker position={coordinates} />
            </GoogleMap>
          </div>
        ) : (
          <div className="bg-gray-100 rounded-xl border border-gray-200 h-[350px] flex flex-col items-center justify-center p-4 text-center">
            <AlertCircle className="w-10 h-10 text-gray-400 mb-2 animate-bounce" />
            <p className="text-sm font-semibold text-gray-700">
              Peta Interaktif Dimuat Statis
            </p>
            <p className="text-xs text-gray-400 mt-1 max-w-sm">
              Layanan peta menggunakan koordinat GPS perangkat. Anda dapat
              verifikasi koordinat Latitude & Longitude secara manual di bawah.
            </p>
          </div>
        )}
        <p className="text-[10px] text-gray-400 text-center mt-1">
          * Klik/sentuh peta di atas untuk menggeser penanda lokasi pengambilan secara presisi.
        </p>
      </div>

      {/* Input Koordinat Lat & Lng */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="latitude" className="text-xs font-bold text-gray-700">
            Latitude
          </Label>
          <Input
            id="latitude"
            type="text"
            className="rounded-xl border-gray-200 bg-gray-50 focus:bg-white text-sm"
            value={customCoordinates.latitude}
            onChange={(e) => handleCoordChange("latitude", e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="longitude" className="text-xs font-bold text-gray-700">
            Longitude
          </Label>
          <Input
            id="longitude"
            type="text"
            className="rounded-xl border-gray-200 bg-gray-50 focus:bg-white text-sm"
            value={customCoordinates.longitude}
            onChange={(e) => handleCoordChange("longitude", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
