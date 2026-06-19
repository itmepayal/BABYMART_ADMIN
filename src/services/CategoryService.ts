import { api } from "@/lib/config";
import type {
  BulkActionResponse,
  CategoryResponse,
  GetAllCategoriesParams,
  GetAllCategoriesResponse,
} from "@/types/category.types";

export const categoryService = {
  getAllCategories: async (
    params: GetAllCategoriesParams = {},
  ): Promise<GetAllCategoriesResponse> => {
    const {
      page = 1,
      limit = 10,
      search = "",
      isActive,
      categoryType,
      parentCategory,
      isFeatured,
    } = params;

    const { data } = await api.get<GetAllCategoriesResponse>(
      "/categories/admin",
      {
        params: {
          page,
          limit,
          search,
          isActive,
          categoryType,
          parentCategory,
          isFeatured,
        },
      },
    );

    return data;
  },

  getCategoryById: async (id: string): Promise<void> => {
    const { data } = await api.get<void>(`/categories/${id}`);
    return data;
  },

  createCategory: async (payload: FormData): Promise<CategoryResponse> => {
    const { data } = await api.post<CategoryResponse>("/categories", payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  },

  updateCategory: async (
    id: string,
    payload: FormData,
  ): Promise<CategoryResponse> => {
    const { data } = await api.patch<CategoryResponse>(
      `/categories/${id}`,
      payload,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return data;
  },

  deleteCategory: async (id: string): Promise<BulkActionResponse> => {
    const { data } = await api.delete<BulkActionResponse>(`/categories/${id}`);
    return data;
  },

  bulkDeleteCategories: async (ids: string[]): Promise<BulkActionResponse> => {
    const { data } = await api.patch<BulkActionResponse>(
      "/categories/bulk/delete",
      { ids },
    );
    return data;
  },

  bulkRestoreCategories: async (ids: string[]): Promise<BulkActionResponse> => {
    const { data } = await api.patch<BulkActionResponse>(
      "/categories/bulk/restore",
      { ids },
    );
    return data;
  },

  bulkPermanentDeleteCategories: async (
    ids: string[],
  ): Promise<BulkActionResponse> => {
    const { data } = await api.patch<BulkActionResponse>(
      "/categories/bulk/permanent",
      { ids },
    );
    return data;
  },
};
