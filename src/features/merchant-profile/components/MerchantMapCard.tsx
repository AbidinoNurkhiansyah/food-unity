import React from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { Map, MapPin } from "lucide-react";

interface MerchantMapCardProps {
  isLoaded: boolean;
  loadError: Error | undefined;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

const mapContainerStyle = {
  width: "100%",
  height: "280px",
  borderRadius: "16px",
};

export const MerchantMapCard: React.FC<MerchantMapCardProps> = ({
  isLoaded,
  loadError,
  coordinates,
}) => {
  const mapCoordinates = coordinates
    ? {
        lat: coordinates.latitude,
        lng: coordinates.longitude,
      }
    : { lat: -6.2088, lng: 106.8456 }; // Default Jakarta coordinates

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
      <h3 className="font-bold text-slate-800 flex items-center gap-2 border-b border-slate-50 pb-2">
        <Map className="w-4 h-4 text-primary-500" /> Peta Lokasi
      </h3>

      {isLoaded && !loadError && coordinates ? (
        <div className="border border-slate-100 rounded-xl overflow-hidden shadow-inner">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={mapCoordinates}
            zoom={15}
            options={{
              disableDefaultUI: true,
              zoomControl: true,
            }}
          >
            <Marker position={mapCoordinates} />
          </GoogleMap>
        </div>
      ) : (
        <div className="bg-slate-50 rounded-xl border border-slate-100 h-[280px] flex flex-col items-center justify-center p-4 text-center">
          <MapPin className="w-10 h-10 text-slate-300 mb-2 animate-bounce" />
          <p className="text-sm font-semibold text-slate-600">
            Peta Interaktif Tidak Tersedia
          </p>
          <p className="text-xs text-slate-400 mt-1 max-w-xs">
            Merchant belum menyimpan koordinat lokasi GPS secara presisi atau API key belum dikonfigurasi.
          </p>
        </div>
      )}

      {coordinates && (
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${coordinates.latitude},${coordinates.longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold rounded-xl transition-all text-xs cursor-pointer active:scale-95"
        >
          <MapPin className="w-4 h-4 text-primary-500" /> Buka di Google Maps
        </a>
      )}
    </div>
  );
};
