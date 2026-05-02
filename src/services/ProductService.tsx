import { api } from "@/lib/config";

// ================= TYPES =================
export type ProductImage = {
  url: string;
  public_id: string;
};

export type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  images: ProductImage[];
  discountPercentage: number;
  stock: number;
  averageRating: number;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

// ================= PAYLOAD TYPES =================
export type CreateProductPayload = {
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  images: File[];
  discountPercentage?: number;
  stock: number;
};

export type UpdateProductPayload = Partial<CreateProductPayload>;

// ================= QUERY TYPES =================
export type GetAllProductsParams = {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStock?: boolean;
};

// ================= RESPONSE TYPES =================
export type GetAllProductsResponse = {
  success: boolean;
  message: string;
  products: Product[];
  total: number;
  page: number;
  pages: number;
  limit: number;
};

// ================= PRODUCT SERVICE =================
export const productService = {
  // ================= GET ALL =================
  getAllProducts: async (
    params: GetAllProductsParams = {},
  ): Promise<GetAllProductsResponse> => {
    const { data } = await api.get("/products", { params });
    return data;
  },

  // ================= GET BY ID =================
  getProductById: async (id: string) => {
    const { data } = await api.get(`/products/${id}`);
    return data;
  },

  // ================= CREATE =================
  createProduct: async (payload: CreateProductPayload) => {
    console.log(payload);
    const { data } = await api.post("/products", payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return data;
  },

  // ================= UPDATE =================
  updateProduct: async (id: string, payload: any) => {
    const { data } = await api.put(`/products/${id}`, payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return data;
  },

  // ================= SINGLE DELETE =================
  deleteProduct: async (id: string) => {
    const { data } = await api.delete(`/products/${id}`);
    return data;
  },

  // ================= BULK DELETE =================
  bulkDeleteProducts: async (ids: string[]) => {
    const { data } = await api.post("/products/bulk/delete", { ids });
    return data;
  },

  // ================= BULK RESTORE =================
  bulkRestoreProducts: async (ids: string[]) => {
    const { data } = await api.post("/products/bulk/restore", { ids });
    return data;
  },

  // ================= BULK PERMANENT DELETE =================
  bulkPermanentDeleteProducts: async (ids: string[]) => {
    const { data } = await api.patch("/products/bulk/permanent", { ids });
    return data;
  },
};
