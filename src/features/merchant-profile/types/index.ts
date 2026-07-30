export interface MerchantProfile {
  bannerImageUrl?: string;
  logoImageUrl?: string;
  businessName?: string;
  merchantType?: string;
  phoneNumber?: string;
  description?: string;
  pickupHours?: string;
  locationNotes?: string;
  address?: {
    detailAddress?: string;
    provinceName?: string;
    regencyName?: string;
    districtName?: string;
    villageName?: string;
  };
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface MerchantUser {
  uid: string;
  name: string;
  email: string;
  role: string;
  profile?: MerchantProfile;
}
