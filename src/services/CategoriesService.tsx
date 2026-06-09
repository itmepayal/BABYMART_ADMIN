import { api } from "@/lib/config";

/* =========================================================
 * CATEGORY TYPES
 * =======================================================*/

export type CategoryType =
  | "baby-care"
  | "diapers"
  | "feeding"
  | "clothing"
  | "toys"
  | "health"
  | "bath"
  | "strollers"
  | "maternity"
  | "nursery"
  | "school"
  | "accessories";

export const CATEGORY_TYPES: CategoryType[] = [
  "baby-care",
  "diapers",
  "feeding",
  "clothing",
  "toys",
  "health",
  "bath",
  "strollers",
  "maternity",
  "nursery",
  "school",
  "accessories",
];

/* =========================================================
 * IMAGE
 * =======================================================*/

export interface CategoryImage {
  url: string;
  public_id: string;
}

/* =========================================================
 * CATEGORY
 * =======================================================*/

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image: CategoryImage;
  categoryType: CategoryType;
  parentCategory?: string | null;
  isFeatured: boolean;
  sortOrder: number;
  isActive: boolean;
  isDeleted: boolean;
  deletedAt?: string | null;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

/* =========================================================
 * REQUEST TYPES
 * =======================================================*/

export interface CreateCategoryPayload {
  name: string;
  description?: string;
  image: File;
  categoryType: CategoryType;
  parentCategory?: string;
  isFeatured?: boolean;
  sortOrder?: number;
  isActive?: boolean;
  seoTitle?: string;
  seoDescription?: string;
}

export interface UpdateCategoryPayload {
  name?: string;
  description?: string;
  image?: File;
  categoryType?: CategoryType;
  parentCategory?: string | null;
  isFeatured?: boolean;
  sortOrder?: number;
  isActive?: boolean;
  seoTitle?: string;
  seoDescription?: string;
}

export interface GetAllCategoriesParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  categoryType?: CategoryType;
  parentCategory?: string;
  isFeatured?: boolean;
}

/* =========================================================
 * RESPONSE TYPES
 * =======================================================*/

export interface PaginationMeta {
  total: number;
  page: number;
  pages: number;
}

export interface GetAllCategoriesResponse extends PaginationMeta {
  success: boolean;
  message: string;
  categories: Category[];
}

export interface GetCategoryResponse {
  success: boolean;
  message: string;
  category: Category;
}

export interface CategoryResponse {
  success: boolean;
  message: string;
  category: Category;
}

export interface BulkActionResponse {
  success: boolean;
  message: string;
}

/* =========================================================
 * CATEGORY SERVICES
 * =======================================================*/

export const categoryService = {
  /* ================= GET ALL ================= */

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

  /* ================= GET BY ID ================= */

  getCategoryById: async (id: string): Promise<GetCategoryResponse> => {
    const { data } = await api.get<GetCategoryResponse>(`/categories/${id}`);

    return data;
  },

  /* ================= CREATE ================= */

  createCategory: async (payload: FormData): Promise<CategoryResponse> => {
    const { data } = await api.post<CategoryResponse>("/categories", payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  },

  /* ================= UPDATE ================= */

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

  /* ================= DELETE ================= */

  deleteCategory: async (id: string): Promise<BulkActionResponse> => {
    const { data } = await api.delete<BulkActionResponse>(`/categories/${id}`);

    return data;
  },

  /* ================= BULK DELETE ================= */

  bulkDeleteCategories: async (ids: string[]): Promise<BulkActionResponse> => {
    const { data } = await api.patch<BulkActionResponse>(
      "/categories/bulk/delete",
      { ids },
    );

    return data;
  },

  /* ================= BULK RESTORE ================= */

  bulkRestoreCategories: async (ids: string[]): Promise<BulkActionResponse> => {
    const { data } = await api.patch<BulkActionResponse>(
      "/categories/bulk/restore",
      { ids },
    );

    return data;
  },

  /* ================= BULK PERMANENT DELETE ================= */

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
