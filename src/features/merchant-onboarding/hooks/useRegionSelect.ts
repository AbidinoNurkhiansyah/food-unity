import { useState, useEffect } from "react";
import { toast } from "sonner";

export interface RegionItem {
  code: string;
  name: string;
}

const BACKEND_URL = import.meta.env.VITE_API_URL;

export function useRegionSelect() {
  const [provinces, setProvinces] = useState<RegionItem[]>([]);
  const [regencies, setRegencies] = useState<RegionItem[]>([]);
  const [districts, setDistricts] = useState<RegionItem[]>([]);
  const [villages, setVillages] = useState<RegionItem[]>([]);

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedRegency, setSelectedRegency] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedVillage, setSelectedVillage] = useState("");
  const [regionError, setRegionError] = useState("");

  // Fetch Provinsi Pertama kali
  useEffect(() => {
    fetch(`${BACKEND_URL}/api/location/provinces`)
      .then((res) => res.json())
      .then((data) => setProvinces(data.data || []))
      .catch((err) => {
        console.error("Failed to fetch province data:", err);
        toast.error("Failed to load region list. Please refresh the page.");
      });
  }, []);

  // Fetch Kabupaten/Kota saat Provinsi berubah
  useEffect(() => {
    if (!selectedProvince) return;
    fetch(`${BACKEND_URL}/api/location/regencies/${selectedProvince}`)
      .then((res) => res.json())
      .then((data) => setRegencies(data.data || []))
      .catch((err) =>
        console.error("Failed to fetch regency/city data:", err)
      );
  }, [selectedProvince]);

  // Fetch Kecamatan saat Kabupaten/Kota berubah
  useEffect(() => {
    if (!selectedRegency) return;
    fetch(`${BACKEND_URL}/api/location/districts/${selectedRegency}`)
      .then((res) => res.json())
      .then((data) => setDistricts(data.data || []))
      .catch((err) => console.error("Failed to fetch district data:", err));
  }, [selectedRegency]);

  // Fetch Kelurahan/Desa saat Kecamatan berubah
  useEffect(() => {
    if (!selectedDistrict) return;
    fetch(`${BACKEND_URL}/api/location/villages/${selectedDistrict}`)
      .then((res) => res.json())
      .then((data) => setVillages(data.data || []))
      .catch((err) =>
        console.error("Failed to fetch village data:", err)
      );
  }, [selectedDistrict]);

  // Handlers untuk perubahan wilayah administratif
  const handleProvinceChange = (provinceId: string) => {
    setSelectedProvince(provinceId);
    setSelectedRegency("");
    setRegencies([]);
    setSelectedDistrict("");
    setDistricts([]);
    setSelectedVillage("");
    setVillages([]);
  };

  const handleRegencyChange = (regencyId: string) => {
    setSelectedRegency(regencyId);
    setSelectedDistrict("");
    setDistricts([]);
    setSelectedVillage("");
    setVillages([]);
  };

  const handleDistrictChange = (districtId: string) => {
    setSelectedDistrict(districtId);
    setSelectedVillage("");
    setVillages([]);
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
    setSelectedVillage,
    handleProvinceChange,
    handleRegencyChange,
    handleDistrictChange,
    regionError,
    setRegionError,
  };
}
