import { api } from "@/lib/config";

import type {
  ProductResponse,
  GetAllProductsResponse,
  GetAllProductsParams,
} from "@/types/product";

// =========================================
// PRODUCT SERVICE
// =========================================
export const productService = {
  // =====================================
  // GET ALL PRODUCTS
  // =====================================
  async getAllProducts(
    params: GetAllProductsParams = {},
  ): Promise<GetAllProductsResponse> {
    const { data } = await api.get("/products/admin", {
      params,
    });

    return data;
  },

  // =====================================
  // ACTIVE PRODUCTS
  // =====================================
  async getActiveProducts(
    params: GetAllProductsParams = {},
  ): Promise<GetAllProductsResponse> {
    const { data } = await api.get("/products/admin/active", {
      params,
    });

    return data;
  },

  // =====================================
  // INACTIVE PRODUCTS
  // =====================================
  async getInactiveProducts(
    params: GetAllProductsParams = {},
  ): Promise<GetAllProductsResponse> {
    const { data } = await api.get("/products/admin/inactive", {
      params,
    });

    return data;
  },

  // =====================================
  // FEATURED PRODUCTS
  // =====================================
  async getFeaturedProducts(): Promise<GetAllProductsResponse> {
    const { data } = await api.get("/products/featured");

    return data;
  },

  // =====================================
  // GET PRODUCT
  // =====================================
  async getProductById(id: string): Promise<ProductResponse> {
    const { data } = await api.get(`/products/${id}`);
    console.log(data);
    return data;
  },

  // =====================================
  // CREATE PRODUCT
  // =====================================
  async createProduct(formData: FormData) {
    const { data } = await api.post("/products", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  },
  // =====================================
  // UPDATE PRODUCT
  // =====================================
  async updateProduct(id: string, formData: FormData) {
    const { data } = await api.put(`/products/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  },

  // =====================================
  // SOFT DELETE
  // =====================================
  async deleteProduct(id: string) {
    const { data } = await api.delete(`/products/${id}`);

    return data;
  },

  // =====================================
  // BULK DELETE
  // =====================================
  async bulkDeleteProducts(ids: string[]) {
    const { data } = await api.post("/products/bulk/delete", { ids });

    return data;
  },

  // =====================================
  // BULK RESTORE
  // =====================================
  async bulkRestoreProducts(ids: string[]) {
    const { data } = await api.post("/products/bulk/restore", { ids });

    return data;
  },

  // =====================================
  // BULK PERMANENT DELETE
  // =====================================
  async bulkPermanentDeleteProducts(ids: string[]) {
    const { data } = await api.delete("/products/bulk/permanent", {
      data: { ids },
    });

    return data;
  },
};
