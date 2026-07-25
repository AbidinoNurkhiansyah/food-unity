import { MapPin } from "lucide-react";
import { type UseFormRegister, type FieldErrors, type Control } from "react-hook-form";
import { type OnboardingValues } from "../constants/schemas";
import { GPSLocationSection } from "./GPSLocationSection";
import { MerchantOperationsSection } from "./MerchantOperationsSection";

interface MerchantStepThreeProps {
  register: UseFormRegister<OnboardingValues>;
  errors: FieldErrors<OnboardingValues>;
  control: Control<OnboardingValues>;
  isLoaded: boolean;
  loadError: Error | undefined;
  coordinates: { lat: number; lng: number };
  customCoordinates: { latitude: string; longitude: string };
  onMapClick: (e: google.maps.MapMouseEvent) => void;
  handleGetCurrentLocation: () => void;
  isDetectingLocation: boolean;
  handleCoordChange: (field: "latitude" | "longitude", value: string) => void;
}

export function MerchantStepThree({
  control,
  isLoaded,
  loadError,
  coordinates,
  customCoordinates,
  onMapClick,
  handleGetCurrentLocation,
  isDetectingLocation,
  handleCoordChange,
}: MerchantStepThreeProps) {
  return (
    <>
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-primary-600 font-extrabold text-xs uppercase tracking-wider">
          <MapPin className="w-3.5 h-3.5" /> Precision Mapping & Schedule
        </div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
          GPS Map & Operations
        </h2>
        <p className="text-sm text-slate-500 font-medium max-w-xl">
          Adjust the map pin for accurate courier/recipient navigation, and
          specify the food pickup hours.
        </p>
      </div>

      <div className="space-y-6">
        <GPSLocationSection
          isLoaded={isLoaded}
          loadError={loadError}
          coordinates={coordinates}
          customCoordinates={customCoordinates}
          onMapClick={onMapClick}
          handleGetCurrentLocation={handleGetCurrentLocation}
          isDetectingLocation={isDetectingLocation}
          handleCoordChange={handleCoordChange}
          showTitle={false}
        />

        <MerchantOperationsSection control={control} />
      </div>
    </>
  );
}

