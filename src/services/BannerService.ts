import { api } from "@/lib/config";
import type {
  GetAllBannersParams,
  GetAllBannersResponse,
} from "@/types/banner.type";

export const bannerService = {
  getAllBanners: async (
    params: GetAllBannersParams = {},
  ): Promise<GetAllBannersResponse> => {
    const { data } = await api.get<GetAllBannersResponse>("/banners/admin", {
      params,
    });
    return data;
  },

  getActiveBanners: async () => {
    const { data } = await api.get("/banners/active");
    return data;
  },

  getBannerById: async (id: string) => {
    const { data } = await api.get(`/banners/${id}`);
    return data;
  },

  createBanner: async (payload: FormData) => {
    const { data } = await api.post("/banners", payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  },

  updateBanner: async (id: string, payload: FormData) => {
    const { data } = await api.patch(`/banners/${id}`, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  },

  toggleBannerStatus: async (id: string) => {
    const { data } = await api.patch(`/banners/toggle/${id}`);
    return data;
  },

  deleteBanner: async (id: string) => {
    const { data } = await api.delete(`/banners/${id}`);
    return data;
  },

  bulkDeleteBanners: async (ids: string[]) => {
    const { data } = await api.patch("/banners/bulk/delete", {
      ids,
    });
    return data;
  },

  bulkRestoreBanners: async (ids: string[]) => {
    const { data } = await api.patch("/banners/bulk/restore", {
      ids,
    });
    return data;
  },

  bulkPermanentDeleteBanners: async (ids: string[]) => {
    const { data } = await api.delete("/banners/bulk/permanent", {
      data: { ids },
    });
    return data;
  },
};
