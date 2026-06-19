import { create } from "zustand";
import type {
  Brand,
  GetAllBrandsParams,
  CreateBrandPayload,
  UpdateBrandPayload,
} from "@/types/brand.type";
import { brandService } from "@/services/BrandService";

type BrandState = {
  brands: Brand[];
  selectedBrand: Brand | null;
  loading: boolean;
  isFetchingBrands: boolean;
  error: string | null;
  total: number;
  page: number;
  pages: number;
  getAllBrands: (params?: GetAllBrandsParams) => Promise<void>;
  getBrandById: (id: string) => Promise<void>;
  createBrand: (payload: CreateBrandPayload) => Promise<void>;
  updateBrand: (id: string, payload: UpdateBrandPayload) => Promise<void>;
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

  getAllBrands: async (params = {}) => {
    try {
      set({
        loading: true,
        isFetchingBrands: true,
        error: null,
      });
      const res = await brandService.getAllBrands(params);
      set({
        brands: res?.brands || [],
        total: res?.total || 0,
        page: res?.page || 1,
        pages: res?.pages || 1,
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
