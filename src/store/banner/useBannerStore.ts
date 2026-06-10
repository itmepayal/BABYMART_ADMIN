import { create } from "zustand";
import { bannerService } from "@/services/BannerService";

// ================= TYPES =================
export type Banner = {
  isFeatured: any;
  bannerType: string;
  _id: string;

  name: string;
  title: string;
  description?: string;

  desktopImage: {
    url: string;
    public_id: string;
  };

  mobileImage?: {
    url: string;
    public_id: string;
  };

  startFrom?: string | Date;
  endAt?: string | Date;

  isActive: boolean;
  isDeleted?: boolean;

  createdAt: string | Date;
  updatedAt: string | Date;
};

// ================= STORE STATE =================
type BannerState = {
  banners: Banner[];
  selectedBanner: Banner | null;

  loading: boolean;
  isFetchingBanners: boolean;
  error: string | null;

  total: number;
  page: number;
  pages: number;

  // ================= ACTIONS =================
  getAllBanners: (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }) => Promise<void>;

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

// ================= STORE =================
export const useBannerStore = create<BannerState>((set, get) => ({
  banners: [],
  selectedBanner: null,

  loading: false,
  isFetchingBanners: false,
  error: null,

  total: 0,
  page: 1,
  pages: 1,

  // =========================================
  // GET ALL BANNERS
  // =========================================
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

  // =========================================
  // GET BANNER BY ID
  // =========================================
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

  // =========================================
  // CREATE BANNER
  // =========================================
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

  // =========================================
  // UPDATE BANNER
  // =========================================
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

  // =========================================
  // DELETE BANNER (SOFT DELETE)
  // =========================================
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

  // =========================================
  // TOGGLE STATUS
  // =========================================
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

  // =========================================
  // BULK DELETE
  // =========================================
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

  // =========================================
  // BULK RESTORE
  // =========================================
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

  // =========================================
  // BULK PERMANENT DELETE
  // =========================================
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

  // =========================================
  // SET BANNERS MANUALLY
  // =========================================
  setBanners: (banners: Banner[]) => {
    set({ banners });
  },
}));
