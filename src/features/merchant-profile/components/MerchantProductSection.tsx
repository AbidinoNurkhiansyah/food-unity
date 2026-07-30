import React from "react";
import { ProductGrid } from "@/features/explore";
import type { Product } from "@/features/products/types";

interface MerchantProductSectionProps {
  businessName?: string;
  merchantName: string;
  activeProducts: Product[];
  isLoadingProducts: boolean;
  onSelectProduct: (product: Product) => void;
  onRequireAuth: () => void;
}

export const MerchantProductSection: React.FC<MerchantProductSectionProps> = ({
  businessName,
  merchantName,
  activeProducts,
  isLoadingProducts,
  onSelectProduct,
  onRequireAuth,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-md font-black text-slate-900 tracking-tight">
            Available Packages
          </h2>
          <p className="text-slate-500 text-xs mt-0.5">
            Choose food packages from {businessName || merchantName} and help
            save food!
          </p>
        </div>
      </div>

      <ProductGrid
        products={activeProducts}
        isLoading={isLoadingProducts}
        onSelectProduct={onSelectProduct}
        onRequireAuth={onRequireAuth}
        variant="compact"
      />
    </div>
  );
};
