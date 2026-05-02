import { api } from "@/lib/config";
import type { StatsData } from "@/store/stats/useStatsStore";

// ================= TYPES =================
export type StatsSummary = {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  totalCustomers: number;
};

export type SalesAnalytics = {
  date: string;
  revenue: number;
  orders: number;
};

export type TopProduct = {
  _id: string;
  name: string;
  totalSold: number;
  revenue: number;
};

export type RecentOrder = {
  _id: string;
  user: string;
  totalAmount: number;
  status: string;
  createdAt: string;
};

// ================= QUERY TYPES =================
export type GetStatsParams = {
  range?: "today" | "7d" | "30d" | "1y";
};

// ================= RESPONSE =================
export type GetStatsResponse = {
  success: boolean;
  message: string;
  data: StatsData;
};

// ================= SERVICE =================
export const statsService = {
  // ================= GET STATS =================
  getStats: async (): Promise<GetStatsResponse> => {
    const { data } = await api.get("/stats");
    console.log(data);
    return data;
  },
};
