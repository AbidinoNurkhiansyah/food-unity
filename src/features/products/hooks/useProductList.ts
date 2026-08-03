import { useState, useEffect } from 'react';
import { useAuthStore } from '@/features/auth';
import { useMerchantProducts } from './useProducts';
import { dummyProducts } from '../data/dummyProducts';
import { productApi } from '../services/productApi';
import { toast } from 'sonner';
import { db } from '@/config/firebase';
import { doc, getDoc } from 'firebase/firestore';

export function useProductList() {
  const { user } = useAuthStore();
  const { data: products, isLoading, isError } = useMerchantProducts(user?.uid);

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "sold_out" | "expired">("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "discount" | "donation">("all");
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Real-time helper
  const [now] = useState(() => Date.now());

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, typeFilter]);

  // Dummy Seeding State
  const [isSeeding, setIsSeeding] = useState(false);

  const handleSeedData = async () => {
    if (!user) {
      toast.error("You must be logged in to seed data");
      return;
    }
    
    setIsSeeding(true);
    try {
      let merchantName = user.displayName || 'Partner';
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const profile = userDoc.data()?.profile;
          if (profile?.businessName) {
            merchantName = profile.businessName;
          }
        }
      } catch (profileError) {
        console.error('Error fetching merchant profile for seeding:', profileError);
      }
      for (const product of dummyProducts) {
        await productApi.createProduct(product, user.uid, merchantName, product.imageUrl);
      }
      toast.success("Dummy data successfully seeded!");
      window.location.reload();
    } catch (error) {
      console.error(error);
      toast.error("Failed to seed dummy data");
    } finally {
      setIsSeeding(false);
    }
  };

  // Safe products array
  const safeProducts = products || [];

  // Calculate Stats
  const totalProducts = safeProducts.length;
  const activeProducts = safeProducts.filter((p) => {
    const isExpired = p.pickupDeadline ? new Date(p.pickupDeadline).getTime() <= now : false;
    return p.status === "active" && p.stock > 0 && !isExpired;
  }).length;
  const soldOutProducts = safeProducts.filter((p) => p.status === "sold_out" || p.stock <= 0).length;
  const donationProducts = safeProducts.filter((p) => p.isDonation).length;

  const stats = { totalProducts, activeProducts, soldOutProducts, donationProducts };

  // Filter Products
  const filteredProducts = safeProducts.filter((product) => {
    // Search Query
    const matchesSearch =
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));

    // Status Filter
    const isExpired = product.pickupDeadline ? new Date(product.pickupDeadline).getTime() <= now : false;
    let matchesStatus = true;
    if (statusFilter === "active") {
      matchesStatus = product.status === "active" && product.stock > 0 && !isExpired;
    } else if (statusFilter === "sold_out") {
      matchesStatus = product.status === "sold_out" || product.stock <= 0;
    } else if (statusFilter === "expired") {
      matchesStatus = product.status === "expired" || isExpired;
    }

    // Type Filter
    let matchesType = true;
    if (typeFilter === "discount") {
      matchesType = !product.isDonation;
    } else if (typeFilter === "donation") {
      matchesType = product.isDonation;
    }

    return matchesSearch && matchesStatus && matchesType;
  });

  // Paginate Products
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return {
    products: safeProducts,
    isLoading,
    isError,
    // Filter functions
    searchQuery, setSearchQuery,
    statusFilter, setStatusFilter,
    typeFilter, setTypeFilter,
    // Pagination
    currentPage, setCurrentPage,
    totalPages, ITEMS_PER_PAGE,
    paginatedProducts, filteredProducts,
    // Extras
    stats,
    handleSeedData,
    isSeeding
  };
}
