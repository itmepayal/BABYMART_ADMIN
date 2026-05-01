import { useEffect } from "react";
import { useBannerStore } from "@/store/banner/useBannerStore";

// ==========================================
// USE BANNERS
// ==========================================
export const useBanners = () => {
  const {
    banners,
    selectedBanner,
    loading,
    error,
    total,
    page,
    pages,
    isFetchingBanners,

    getAllBanners,
    getBannerById,
    createBanner,
    updateBanner,
    deleteBanner,
    toggleBannerStatus,

    bulkDeleteBanners,
    bulkRestoreBanners,
    bulkPermanentDeleteBanners,
  } = useBannerStore();

  // =========================================
  // AUTO FETCH
  // =========================================
  useEffect(() => {
    getAllBanners();
  }, []);

  return {
    // ================= STATE =================
    banners,
    selectedBanner,
    loading,
    error,
    total,
    page,
    pages,
    isFetchingBanners,

    // ================= ACTIONS =================
    refetch: getAllBanners,
    getBannerById,
    createBanner,
    updateBanner,
    deleteBanner,
    toggleBannerStatus,

    bulkDeleteBanners,
    bulkRestoreBanners,
    bulkPermanentDeleteBanners,
  };
};
