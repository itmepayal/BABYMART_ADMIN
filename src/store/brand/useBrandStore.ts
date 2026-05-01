import { create } from "zustand";
import { brandService } from "@/services/BrandService";

type Brand = {
  _id: string;
  name: string;
  images: { url: string; public_id: string }[];
  isActive: boolean;
  isDeleted?: boolean;
};

type BrandState = {
  brands: Brand[];
  selectedBrand: Brand | null;

  loading: boolean;
  isFetchingBrands: boolean;
  error: string | null;

  total: number;
  page: number;
  pages: number;

  // ================= ACTIONS =================
  getAllBrands: (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }) => Promise<void>;
  getBrandById: (id: string) => Promise<void>;
  createBrand: (payload: any) => Promise<void>;
  updateBrand: (id: string, payload: any) => Promise<void>;

  deleteBrand: (id: string) => Promise<void>;

  bulkDeleteBrands: (ids: string[]) => Promise<void>;
  bulkRestoreBrands: (ids: string[]) => Promise<void>;
  bulkPermanentDeleteBrands: (ids: string[]) => Promise<void>;

  setBrands: (brands: Brand[]) => void;
};

export const useBrandStore = create<BrandState>((set, get) => ({
  brands: [],
  selectedBrand: null,

  loading: false,
  isFetchingBrands: false,
  error: null,

  total: 0,
  page: 1,
  pages: 1,

  // ================= GET ALL =================
  getAllBrands: async () => {
    try {
      set({ loading: true, isFetchingBrands: true });

      const res = await brandService.getAllBrands();

      set({
        brands: res.brands,
        total: res.total,
        page: res.page,
        pages: res.pages,
        loading: false,
        isFetchingBrands: false,
      });
    } catch (err: any) {
      set({
        loading: false,
        isFetchingBrands: false,
        error: err?.response?.data?.message || "Failed to fetch brands",
      });
    }
  },

  // ================= GET BY ID =================
  getBrandById: async (id) => {
    try {
      set({ loading: true });

      const res = await brandService.getBrandById(id);

      set({
        selectedBrand: res.data,
        loading: false,
      });
    } catch (err: any) {
      set({
        loading: false,
        error: err?.response?.data?.message || "Failed to fetch brand",
      });
    }
  },

  // ================= CREATE =================
  createBrand: async (payload) => {
    try {
      set({ loading: true });

      await brandService.createBrand(payload);

      await get().getAllBrands();

      set({ loading: false });
    } catch (err: any) {
      set({
        loading: false,
        error: err?.response?.data?.message || "Create failed",
      });
      throw err;
    }
  },

  // ================= UPDATE =================
  updateBrand: async (id, payload) => {
    try {
      set({ loading: true });

      await brandService.updateBrand(id, payload);

      await get().getAllBrands();

      set({ loading: false });
    } catch (err: any) {
      set({
        loading: false,
        error: err?.response?.data?.message || "Update failed",
      });
      throw err;
    }
  },

  // ================= SINGLE DELETE =================
  deleteBrand: async (id) => {
    const prev = get().brands;

    set({ brands: prev.filter((b) => b._id !== id) });

    try {
      await brandService.deleteBrand(id);
      await get().getAllBrands();
    } catch (err: any) {
      set({
        brands: prev,
        error: err?.response?.data?.message || "Delete failed",
      });
    }
  },

  // ================= BULK DELETE =================
  bulkDeleteBrands: async (ids) => {
    const prev = get().brands;

    set({ brands: prev.filter((b) => !ids.includes(b._id)) });

    try {
      await brandService.bulkDeleteBrands(ids);
      await get().getAllBrands();
    } catch (err: any) {
      set({
        brands: prev,
        error: err?.response?.data?.message || "Bulk delete failed",
      });
    }
  },

  // ================= BULK RESTORE =================
  bulkRestoreBrands: async (ids) => {
    try {
      await brandService.bulkRestoreBrands(ids);
      await get().getAllBrands();
    } catch (err: any) {
      set({
        error: err?.response?.data?.message || "Restore failed",
      });
    }
  },

  // ================= BULK PERMANENT DELETE =================
  bulkPermanentDeleteBrands: async (ids) => {
    const prev = get().brands;

    set({ brands: prev.filter((b) => !ids.includes(b._id)) });

    try {
      await brandService.bulkPermanentDeleteBrands(ids);
      await get().getAllBrands();
    } catch (err: any) {
      set({
        brands: prev,
        error: err?.response?.data?.message || "Permanent delete failed",
      });
    }
  },

  // ================= SET =================
  setBrands: (brands) => set({ brands }),
}));
