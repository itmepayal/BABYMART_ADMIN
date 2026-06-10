import { create } from "zustand";
import { brandService } from "@/services/BrandService";

export type BrandCategory =
  | "baby-care"
  | "diapers"
  | "feeding"
  | "clothing"
  | "toys"
  | "health"
  | "bath"
  | "strollers"
  | "maternity"
  | "nursery"
  | "school"
  | "accessories";

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
  sortOrder: number;
  isVerified: boolean;
  isActive: boolean;
  isDeleted: boolean;
  deletedAt?: string | null;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

type BrandFilters = {
  page?: number;
  limit?: number;
  search?: string;
  category?: BrandCategory;
  isActive?: boolean;
  isFeatured?: boolean;
  isVerified?: boolean;
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

  getAllBrands: (params?: BrandFilters) => Promise<void>;

  getBrandById: (id: string) => Promise<void>;

  createBrand: (payload: any) => Promise<void>;

  updateBrand: (id: string, payload: any) => Promise<void>;

  deleteBrand: (id: string) => Promise<void>;

  bulkDeleteBrands: (ids: string[]) => Promise<void>;

  bulkRestoreBrands: (ids: string[]) => Promise<void>;

  bulkPermanentDeleteBrands: (ids: string[]) => Promise<void>;

  setBrands: (brands: Brand[]) => void;

  clearSelectedBrand: () => void;

  clearError: () => void;
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

  // =========================================
  // GET ALL BRANDS
  // =========================================

  getAllBrands: async (params = {}) => {
    try {
      set({
        loading: true,
        isFetchingBrands: true,
        error: null,
      });

      const res = await brandService.getAllBrands(params);

      set({
        brands: res.brands || [],
        total: res.total || 0,
        page: res.page || 1,
        pages: res.pages || 1,
        loading: false,
        isFetchingBrands: false,
      });
    } catch (err: any) {
      set({
        loading: false,
        isFetchingBrands: false,
        error:
          err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch brands",
      });

      throw err;
    }
  },

  // =========================================
  // GET BRAND BY ID
  // =========================================

  getBrandById: async (id: string) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const res = await brandService.getBrandById(id);

      set({
        selectedBrand: res.data,
        loading: false,
      });
    } catch (err: any) {
      set({
        loading: false,
        error:
          err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch brand",
      });

      throw err;
    }
  },

  // =========================================
  // CREATE BRAND
  // =========================================

  createBrand: async (payload) => {
    try {
      set({
        loading: true,
        error: null,
      });

      await brandService.createBrand(payload);

      await get().getAllBrands();

      set({
        loading: false,
      });
    } catch (err: any) {
      set({
        loading: false,
        error:
          err?.response?.data?.message ||
          err?.message ||
          "Failed to create brand",
      });

      throw err;
    }
  },

  // =========================================
  // UPDATE BRAND
  // =========================================

  updateBrand: async (id, payload) => {
    try {
      set({
        loading: true,
        error: null,
      });

      await brandService.updateBrand(id, payload);

      await get().getAllBrands();

      set({
        loading: false,
      });
    } catch (err: any) {
      set({
        loading: false,
        error:
          err?.response?.data?.message ||
          err?.message ||
          "Failed to update brand",
      });

      throw err;
    }
  },

  // =========================================
  // DELETE BRAND
  // =========================================

  deleteBrand: async (id) => {
    const previousBrands = get().brands;

    try {
      set({
        brands: previousBrands.filter((brand) => brand._id !== id),
        error: null,
      });

      await brandService.deleteBrand(id);

      await get().getAllBrands();
    } catch (err: any) {
      set({
        brands: previousBrands,
        error:
          err?.response?.data?.message ||
          err?.message ||
          "Failed to delete brand",
      });

      throw err;
    }
  },

  // =========================================
  // BULK DELETE
  // =========================================

  bulkDeleteBrands: async (ids) => {
    const previousBrands = get().brands;

    try {
      set({
        brands: previousBrands.filter((brand) => !ids.includes(brand._id)),
        error: null,
      });

      await brandService.bulkDeleteBrands(ids);

      await get().getAllBrands();
    } catch (err: any) {
      set({
        brands: previousBrands,
        error:
          err?.response?.data?.message || err?.message || "Bulk delete failed",
      });

      throw err;
    }
  },

  // =========================================
  // BULK RESTORE
  // =========================================

  bulkRestoreBrands: async (ids) => {
    try {
      set({
        error: null,
      });

      await brandService.bulkRestoreBrands(ids);

      await get().getAllBrands();
    } catch (err: any) {
      set({
        error: err?.response?.data?.message || err?.message || "Restore failed",
      });

      throw err;
    }
  },

  // =========================================
  // BULK PERMANENT DELETE
  // =========================================

  bulkPermanentDeleteBrands: async (ids) => {
    const previousBrands = get().brands;

    try {
      set({
        brands: previousBrands.filter((brand) => !ids.includes(brand._id)),
        error: null,
      });

      await brandService.bulkPermanentDeleteBrands(ids);

      await get().getAllBrands();
    } catch (err: any) {
      set({
        brands: previousBrands,
        error:
          err?.response?.data?.message ||
          err?.message ||
          "Permanent delete failed",
      });

      throw err;
    }
  },

  // =========================================
  // HELPERS
  // =========================================

  setBrands: (brands) => {
    set({
      brands,
    });
  },

  clearSelectedBrand: () => {
    set({
      selectedBrand: null,
    });
  },

  clearError: () => {
    set({
      error: null,
    });
  },
}));
