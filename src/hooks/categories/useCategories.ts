import { useEffect } from "react";
import { useCategoryStore } from "@/store/category/useCategory";

export const useCategories = () => {
  const {
    categories,
    selectedCategory,
    loading,
    error,
    total,
    page,
    pages,
    isFetchingCategories,

    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,

    bulkDeleteCategories,
    bulkRestoreCategories,
    bulkPermanentDeleteCategories,
  } = useCategoryStore();

  // ================= AUTO FETCH =================
  useEffect(() => {
    getAllCategories({
      page: 1,
      limit: 10,
      search: "",
    });
  }, [getAllCategories]);

  return {
    // ================= STATE =================
    categories,
    selectedCategory,
    loading,
    error,
    total,
    page,
    pages,
    isFetchingCategories,

    // ================= ACTIONS =================
    refetch: getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,

    bulkDeleteCategories,
    bulkRestoreCategories,
    bulkPermanentDeleteCategories,
  };
};
