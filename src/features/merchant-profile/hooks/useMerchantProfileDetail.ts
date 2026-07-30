import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { useAuthStore } from "@/features/auth";
import type { MerchantUser } from "../types";
import type { Product } from "@/features/products/types";
import { toast } from "sonner";

export function useMerchantProfileDetail(
  merchantId: string | undefined,
  navigate: (path: string) => void
) {
  const { isAuthenticated } = useAuthStore();
  const [merchant, setMerchant] = useState<MerchantUser | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Product details / modal state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false);

  useEffect(() => {
    if (!merchantId) return;

    const fetchMerchantData = async () => {
      setLoading(true);
      try {
        const userDocRef = doc(db, "users", merchantId);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data() as MerchantUser;
          if (userData.role === "merchant") {
            setMerchant(userData);
          } else {
            toast.error("This user is not a merchant.");
            navigate("/explore");
          }
        } else {
          toast.error("Merchant not found.");
          navigate("/explore");
        }
      } catch (error) {
        console.error("Failed to load merchant profile:", error);
        toast.error("An error occurred while loading the merchant profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchMerchantData();
  }, [merchantId, navigate]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Store profile link successfully copied to clipboard!");
  };

  const getFullAddress = () => {
    if (!merchant?.profile?.address) return "-";
    const { detailAddress, villageName, districtName, regencyName, provinceName } =
      merchant.profile.address;
    
    return [detailAddress, villageName, districtName, regencyName, provinceName]
      .filter(Boolean)
      .join(", ");
  };

  const handleSelectProduct = (product: Product) => {
    if (!isAuthenticated) {
      setIsLoginPromptOpen(true);
      return;
    }
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleRequireAuth = () => {
    setIsLoginPromptOpen(true);
  };

  return {
    merchant,
    loading,
    selectedProduct,
    isProductModalOpen,
    setIsProductModalOpen,
    isLoginPromptOpen,
    setIsLoginPromptOpen,
    handleShare,
    getFullAddress,
    handleSelectProduct,
    handleRequireAuth,
  };
}
