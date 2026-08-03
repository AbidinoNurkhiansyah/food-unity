import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

export interface RegionItem {
  code: string;
  name: string;
}

const BACKEND_URL = import.meta.env.VITE_API_URL;

export function useRegionSelect() {
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedRegency, setSelectedRegency] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedVillage, setSelectedVillage] = useState("");
  const [regionError, setRegionError] = useState("");

  const { data: provinces = [] } = useQuery({
    queryKey: ['provinces'],
    queryFn: async () => {
      try {
        const { data } = await axios.get(`${BACKEND_URL}/api/location/provinces`);
        return data.data || [];
      } catch (err) {
        console.error("Failed to fetch province data:", err);
        toast.error("Failed to load region list. Please refresh the page.");
        return [];
      }
    }
  });

  const { data: regencies = [] } = useQuery({
    queryKey: ['regencies', selectedProvince],
    queryFn: async () => {
      if (!selectedProvince) return [];
      try {
        const { data } = await axios.get(`${BACKEND_URL}/api/location/regencies/${selectedProvince}`);
        return data.data || [];
      } catch (err) {
        console.error("Failed to fetch regency/city data:", err);
        return [];
      }
    },
    enabled: !!selectedProvince
  });

  const { data: districts = [] } = useQuery({
    queryKey: ['districts', selectedRegency],
    queryFn: async () => {
      if (!selectedRegency) return [];
      try {
        const { data } = await axios.get(`${BACKEND_URL}/api/location/districts/${selectedRegency}`);
        return data.data || [];
      } catch (err) {
        console.error("Failed to fetch district data:", err);
        return [];
      }
    },
    enabled: !!selectedRegency
  });

  const { data: villages = [] } = useQuery({
    queryKey: ['villages', selectedDistrict],
    queryFn: async () => {
      if (!selectedDistrict) return [];
      try {
        const { data } = await axios.get(`${BACKEND_URL}/api/location/villages/${selectedDistrict}`);
        return data.data || [];
      } catch (err) {
        console.error("Failed to fetch village data:", err);
        return [];
      }
    },
    enabled: !!selectedDistrict
  });

  // Handlers untuk perubahan wilayah administratif
  const handleProvinceChange = (provinceId: string) => {
    setSelectedProvince(provinceId);
    setSelectedRegency("");
    setSelectedDistrict("");
    setSelectedVillage("");
  };

  const handleRegencyChange = (regencyId: string) => {
    setSelectedRegency(regencyId);
    setSelectedDistrict("");
    setSelectedVillage("");
  };

  const handleDistrictChange = (districtId: string) => {
    setSelectedDistrict(districtId);
    setSelectedVillage("");
  };

  return {
    provinces,
    regencies,
    districts,
    villages,
    selectedProvince,
    selectedRegency,
    selectedDistrict,
    selectedVillage,
    setSelectedProvince,
    setSelectedRegency,
    setSelectedDistrict,
    setSelectedVillage,
    handleProvinceChange,
    handleRegencyChange,
    handleDistrictChange,
    regionError,
    setRegionError,
  };
}
