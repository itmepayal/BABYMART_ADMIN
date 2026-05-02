import { useState } from "react";
import { useProductStore } from "@/store/product/useProductStore";

// ==========================================
// CREATE PRODUCT
// ==========================================
export const useCreateProduct = () => {
  const createProduct = useProductStore((s) => s.createProduct);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateProduct = async (payload: any) => {
    try {
      setLoading(true);
      setError(null);

      await createProduct(payload);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Create product failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleCreateProduct, loading, error };
};

// ==========================================
// UPDATE PRODUCT
// ==========================================
export const useUpdateProduct = () => {
  const updateProduct = useProductStore((s) => s.updateProduct);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdateProduct = async (id: string, payload: any) => {
    try {
      setLoading(true);
      setError(null);

      await updateProduct(id, payload);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Update product failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleUpdateProduct, loading, error };
};

// ==========================================
// DELETE PRODUCT
// ==========================================
export const useDeleteProduct = () => {
  const deleteProduct = useProductStore((s) => s.deleteProduct);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeleteProduct = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      await deleteProduct(id);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Delete product failed");
    } finally {
      setLoading(false);
    }
  };

  return { handleDeleteProduct, loading, error };
};

// ==========================================
// BULK ACTIONS
// ==========================================
export const useProductBulkActions = () => {
  const bulkDelete = useProductStore((s) => s.bulkDeleteProducts);
  const bulkRestore = useProductStore((s) => s.bulkRestoreProducts);
  const bulkPermanentDelete = useProductStore(
    (s) => s.bulkPermanentDeleteProducts,
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
