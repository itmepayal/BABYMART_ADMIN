import { useState } from "react";
import { useBrandStore } from "@/store/brand/useBrandStore";

// ==========================================
// CREATE BRAND
// ==========================================
export const useCreateBrand = () => {
  const createBrand = useBrandStore((state) => state.createBrand);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateBrand = async (payload: any) => {
    try {
      setLoading(true);
      setError(null);

      await createBrand(payload);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Create failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleCreateBrand, loading, error };
};

// ==========================================
// UPDATE BRAND
// ==========================================
export const useUpdateBrand = () => {
  const updateBrand = useBrandStore((state) => state.updateBrand);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdateBrand = async (id: string, payload: any) => {
    try {
      setLoading(true);
      setError(null);

      await updateBrand(id, payload);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Update failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleUpdateBrand, loading, error };
};

// ==========================================
// DELETE BRAND
// ==========================================
export const useDeleteBrand = () => {
  const deleteBrand = useBrandStore((state) => state.deleteBrand);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeleteBrand = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      await deleteBrand(id);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  return { handleDeleteBrand, loading, error };
};

// ==========================================
// BULK ACTIONS
// ==========================================
export const useBrandBulkActions = () => {
  const bulkDelete = useBrandStore((s) => s.bulkDeleteBrands);
  const bulkRestore = useBrandStore((s) => s.bulkRestoreBrands);
  const bulkPermanentDelete = useBrandStore((s) => s.bulkPermanentDeleteBrands);

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
