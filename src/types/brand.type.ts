export const BRAND_CATEGORIES = [
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

export type BrandCategory = (typeof BRAND_CATEGORIES)[number];

export interface BrandImage {
  url: string;
  public_id: string;
}

export interface Brand {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  logo: BrandImage;
  banners?: BrandImage[];
  website?: string;
  category: BrandCategory;
  isFeatured: boolean;
  isVerified: boolean;
  isActive: boolean;
  sortOrder: number;
  isDeleted: boolean;
  deletedAt?: string | null;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBrandPayload {
  name: string;
  description?: string;
  website?: string;
  category: BrandCategory;
  isFeatured?: boolean;
  isVerified?: boolean;
  isActive?: boolean;
  sortOrder?: number;
  seoTitle?: string;
  seoDescription?: string;
  logo: File;
  banners?: File[];
}

export type UpdateBrandPayload = Partial<CreateBrandPayload>;

export interface GetAllBrandsParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: BrandCategory;
  isActive?: boolean;
  isFeatured?: boolean;
  isVerified?: boolean;
}

export interface BrandPaginationData {
  brands: Brand[];
  total: number;
  page: number;
  pages: number;
  limit: number;
}

export interface GetAllBrandsResponse {
  success: boolean;
  message: string;
  data: BrandPaginationData;
}
