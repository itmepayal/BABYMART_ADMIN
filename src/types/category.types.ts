export const CATEGORY_TYPES = [
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
] as const;

export type CategoryType = (typeof CATEGORY_TYPES)[number];

export interface CategoryImage {
  url: string;
  public_id: string;
}

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

export type UpdateCategoryPayload = Partial<CreateCategoryPayload> & {
  parentCategory?: string | null;
};

export interface GetAllCategoriesParams {
  page?: number;
  limit?: number;
  search?: string;

  isActive?: boolean;

  categoryType?: CategoryType;

  parentCategory?: string;

  isFeatured?: boolean;
}

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
