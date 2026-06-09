import { useState } from "react";
import { useOrderStore } from "@/store/order/useOrderStore";
import type {
  CreateOrderPayload,
  UpdateOrderPayload,
} from "@/services/OrderService";

// ==========================================
// CREATE ORDER
// ==========================================
export const useCreateOrder = () => {
  const createOrder = useOrderStore((state) => state.createOrder);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const handleCreateOrder = async (payload: CreateOrderPayload) => {
    try {
      setLoading(true);

      setError(null);

      await createOrder(payload);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to create order");

      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    handleCreateOrder,
    loading,
    error,
  };
};

// ==========================================
// UPDATE ORDER
// ==========================================
export const useUpdateOrder = () => {
  const updateOrder = useOrderStore((state) => state.updateOrder);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const handleUpdateOrder = async (id: string, payload: UpdateOrderPayload) => {
    try {
      setLoading(true);

      setError(null);

      await updateOrder(id, payload);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to update order");

      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    handleUpdateOrder,
    loading,
    error,
  };
};

// ==========================================
// DELETE ORDER
// ==========================================
export const useDeleteOrder = () => {
  const deleteOrder = useOrderStore((state) => state.deleteOrder);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const handleDeleteOrder = async (id: string) => {
    try {
      setLoading(true);

      setError(null);

      await deleteOrder(id);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to delete order");
    } finally {
      setLoading(false);
    }
  };

  return {
    handleDeleteOrder,
    loading,
    error,
  };
};

// ==========================================
// BULK ACTIONS
// ==========================================
export const useOrderBulkActions = () => {
  const bulkDeleteOrders = useOrderStore((state) => state.bulkDeleteOrders);

  const bulkUpdateOrderStatus = useOrderStore(
    (state) => state.bulkUpdateOrderStatus,
  );

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  // ==========================================
  // BULK DELETE
  // ==========================================
  const handleBulkDeleteOrders = async (ids: string[]) => {
    try {
      setLoading(true);

      setError(null);

      await bulkDeleteOrders(ids);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Bulk delete failed");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // BULK UPDATE STATUS
  // ==========================================
  const handleBulkUpdateOrderStatus = async (
    ids: string[],
    orderStatus:
      | "PENDING"
      | "PROCESSING"
      | "SHIPPED"
      | "DELIVERED"
      | "CANCELLED",
  ) => {
    try {
      setLoading(true);

      setError(null);

      await bulkUpdateOrderStatus(ids, orderStatus);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to update order status");
    } finally {
      setLoading(false);
    }
  };

  return {
    handleBulkDeleteOrders,
    handleBulkUpdateOrderStatus,

    loading,
    error,
  };
};
