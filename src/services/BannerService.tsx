import { api } from "@/lib/config";

// ================= IMAGE TYPE =================
export type BannerImage = {
  url: string;
  public_id: string;
};

// ================= TYPES =================
export type Banner = {
  _id: string;
  name: string;
  title: string;
  startFrom: string;
  image: BannerImage;
  bannerType: "home" | "offer" | "category" | "product";
  isActive: boolean;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

// ================= CREATE =================
export type CreateBannerPayload = {
  name: string;
  title: string;
  startFrom: string;
  bannerType: Banner["bannerType"];
  isActive?: boolean;
  image: File;
};

// ================= UPDATE =================
export type UpdateBannerPayload = Partial<{
  name: string;
  title: string;
  startFrom: string;
  bannerType: Banner["bannerType"];
  isActive: boolean;
  image: File;
}>;

// ================= QUERY PARAMS =================
type GetAllBannersParams = {
  page?: number;
  limit?: number;
  search?: string;
};

// ================= RESPONSE =================
type GetAllBannersResponse = {
  success: boolean;
  message: string;
  data: {
    banners: Banner[];
    total: number;
    page: number;
    pages: number;
  };
};

// ================= BANNER SERVICE =================
export const bannerService = {
  // =========================================
  // GET ALL BANNERS
  // =========================================
  getAllBanners: async (
    params: GetAllBannersParams = {},
  ): Promise<GetAllBannersResponse> => {
    const { page = 1, limit = 10, search = "" } = params;

    const { data } = await api.get("/banners", {
      params: { page, limit, search },
    });
    return data;
  },

  // =========================================
  // GET ACTIVE BANNERS
  // =========================================
  getActiveBanners: async () => {
    const { data } = await api.get("/banners/active");
    return data;
  },

  // =========================================
  // GET BY ID
  // =========================================
  getBannerById: async (id: string) => {
    const { data } = await api.get(`/banners/${id}`);
    return data;
  },

  // =========================================
  // CREATE BANNER
  // =========================================
  createBanner: async (payload: FormData) => {
    const { data } = await api.post("/banners", payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  },

  // =========================================
  // UPDATE BANNER
  // =========================================
  updateBanner: async (id: string, payload: FormData) => {
    const { data } = await api.patch(`/banners/${id}`, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  },

  // =========================================
  // TOGGLE STATUS
  // =========================================
  toggleBannerStatus: async (id: string) => {
    const { data } = await api.patch(`/banners/toggle/${id}`);
    return data;
  },

  // =========================================
  // SINGLE DELETE (SOFT DELETE)
  // =========================================
  deleteBanner: async (id: string) => {
    const { data } = await api.delete(`/banners/${id}`);
    return data;
  },

  // =========================================
  // BULK DELETE
  // =========================================
  bulkDeleteBanners: async (ids: string[]) => {
    const { data } = await api.patch("/banners/bulk/delete", { ids });
    return data;
  },

  // =========================================
  // BULK RESTORE
  // =========================================
  bulkRestoreBanners: async (ids: string[]) => {
    const { data } = await api.patch("/banners/bulk/restore", { ids });
    return data;
  },

  // =========================================
  // BULK PERMANENT DELETE
  // =========================================
  bulkPermanentDeleteBanners: async (ids: string[]) => {
    const { data } = await api.delete("/banners/bulk/permanent", {
      data: { ids },
    });

    return data;
  },
};
