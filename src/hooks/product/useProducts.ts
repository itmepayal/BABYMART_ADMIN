import { useEffect } from "react";
import { useProductStore } from "@/store/product/useProductStore";

export const useProducts = (params?: any) => {
  const {
    products,
    selectedProduct,
    loading,
    error,
    total,
    page,
    pages,
    isFetchingProducts,

    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,

    bulkDeleteProducts,
    bulkRestoreProducts,
    bulkPermanentDeleteProducts,
  } = useProductStore();

  // ================= AUTO FETCH =================
  useEffect(() => {
    getAllProducts(params);
  }, [JSON.stringify(params)]);

  return {
    // ================= STATE =================
    products,
    selectedProduct,
    loading,
    error,
    total,
    page,
    pages,
    isFetchingProducts,

    // ================= ACTIONS =================
    refetch: getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,

    bulkDeleteProducts,
    bulkRestoreProducts,
    bulkPermanentDeleteProducts,
  };
};
