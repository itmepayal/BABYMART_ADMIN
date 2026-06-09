import { useEffect } from "react";

import { useOrderStore } from "@/store/order/useOrderStore";

// ==========================================
// USE ORDERS HOOK
// ==========================================
export const useOrders = () => {
  const {
    // =========================================
    // STATE
    // =========================================
    orders,
    selectedOrder,

    loading,
    error,

    total,
    page,
    pages,

    isFetchingOrders,

    // =========================================
    // ACTIONS
    // =========================================
    getAllOrders,
    getMyOrders,
    getOrderById,

    createOrder,
    updateOrder,

    deleteOrder,

    bulkDeleteOrders,
    bulkUpdateOrderStatus,
  } = useOrderStore();

  // ==========================================
  // AUTO FETCH
  // ==========================================
  useEffect(() => {
    getAllOrders({
      page: 1,
      limit: 10,
      search: "",
    });
  }, [getAllOrders]);

  return {
    // =========================================
    // STATE
    // =========================================
    orders,
    selectedOrder,

    loading,
    error,

    total,
    page,
    pages,

    isFetchingOrders,

    // =========================================
    // ACTIONS
    // =========================================
    refetch: getAllOrders,

    getMyOrders,
    getOrderById,

    createOrder,
    updateOrder,

    deleteOrder,

    bulkDeleteOrders,
    bulkUpdateOrderStatus,
  };
};
