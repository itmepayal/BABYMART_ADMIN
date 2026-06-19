export const BannerType = {
  HOME: "home",
  OFFER: "offer",
  CATEGORY: "category",
  PRODUCT: "product",
  FLASH_SALE: "flash-sale",
  SEASONAL: "seasonal",
} as const;

export type BannerType = (typeof BannerType)[keyof typeof BannerType];

export const SortOrder = {
  ASC: "asc",
  DESC: "desc",
} as const;

export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];

export const BannerSortField = {
  CREATED_AT: "createdAt",
  UPDATED_AT: "updatedAt",
  PRIORITY: "priority",
  TITLE: "title",
  NAME: "name",
} as const;

export type BannerSortField =
  (typeof BannerSortField)[keyof typeof BannerSortField];

export interface BannerImage {
  url: string;
  public_id: string;
}

export interface Banner {
  _id: string;
  name: string;
  title: string;
  subtitle?: string;
  description?: string;
  slug: string;
  desktopImage: BannerImage;
  mobileImage?: BannerImage;

  bannerType: BannerType;

  redirectUrl?: string;
  buttonText?: string;

  startFrom?: string;
  discountPercentage?: number;

  priority: number;

  startDate?: string;
  endDate?: string;

  isFeatured: boolean;
  isActive: boolean;
  isDeleted: boolean;

  deletedAt: string | null;

  seoTitle?: string;
  seoDescription?: string;

  createdAt: string;
  updatedAt: string;
}

export interface CreateBannerPayload {
  name: string;
  title: string;
  subtitle?: string;
  description?: string;

  bannerType: BannerType;

  redirectUrl?: string;
  buttonText?: string;

  startFrom?: string;
  discountPercentage?: number;

  priority?: number;

  startDate?: string;
  endDate?: string;

  isFeatured?: boolean;
  isActive?: boolean;

  seoTitle?: string;
  seoDescription?: string;

  desktopImage: File;
  mobileImage?: File;
}

export type UpdateBannerPayload = Partial<CreateBannerPayload>;

export interface GetAllBannersParams {
  page?: number;
  limit?: number;
  search?: string;

  bannerType?: BannerType;

  isActive?: boolean;
  isFeatured?: boolean;

  sortBy?: BannerSortField;
  sortOrder?: SortOrder;
}

export interface BannerPaginationData {
  banners: Banner[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface GetAllBannersResponse {
  success: boolean;
  message: string;
  data: BannerPaginationData;
}
