import { useEffect } from "react";

import { useBannerStore } from "@/store/banner/useBannerStore";

// ==========================================
// USE BANNERS HOOK
// ==========================================
export const useBanners = () => {
  const {
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

  // ==========================================
  // AUTO FETCH
  // ==========================================
  useEffect(() => {
    getAllBanners({
      page: 1,
      limit: 10,
      search: "",
    });
  }, [getAllBanners]);

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
