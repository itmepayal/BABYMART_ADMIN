import { create } from "zustand";

import {
  orderService,
  type Order,
  type CreateOrderPayload,
  type UpdateOrderPayload,
  type GetAllOrdersParams,
} from "@/services/OrderService";

type OrderState = {
  orders: Order[];
  selectedOrder: Order | null;

  loading: boolean;
  isFetchingOrders: boolean;

  error: string | null;

  total: number;
  page: number;
  pages: number;

  // =========================================
  // ACTIONS
  // =========================================
  getAllOrders: (params?: GetAllOrdersParams) => Promise<void>;

  getMyOrders: () => Promise<void>;

  getOrderById: (id: string) => Promise<void>;

  createOrder: (payload: CreateOrderPayload) => Promise<void>;

  updateOrder: (id: string, payload: UpdateOrderPayload) => Promise<void>;

  deleteOrder: (id: string) => Promise<void>;

  bulkDeleteOrders: (ids: string[]) => Promise<void>;

  bulkUpdateOrderStatus: (
    ids: string[],
    orderStatus:
      | "PENDING"
      | "PROCESSING"
      | "SHIPPED"
      | "DELIVERED"
      | "CANCELLED",
  ) => Promise<void>;

  setOrders: (orders: Order[]) => void;

  clearSelectedOrder: () => void;

  clearError: () => void;
};

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  selectedOrder: null,

  loading: false,
  isFetchingOrders: false,

  error: null,

  total: 0,
  page: 1,
  pages: 1,

  // =========================================
  // GET ALL ORDERS
  // =========================================
  getAllOrders: async (params = {}) => {
    try {
      set({
        loading: true,
        isFetchingOrders: true,
        error: null,
      });

      const res = await orderService.getAllOrders(params);

      set({
        orders: res.data.orders,
        total: res.data.total,
        page: res.data.page,
        pages: res.data.pages,

        loading: false,
        isFetchingOrders: false,
      });
    } catch (err: any) {
      set({
        loading: false,
        isFetchingOrders: false,

        error: err?.response?.data?.message || "Failed to fetch orders",
      });
    }
  },

  // =========================================
  // GET MY ORDERS
  // =========================================
  getMyOrders: async () => {
    try {
      set({
        loading: true,
        error: null,
      });

      const res = await orderService.getMyOrders();

      set({
        orders: res.orders || res.data || [],
        loading: false,
      });
    } catch (err: any) {
      set({
        loading: false,

        error: err?.response?.data?.message || "Failed to fetch user orders",
      });
    }
  },

  // =========================================
  // GET ORDER BY ID
  // =========================================
  getOrderById: async (id) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const res = await orderService.getOrderById(id);
      console.log(res);

      set({
        selectedOrder: res,
        loading: false,
      });
    } catch (err: any) {
      set({
        loading: false,

        error: err?.response?.data?.message || "Failed to fetch order",
      });
    }
  },

  // =========================================
  // CREATE ORDER
  // =========================================
  createOrder: async (payload) => {
    try {
      set({
        loading: true,
        error: null,
      });

      await orderService.createOrder(payload);

      await get().getAllOrders();

      set({
        loading: false,
      });
    } catch (err: any) {
      set({
        loading: false,

        error: err?.response?.data?.message || "Failed to create order",
      });

      throw err;
    }
  },

  // =========================================
  // UPDATE ORDER
  // =========================================
  updateOrder: async (id, payload) => {
    try {
      set({
        loading: true,
        error: null,
      });

      await orderService.updateOrder(id, payload);

      await get().getAllOrders();

      set({
        loading: false,
      });
    } catch (err: any) {
      set({
        loading: false,

        error: err?.response?.data?.message || "Failed to update order",
      });

      throw err;
    }
  },

  // =========================================
  // DELETE ORDER
  // =========================================
  deleteOrder: async (id) => {
    const prevOrders = get().orders;

    set({
      orders: prevOrders.filter((order) => order._id !== id),
    });

    try {
      await orderService.deleteOrder(id);

      await get().getAllOrders();
    } catch (err: any) {
      set({
        orders: prevOrders,

        error: err?.response?.data?.message || "Failed to delete order",
      });
    }
  },

  // =========================================
  // BULK DELETE ORDERS
  // =========================================
  bulkDeleteOrders: async (ids) => {
    const prevOrders = get().orders;

    set({
      orders: prevOrders.filter((order) => !ids.includes(order._id)),
    });

    try {
      await orderService.bulkDeleteOrders(ids);

      await get().getAllOrders();
    } catch (err: any) {
      set({
        orders: prevOrders,

        error: err?.response?.data?.message || "Failed to bulk delete orders",
      });
    }
  },

  // =========================================
  // BULK UPDATE STATUS
  // =========================================
  bulkUpdateOrderStatus: async (ids, orderStatus) => {
    try {
      set({
        loading: true,
        error: null,
      });

      await orderService.bulkUpdateOrderStatus(ids, orderStatus);

      await get().getAllOrders();

      set({
        loading: false,
      });
    } catch (err: any) {
      set({
        loading: false,

        error: err?.response?.data?.message || "Failed to update order status",
      });
    }
  },

  // =========================================
  // SET ORDERS
  // =========================================
  setOrders: (orders) => {
    set({ orders });
  },

  // =========================================
  // CLEAR SELECTED ORDER
  // =========================================
  clearSelectedOrder: () => {
    set({
      selectedOrder: null,
    });
  },

  // =========================================
  // CLEAR ERROR
  // =========================================
  clearError: () => {
    set({
      error: null,
    });
  },
}));
