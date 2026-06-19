import { api } from "@/lib/config";
import type {
  ProductResponse,
  GetAllProductsResponse,
  GetAllProductsParams,
} from "@/types/product.type";

export const productService = {
  async getAllProducts(
    params: GetAllProductsParams = {},
  ): Promise<GetAllProductsResponse> {
    const { data } = await api.get("/products/admin", {
      params,
    });
    return data;
  },

  async getActiveProducts(
    params: GetAllProductsParams = {},
  ): Promise<GetAllProductsResponse> {
    const { data } = await api.get("/products/admin/active", {
      params,
    });
    return data;
  },

  async getInactiveProducts(
    params: GetAllProductsParams = {},
  ): Promise<GetAllProductsResponse> {
    const { data } = await api.get("/products/admin/inactive", {
      params,
    });
    return data;
  },

  async getFeaturedProducts(): Promise<GetAllProductsResponse> {
    const { data } = await api.get("/products/featured");
    return data;
  },

  async getProductById(id: string): Promise<ProductResponse> {
    const { data } = await api.get(`/products/${id}`);
    console.log(data);
    return data;
  },

  async createProduct(formData: FormData) {
    const { data } = await api.post("/products", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  },

  async updateProduct(id: string, formData: FormData) {
    const { data } = await api.put(`/products/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  },

  async deleteProduct(id: string) {
    const { data } = await api.delete(`/products/${id}`);
    return data;
  },

  async bulkDeleteProducts(ids: string[]) {
    const { data } = await api.post("/products/bulk/delete", { ids });
    return data;
  },

  async bulkRestoreProducts(ids: string[]) {
    const { data } = await api.post("/products/bulk/restore", { ids });
    return data;
  },

  async bulkPermanentDeleteProducts(ids: string[]) {
    const { data } = await api.delete("/products/bulk/permanent", {
      data: { ids },
    });
    return data;
  },
};
