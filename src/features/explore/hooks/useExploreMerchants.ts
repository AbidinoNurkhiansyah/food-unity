import { useQuery } from "@tanstack/react-query";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/config/firebase";
import type { MerchantUser } from "@/features/merchant-profile/types";

export const useExploreMerchants = () => {
  return useQuery<MerchantUser[]>({
    queryKey: ["merchants", "explore"],
    queryFn: async () => {
      const q = query(collection(db, "users"), where("role", "==", "merchant"));
      const querySnapshot = await getDocs(q);
      const merchants: MerchantUser[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Only include merchants that have completed onboarding or have coordinates
        merchants.push({
          uid: doc.id,
          ...data,
        } as MerchantUser);
      });
      return merchants;
    },
  });
};
