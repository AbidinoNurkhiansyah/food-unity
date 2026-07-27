import React from "react";
import { Marker, Circle } from "@react-google-maps/api";

interface UserLocationMarkerProps {
  userLocation: { lat: number; lng: number };
  userIcon: google.maps.Symbol;
}

export const UserLocationMarker: React.FC<UserLocationMarkerProps> = ({
  userLocation,
  userIcon,
}) => {
  return (
    <>
      <Marker
        position={userLocation}
        title="Lokasi Anda"
        icon={userIcon}
        zIndex={2}
      />
      <Circle
        center={userLocation}
        radius={20}
        options={{
          strokeColor: "#1A73E8",
          strokeOpacity: 0.25,
          strokeWeight: 1,
          fillColor: "#1A73E8",
          fillOpacity: 0.12,
          clickable: false,
          zIndex: 1,
        }}
      />
    </>
  );
};
