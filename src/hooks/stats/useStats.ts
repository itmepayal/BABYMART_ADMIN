import { useEffect } from "react";
import { useStatsStore } from "@/store/stats/useStatsStore";

export const useStats = () => {
  const { stats, loading, isFetching, error, fetchStats, refreshStats } =
    useStatsStore();

  useEffect(() => {
    if (!stats) fetchStats();
  }, []);

  return {
    stats,
    loading,
    isFetching,
    error,
    refreshStats,
  };
};
