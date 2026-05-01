import { useState } from "react";
import { useCategoryStore } from "@/store/category/useCategory";

// ==========================================
// CREATE CATEGORY
// ==========================================
export const useCreateCategory = () => {
  const createCategory = useCategoryStore((s) => s.createCategory);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateCategory = async (payload: FormData) => {
    try {
      setLoading(true);
      setError(null);

      await createCategory(payload);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Create failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleCreateCategory, loading, error };
};

// ==========================================
// UPDATE CATEGORY
// ==========================================
export const useUpdateCategory = () => {
  const updateCategory = useCategoryStore((s) => s.updateCategory);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdateCategory = async (id: string, payload: FormData) => {
    try {
      setLoading(true);
      setError(null);

      await updateCategory(id, payload);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Update failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleUpdateCategory, loading, error };
};

// ==========================================
// DELETE CATEGORY
// ==========================================
export const useDeleteCategory = () => {
  const deleteCategory = useCategoryStore((s) => s.deleteCategory);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeleteCategory = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      await deleteCategory(id);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  return { handleDeleteCategory, loading, error };
};

// ==========================================
// BULK ACTIONS
// ==========================================
export const useCategoryBulkActions = () => {
  const bulkDelete = useCategoryStore((s) => s.bulkDeleteCategories);
  const bulkRestore = useCategoryStore((s) => s.bulkRestoreCategories);
  const bulkPermanentDelete = useCategoryStore(
    (s) => s.bulkPermanentDeleteCategories,
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBulkDelete = async (ids: string[]) => {
    try {
      setLoading(true);
      setError(null);

      await bulkDelete(ids);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Bulk delete failed");
    } finally {
      setLoading(false);
    }
  };

  const handleBulkRestore = async (ids: string[]) => {
    try {
      setLoading(true);
      setError(null);

      await bulkRestore(ids);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Restore failed");
    } finally {
      setLoading(false);
    }
  };

  const handleBulkPermanentDelete = async (ids: string[]) => {
    try {
      setLoading(true);
      setError(null);

      await bulkPermanentDelete(ids);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Permanent delete failed");
    } finally {
      setLoading(false);
    }
  };

  return {
    handleBulkDelete,
    handleBulkRestore,
    handleBulkPermanentDelete,
    loading,
    error,
  };
};
