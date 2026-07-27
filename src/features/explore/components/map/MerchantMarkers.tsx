import React from "react";
import { Marker } from "@react-google-maps/api";
import type { MerchantUser } from "@/features/merchant-profile/types";

interface MerchantMarkersProps {
  activeMerchants: MerchantUser[];
  merchantIcon: google.maps.Icon | null;
  onSelectMerchant: (merchant: MerchantUser, lat: number, lng: number) => void;
}

export const MerchantMarkers: React.FC<MerchantMarkersProps> = ({
  activeMerchants,
  merchantIcon,
  onSelectMerchant,
}) => {
  return (
    <>
      {activeMerchants.map((merchant) => {
        const lat = Number(merchant.profile?.coordinates?.latitude);
        const lng = Number(merchant.profile?.coordinates?.longitude);
        if (isNaN(lat) || isNaN(lng)) return null;

        return (
          <Marker
            key={merchant.uid}
            position={{ lat, lng }}
            title={merchant.profile?.businessName || merchant.name}
            icon={merchantIcon || undefined}
            onClick={() => onSelectMerchant(merchant, lat, lng)}
          />
        );
      })}
    </>
  );
};
