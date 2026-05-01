import { useState } from "react";
import { useBannerStore } from "@/store/banner/useBannerStore";

// ==========================================
// CREATE BANNER
// ==========================================
export const useCreateBanner = () => {
  const createBanner = useBannerStore((state) => state.createBanner);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateBanner = async (payload: FormData) => {
    try {
      setLoading(true);
      setError(null);

      await createBanner(payload);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Create failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleCreateBanner, loading, error };
};

// ==========================================
// UPDATE BANNER
// ==========================================
export const useUpdateBanner = () => {
  const updateBanner = useBannerStore((state) => state.updateBanner);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdateBanner = async (id: string, payload: FormData) => {
    try {
      setLoading(true);
      setError(null);

      await updateBanner(id, payload);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Update failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleUpdateBanner, loading, error };
};

// ==========================================
// DELETE BANNER
// ==========================================
export const useDeleteBanner = () => {
  const deleteBanner = useBannerStore((state) => state.deleteBanner);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeleteBanner = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      await deleteBanner(id);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  return { handleDeleteBanner, loading, error };
};

// ==========================================
// BULK ACTIONS (DELETE / RESTORE / PERMANENT DELETE)
// ==========================================
export const useBannerBulkActions = () => {
  const bulkDelete = useBannerStore((s) => s.bulkDeleteBanners);
  const bulkRestore = useBannerStore((s) => s.bulkRestoreBanners);
  const bulkPermanentDelete = useBannerStore(
    (s) => s.bulkPermanentDeleteBanners,
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
