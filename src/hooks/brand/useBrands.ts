import { useEffect } from "react";
import { useBrandStore } from "@/store/brand/useBrandStore";

export const useBrands = () => {
  const {
    brands,
    selectedBrand,
    loading,
    error,
    total,
    page,
    pages,
    isFetchingBrands,

    getAllBrands,
    getBrandById,
    createBrand,
    updateBrand,
    deleteBrand,

    bulkDeleteBrands,
    bulkRestoreBrands,
    bulkPermanentDeleteBrands,
  } = useBrandStore();

  // ================= AUTO FETCH =================
  useEffect(() => {
    getAllBrands();
  }, []);

  return {
    // ================= STATE =================
    brands,
    selectedBrand,
    loading,
    error,
    total,
    page,
    pages,
    isFetchingBrands,

    // ================= ACTIONS =================
    refetch: getAllBrands,
    getBrandById,
    createBrand,
    updateBrand,
    deleteBrand,

    bulkDeleteBrands,
    bulkRestoreBrands,
    bulkPermanentDeleteBrands,
  };
};
