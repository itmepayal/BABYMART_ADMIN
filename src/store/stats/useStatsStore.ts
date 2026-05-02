import { create } from "zustand";
import { statsService } from "@/services/StatsService";

// ================= TYPES =================
type CountStats = {
  users: number;
  products: number;
  categories: number;
  brands: number;
  orders: number;
};

type RoleStats = {
  _id: string;
  count: number;
};

type ProductByCategory = {
  count: number;
  categoryId: string;
  categoryName: string;
};

type ProductByBrand = {
  count: number;
  brandId: string;
  brandName: string;
};

export type StatsData = {
  counts: CountStats;
  revenue: number;
  roles: RoleStats[];
  productsByCategory: ProductByCategory[];
  productsByBrand: ProductByBrand[];
};

export type GetStatsResponse = {
  success: boolean;
  message: string;
  data: StatsData;
};

// ================= STORE =================
type StatsStore = {
  stats: StatsData | null;

  loading: boolean;
  isFetching: boolean;
  error: string | null;

  fetchStats: () => Promise<any>;
  refreshStats: () => Promise<void>;
  clearStats: () => void;
};

export const useStatsStore = create<StatsStore>((set, get) => ({
  stats: null,

  loading: false,
  isFetching: false,
  error: null,

  // ================= FETCH =================
  fetchStats: async () => {
    try {
      const isInitial = !get().stats;

      set({
        loading: isInitial,
        isFetching: !isInitial,
        error: null,
      });
      const res = await statsService.getStats();
      set({
        stats: res.data,
        loading: false,
        isFetching: false,
      });
      return res.data;
    } catch (error: any) {
      set({
        loading: false,
        isFetching: false,
        error:
          error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch stats",
      });
    }
  },

  // ================= REFRESH =================
  refreshStats: async () => {
    await get().fetchStats();
  },

  // ================= CLEAR =================
  clearStats: () =>
    set({
      stats: null,
    }),
}));
