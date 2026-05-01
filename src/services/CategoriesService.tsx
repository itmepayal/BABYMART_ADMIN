import { api } from "@/lib/config";

// ================= TYPES =================
export type Category = {
  categoryType: string;
  _id: string;
  name: string;
  description?: string;
  image?: {
    url: string;
    public_id: string;
  };
  isActive: boolean;
  isDeleted?: boolean;
  createdAt: string;
};

export type CreateCategoryPayload = {
  name: string;
  description?: string;
  image: File;
  isActive: boolean;
};

export type UpdateCategoryPayload = Partial<{
  name: string;
  description: string;
  image: File;
  isActive: boolean;
}>;

export type GetAllCategoriesParams = {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
};

export type GetAllCategoriesResponse = {
  success: boolean;
  message: string;
  categories: Category[];
  total: number;
  page: number;
  pages: number;
};

// ================= CATEGORY SERVICES =================
export const categoryService = {
  // ================= GET ALL =================
  getAllCategories: async (
    params: GetAllCategoriesParams = {},
  ): Promise<GetAllCategoriesResponse> => {
    const { page = 1, limit = 10, search = "", isActive } = params;

    const { data } = await api.get("/categories", {
      params: { page, limit, search, isActive },
    });

    return data;
  },

  // ================= GET BY ID =================
  getCategoryById: async (id: string) => {
    const { data } = await api.get(`/categories/${id}`);
    return data;
  },

  // ================= CREATE =================
  createCategory: async (payload: FormData) => {
    const { data } = await api.post("/categories", payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  },

  // ================= UPDATE =================
  updateCategory: async (id: string, payload: FormData) => {
    const { data } = await api.patch(`/categories/${id}`, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(data);
    return data;
  },

  // ================= SINGLE DELETE =================
  deleteCategory: async (id: string) => {
    const { data } = await api.delete(`/categories/${id}`);
    return data;
  },

  // ================= BULK DELETE =================
  bulkDeleteCategories: async (ids: string[]) => {
    const { data } = await api.patch("/categories/bulk/delete", { ids });
    return data;
  },

  // ================= BULK RESTORE =================
  bulkRestoreCategories: async (ids: string[]) => {
    const { data } = await api.patch("/categories/bulk/restore", { ids });
    return data;
  },

  // ================= BULK PERMANENT DELETE =================
  bulkPermanentDeleteCategories: async (ids: string[]) => {
    const { data } = await api.patch("/categories/bulk/permanent", { ids });
    return data;
  },
};
