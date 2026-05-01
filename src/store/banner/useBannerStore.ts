import { create } from "zustand";
import { bannerService, type Banner } from "@/services/BannerService";

// ================= STATE TYPE =================
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
      set({ loading: true, isFetchingBanners: true });

      const res = await bannerService.getAllBanners(params);

      set({
        banners: res.data.banners,
        total: res.data.total,
        page: res.data.page,
        pages: res.data.pages,
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
  // GET BY ID
  // =========================================
  getBannerById: async (id) => {
    try {
      set({ loading: true });

      const res = await bannerService.getBannerById(id);
      console.log(res.data);
      set({
        selectedBanner: res.data,
        loading: false,
      });
      return res;
    } catch (err: any) {
      set({
        loading: false,
        error: err?.response?.data?.message || "Failed to fetch banner",
      });
    }
  },

  // =========================================
  // CREATE
  // =========================================
  createBanner: async (payload) => {
    try {
      set({ loading: true });

      await bannerService.createBanner(payload);

      await get().getAllBanners();

      set({ loading: false });
    } catch (err: any) {
      set({
        loading: false,
        error: err?.response?.data?.message || "Create failed",
      });
      throw err;
    }
  },

  // =========================================
  // UPDATE
  // =========================================
  updateBanner: async (id, payload) => {
    try {
      set({ loading: true });

      await bannerService.updateBanner(id, payload);

      await get().getAllBanners();

      set({ loading: false });
    } catch (err: any) {
      set({
        loading: false,
        error: err?.response?.data?.message || "Update failed",
      });
      throw err;
    }
  },

  // =========================================
  // DELETE (SOFT)
  // =========================================
  deleteBanner: async (id) => {
    const prev = get().banners;

    set({
      banners: prev.filter((b) => b._id !== id),
    });

    try {
      await bannerService.deleteBanner(id);
      await get().getAllBanners();
    } catch (err: any) {
      set({
        banners: prev,
        error: err?.response?.data?.message || "Delete failed",
      });
    }
  },

  // =========================================
  // TOGGLE STATUS
  // =========================================
  toggleBannerStatus: async (id) => {
    try {
      await bannerService.toggleBannerStatus(id);
      await get().getAllBanners();
    } catch (err: any) {
      set({
        error: err?.response?.data?.message || "Status update failed",
      });
    }
  },

  // =========================================
  // BULK DELETE
  // =========================================
  bulkDeleteBanners: async (ids) => {
    const prev = get().banners;

    set({
      banners: prev.filter((b) => !ids.includes(b._id)),
    });

    try {
      await bannerService.bulkDeleteBanners(ids);
      await get().getAllBanners();
    } catch (err: any) {
      set({
        banners: prev,
        error: err?.response?.data?.message || "Bulk delete failed",
      });
    }
  },

  // =========================================
  // BULK RESTORE
  // =========================================
  bulkRestoreBanners: async (ids) => {
    try {
      await bannerService.bulkRestoreBanners(ids);
      await get().getAllBanners();
    } catch (err: any) {
      set({
        error: err?.response?.data?.message || "Restore failed",
      });
    }
  },

  // =========================================
  // BULK PERMANENT DELETE
  // =========================================
  bulkPermanentDeleteBanners: async (ids) => {
    const prev = get().banners;

    set({
      banners: prev.filter((b) => !ids.includes(b._id)),
    });

    try {
      await bannerService.bulkPermanentDeleteBanners(ids);
      await get().getAllBanners();
    } catch (err: any) {
      set({
        banners: prev,
        error: err?.response?.data?.message || "Permanent delete failed",
      });
    }
  },

  // =========================================
  // SET MANUALLY
  // =========================================
  setBanners: (banners) => set({ banners }),
}));
