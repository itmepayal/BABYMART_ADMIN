import { api } from "@/lib/config";

// =========================================
// ENUMS
// =========================================

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

// =========================================
// IMAGE TYPE
// =========================================

export type BannerImage = {
  url: string;
  public_id: string;
};

// =========================================
// BANNER TYPE
// =========================================

export type Banner = {
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
};

// =========================================
// CREATE PAYLOAD
// =========================================

export type CreateBannerPayload = {
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
};

// =========================================
// UPDATE PAYLOAD
// =========================================

export type UpdateBannerPayload = Partial<CreateBannerPayload>;

// =========================================
// QUERY PARAMS
// =========================================

export type GetAllBannersParams = {
  page?: number;
  limit?: number;
  search?: string;
  bannerType?: BannerType;
  isActive?: boolean;
  isFeatured?: boolean;
  sortBy?: BannerSortField;
  sortOrder?: SortOrder;
};

// =========================================
// PAGINATION RESPONSE
// =========================================

export type BannerPaginationData = {
  banners: Banner[];
  total: number;
  page: number;
  limit: number;
  pages: number;
};

// =========================================
// API RESPONSE
// =========================================

export type GetAllBannersResponse = {
  success: boolean;
  message: string;
  data: BannerPaginationData;
};

// =========================================
// BANNER SERVICE
// =========================================

export const bannerService = {
  // =====================================
  // GET ALL BANNERS
  // =====================================
  getAllBanners: async (
    params: GetAllBannersParams = {},
  ): Promise<GetAllBannersResponse> => {
    const { data } = await api.get<GetAllBannersResponse>("/banners/admin", {
      params,
    });

    console.log(data);

    return data;
  },

  // =====================================
  // GET ACTIVE BANNERS
  // =====================================

  getActiveBanners: async () => {
    const { data } = await api.get("/banners/active");
    return data;
  },

  // =====================================
  // GET BANNER BY ID
  // =====================================

  getBannerById: async (id: string) => {
    const { data } = await api.get(`/banners/${id}`);

    return data;
  },

  // =====================================
  // CREATE BANNER
  // =====================================

  createBanner: async (payload: FormData) => {
    try {
      const { data } = await api.post("/banners", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(data);

      return data;
    } catch (error) {
      console.log(error);
    }
  },

  // =====================================
  // UPDATE BANNER
  // =====================================

  updateBanner: async (id: string, payload: FormData) => {
    const { data } = await api.patch(`/banners/${id}`, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  },

  // =====================================
  // TOGGLE STATUS
  // =====================================

  toggleBannerStatus: async (id: string) => {
    const { data } = await api.patch(`/banners/toggle/${id}`);

    return data;
  },

  // =====================================
  // DELETE BANNER (SOFT DELETE)
  // =====================================

  deleteBanner: async (id: string) => {
    const { data } = await api.delete(`/banners/${id}`);

    return data;
  },

  // =====================================
  // BULK DELETE
  // =====================================

  bulkDeleteBanners: async (ids: string[]) => {
    const { data } = await api.patch("/banners/bulk/delete", {
      ids,
    });

    return data;
  },

  // =====================================
  // BULK RESTORE
  // =====================================

  bulkRestoreBanners: async (ids: string[]) => {
    const { data } = await api.patch("/banners/bulk/restore", {
      ids,
    });

    return data;
  },

  // =====================================
  // BULK PERMANENT DELETE
  // =====================================

  bulkPermanentDeleteBanners: async (ids: string[]) => {
    const { data } = await api.delete("/banners/bulk/permanent", {
      data: { ids },
    });

    return data;
  },
};
