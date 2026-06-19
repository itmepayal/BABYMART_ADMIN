import { create } from "zustand";
import { bannerService } from "@/services/BannerService";
import type { Banner, GetAllBannersParams } from "@/types/banner.type";

type BannerState = {
  banners: Banner[];
  selectedBanner: Banner | null;
  loading: boolean;
  isFetchingBanners: boolean;
  error: string | null;
  total: number;
  page: number;
  pages: number;
  getAllBanners: (params?: GetAllBannersParams) => Promise<void>;
  getBannerById: (id: string) => Promise<void>;
  createBanner: (payload: FormData) => Promise<void>;
  updateBanner: (id: string, payload: FormData) => Promise<void>;
  deleteBanner: (id: string) => Promise<void>;
  toggleBannerStatus: (id: string) => Promise<void>;
  bulkDeleteBanners: (ids: string[]) => Promise<void>;
  bulkRestoreBanners: (ids: string[]) => Promise<void>;
  bulkPermanentDeleteBanners: (ids: string[]) => Promise<void>;
  setBanners: (banners: Banner[]) => void;
};

export const useBannerStore = create<BannerState>((set, get) => ({
  banners: [],
  selectedBanner: null,

  loading: false,
  isFetchingBanners: false,
  error: null,

  total: 0,
  page: 1,
  pages: 1,

  getAllBanners: async (params = {}) => {
    try {
      set({
        loading: true,
        isFetchingBanners: true,
        error: null,
      });

      const res = await bannerService.getAllBanners(params);

      set({
        banners: res.data?.banners || [],
        total: res.data?.total || 0,
        page: res.data?.page || 1,
        pages: res.data?.pages || 1,

        loading: false,
        isFetchingBanners: false,
      });
    } catch (err: any) {
      set({
        loading: false,
        isFetchingBanners: false,
        error: err?.response?.data?.message || "Failed to fetch banners",
      });
    }
  },

  getBannerById: async (id: string) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const res = await bannerService.getBannerById(id);

      set({
        selectedBanner: res.data,
        loading: false,
      });
    } catch (err: any) {
      set({
        loading: false,
        error: err?.response?.data?.message || "Failed to fetch banner",
      });

      throw err;
    }
  },

  createBanner: async (payload: FormData) => {
    try {
      set({
        loading: true,
        error: null,
      });

      await bannerService.createBanner(payload);

      await get().getAllBanners();

      set({
        loading: false,
      });
    } catch (err: any) {
      set({
        loading: false,
        error: err?.response?.data?.message || "Failed to create banner",
      });

      throw err;
    }
  },

  updateBanner: async (id: string, payload: FormData) => {
    try {
      set({
        loading: true,
        error: null,
      });

      await bannerService.updateBanner(id, payload);

      await get().getAllBanners();

      set({
        loading: false,
      });
    } catch (err: any) {
      set({
        loading: false,
        error: err?.response?.data?.message || "Failed to update banner",
      });

      throw err;
    }
  },

  deleteBanner: async (id: string) => {
    const previousBanners = get().banners;

    set({
      banners: previousBanners.filter((banner) => banner._id !== id),
    });

    try {
      await bannerService.deleteBanner(id);

      await get().getAllBanners();
    } catch (err: any) {
      set({
        banners: previousBanners,
        error: err?.response?.data?.message || "Failed to delete banner",
      });

      throw err;
    }
  },

  toggleBannerStatus: async (id: string) => {
    try {
      set({
        loading: true,
        error: null,
      });

      await bannerService.toggleBannerStatus(id);

      await get().getAllBanners();

      set({
        loading: false,
      });
    } catch (err: any) {
      set({
        loading: false,
        error: err?.response?.data?.message || "Failed to toggle banner status",
      });

      throw err;
    }
  },

  bulkDeleteBanners: async (ids: string[]) => {
    const previousBanners = get().banners;

    set({
      banners: previousBanners.filter((banner) => !ids.includes(banner._id)),
    });

    try {
      await bannerService.bulkDeleteBanners(ids);

      await get().getAllBanners();
    } catch (err: any) {
      set({
        banners: previousBanners,
        error: err?.response?.data?.message || "Failed to bulk delete banners",
      });

      throw err;
    }
  },

  bulkRestoreBanners: async (ids: string[]) => {
    try {
      set({
        loading: true,
        error: null,
      });

      await bannerService.bulkRestoreBanners(ids);

      await get().getAllBanners();

      set({
        loading: false,
      });
    } catch (err: any) {
      set({
        loading: false,
        error: err?.response?.data?.message || "Failed to restore banners",
      });

      throw err;
    }
  },

  bulkPermanentDeleteBanners: async (ids: string[]) => {
    const previousBanners = get().banners;

    set({
      banners: previousBanners.filter((banner) => !ids.includes(banner._id)),
    });

    try {
      await bannerService.bulkPermanentDeleteBanners(ids);

      await get().getAllBanners();
    } catch (err: any) {
      set({
        banners: previousBanners,
        error:
          err?.response?.data?.message ||
          "Failed to permanently delete banners",
      });

      throw err;
    }
  },

  setBanners: (banners: Banner[]) => {
    set({ banners });
  },
}));
