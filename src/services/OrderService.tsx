import { api } from "@/lib/config";

// =========================================
// TYPES
// =========================================
export type OrderItem = {
  productId: string;
  quantity: number;
  price: number;
};

export type ShippingAddress = {
  street: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export type Order = {
  _id: string;

  userId:
    | string
    | {
        _id: string;
        name: string;
        email: string;
      };

  items: {
    productId:
      | string
      | {
          _id: string;
          name: string;
          price: number;
          images?: {
            url: string;
            public_id: string;
          }[];
        };

    quantity: number;
    price: number;
  }[];

  shippingAddress: ShippingAddress;

  paymentMethod: "COD" | "CARD" | "UPI" | "PAYPAL";

  paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED";

  orderStatus: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  discountAmount: number;
  totalAmount: number;

  notes?: string;

  createdAt: string;
  updatedAt: string;
};

// =========================================
// PAYLOAD TYPES
// =========================================
export type CreateOrderPayload = {
  items: OrderItem[];

  shippingAddress: ShippingAddress;

  paymentMethod: "COD" | "CARD" | "UPI" | "PAYPAL";

  notes?: string;
};

export type UpdateOrderPayload = Partial<{
  orderStatus: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

  paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED";

  shippingAddress: ShippingAddress;

  notes: string;
}>;

// =========================================
// QUERY TYPES
// =========================================
export type GetAllOrdersParams = {
  page?: number;
  limit?: number;

  search?: string;

  orderStatus?: string;
  paymentStatus?: string;
  paymentMethod?: string;

  startDate?: string;
  endDate?: string;

  minAmount?: number;
  maxAmount?: number;

  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

// =========================================
// RESPONSE TYPES
// =========================================
export type GetAllOrdersResponse = {
  success: boolean;
  message: string;
  data: {
    orders: Order[];
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
};

// =========================================
// ORDER SERVICE
// =========================================
export const orderService = {
  // =========================================
  // GET ALL ORDERS
  // =========================================
  getAllOrders: async (
    params: GetAllOrdersParams = {},
  ): Promise<GetAllOrdersResponse> => {
    const { data } = await api.get("/orders", {
      params,
    });

    return data;
  },

  // =========================================
  // GET ALL ORDERS
  // =========================================
  getOrderById: async (id: string): Promise<Order> => {
    const { data } = await api.get(`/orders/${id}`);
    return data.data;
  },

  // =========================================
  // GET MY ORDERS
  // =========================================
  getMyOrders: async () => {
    const { data } = await api.get("/orders/me");

    return data;
  },

  // =========================================
  // CREATE ORDER
  // =========================================
  createOrder: async (payload: CreateOrderPayload) => {
    const { data } = await api.post("/orders", payload);

    return data;
  },

  // =========================================
  // UPDATE ORDER
  // =========================================
  updateOrder: async (id: string, payload: UpdateOrderPayload) => {
    const { data } = await api.patch(`/orders/${id}`, payload);

    return data;
  },

  // =========================================
  // DELETE ORDER
  // =========================================
  deleteOrder: async (id: string) => {
    const { data } = await api.delete(`/orders/${id}`);

    return data;
  },

  // =========================================
  // BULK DELETE ORDERS
  // =========================================
  bulkDeleteOrders: async (ids: string[]) => {
    const { data } = await api.post("/orders/bulk/delete", {
      ids,
    });

    return data;
  },

  // =========================================
  // BULK UPDATE STATUS
  // =========================================
  bulkUpdateOrderStatus: async (
    ids: string[],
    orderStatus:
      | "PENDING"
      | "PROCESSING"
      | "SHIPPED"
      | "DELIVERED"
      | "CANCELLED",
  ) => {
    const { data } = await api.patch("/orders/bulk/status", {
      ids,
      orderStatus,
    });

    return data;
  },
};
