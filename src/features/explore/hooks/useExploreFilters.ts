import { useState, useMemo } from "react";
import type { Product } from "@/features/products/types";

export const useExploreFilters = (products: Product[] | undefined) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceFilter, setPriceFilter] = useState<"all" | "paid" | "donation">("all");

  const filteredProducts = useMemo(() => {
    return products?.filter((product) => {
      // 1. Text Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = product.title.toLowerCase().includes(query);
        const matchMerchant = product.merchantName.toLowerCase().includes(query);
        const matchDesc =
          product.description?.toLowerCase().includes(query) || false;
        const matchCat = product.category?.toLowerCase().includes(query) || false;
        if (!matchTitle && !matchMerchant && !matchDesc && !matchCat) {
          return false;
        }
      }

      // 2. Category Filter
      if (selectedCategory !== "All") {
        if (product.category !== selectedCategory) {
          return false;
        }
      }

      // 3. Price/Type Filter
      if (priceFilter === "donation" && !product.isDonation) {
        return false;
      }
      if (priceFilter === "paid" && product.isDonation) {
        return false;
      }

      return true;
    });
  }, [products, searchQuery, selectedCategory, priceFilter]);

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    priceFilter,
    setPriceFilter,
    filteredProducts,
  };
};
