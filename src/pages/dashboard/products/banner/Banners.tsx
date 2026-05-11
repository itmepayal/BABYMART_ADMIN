import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Header } from "@/components/dashbaord/Header";
import { Pagination } from "@/components/dashbaord/Pagination";
import { ConfirmModal } from "@/components/dashbaord/ConfirmModal";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  DeleteButton,
  EditButton,
  ViewButton,
} from "@/components/common/Action";

import { useBanners } from "@/hooks/banner/useBanner";
import {
  useBannerBulkActions,
  useDeleteBanner,
} from "@/hooks/banner/useBannerAction";

import {
  Trash2,
  RotateCcw,
  Trash,
  XCircle,
  Loader2Icon,
  Search,
  Calendar,
  MonitorPlay,
} from "lucide-react";

import { FiPlus, FiRefreshCw } from "react-icons/fi";

import { defaultAvatar } from "@/assets";
import { ViewBanner } from "@/pages/dashboard/products/banner/ViewBanner";

const Banner = () => {
  const navigate = useNavigate();

  // ================= STATE =================
  const [selectedBanners, setSelectedBanners] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<any>(null);

  const [_, setViewOpen] = useState(false);
  const [viewBanner, setViewBanner] = useState<any>(null);

  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [permanentDeleteOpen, setPermanentDeleteOpen] = useState(false);

  // ================= DATA =================
  const { banners, loading, refetch, isFetchingBanners, page, pages, total } =
    useBanners();

  const { handleDeleteBanner } = useDeleteBanner();

  const {
    handleBulkDelete,
    handleBulkRestore,
    handleBulkPermanentDelete,
    loading: bulkLoading,
  } = useBannerBulkActions();

  // ================= FILTER =================
  const filteredBanners = banners;

  // ================= SEARCH =================
  useEffect(() => {
    const timer = setTimeout(() => {
      refetch({
        page: 1,
        limit: 10,
        search,
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [search, refetch]);

  // ================= SELECTION =================
  const toggleSelectAll = () => {
    if (selectedBanners.length === filteredBanners.length) {
      setSelectedBanners([]);
    } else {
      setSelectedBanners(filteredBanners.map((banner) => banner._id));
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedBanners((prev) =>
      prev.includes(id)
        ? prev.filter((bannerId) => bannerId !== id)
        : [...prev, id],
    );
  };

  const isAllSelected =
    filteredBanners.length > 0 &&
    selectedBanners.length === filteredBanners.length;

  // ================= STATUS =================
  const getBannerStatus = (banner: any) => {
    if (banner.isDeleted) return "deleted";
    if (banner.isActive) return "active";
    return "inactive";
  };

  // ================= BULK ACTIONS =================
  const handleRestoreClick = async () => {
    await handleBulkRestore(selectedBanners);

    await refetch({
      page,
      limit: 10,
      search,
    });

    setSelectedBanners([]);
  };

  const handleBulkDeleteClick = async () => {
    await handleBulkDelete(selectedBanners);

    await refetch({
      page,
      limit: 10,
      search,
    });

    setSelectedBanners([]);
  };

  const handlePermanentDeleteClick = async () => {
    await handleBulkPermanentDelete(selectedBanners);

    await refetch({
      page,
      limit: 10,
      search,
    });

    setSelectedBanners([]);
  };

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <Header
        title="Banners Management"
        description="Manage homepage banners, campaigns and visibility."
        icon={MonitorPlay}
        actionLabel="Add Banner"
        actionIcon={FiPlus}
        onAction={() => navigate("/dashboard/banners/create")}
        refreshIcon={FiRefreshCw}
        onRefresh={() =>
          refetch({
            page,
            limit: 10,
            search,
          })
        }
        isRefreshing={loading}
      />

      {/* ================= SEARCH ================= */}
      <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search banners by name..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-10 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
          />

          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-100"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ================= TABLE SECTION ================= */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* ================= BULK TOOLBAR ================= */}
        {selectedBanners.length > 0 && (
          <div className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-6 py-4 backdrop-blur-md">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100">
                  <span className="text-base font-bold text-emerald-700">
                    {selectedBanners.length}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    {selectedBanners.length} Banner
                    {selectedBanners.length > 1 ? "s" : ""} Selected
                  </h3>

                  <p className="text-xs text-slate-500">
                    Manage selected banners with bulk actions
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleRestoreClick}
                  className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100"
                >
                  <RotateCcw size={16} />
                  Restore
                </button>

                <button
                  onClick={() => setBulkDeleteOpen(true)}
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-amber-600"
                >
                  <Trash2 size={16} />
                  Delete
                </button>

                <button
                  onClick={() => setPermanentDeleteOpen(true)}
                  className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700"
                >
                  <Trash size={16} />
                  Permanent Delete
                </button>

                <button
                  onClick={() => setSelectedBanners([])}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  <XCircle size={16} />
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= TABLE ================= */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <Table className="min-w-[1100px]">
            <TableHeader>
              <TableRow className="h-14 bg-slate-50 hover:bg-slate-50">
                <TableHead className="w-[50px] text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 rounded border-slate-300"
                  />
                </TableHead>

                <TableHead>Banner</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Start From</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Updated At</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isFetchingBanners ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2Icon className="h-6 w-6 animate-spin text-slate-400" />

                      <p className="text-sm text-slate-500">
                        Loading banners...
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredBanners.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-20 text-center">
                    <p className="text-sm font-medium text-slate-600">
                      No banners found
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Try creating a new banner
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredBanners.map((banner) => {
                  const status = getBannerStatus(banner);

                  return (
                    <TableRow
                      key={banner._id}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >
                      <TableCell className="text-center">
                        <input
                          type="checkbox"
                          checked={selectedBanners.includes(banner._id)}
                          onChange={() => toggleSelection(banner._id)}
                          className="h-4 w-4 rounded border-slate-300"
                        />
                      </TableCell>

                      {/* BANNER */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={banner.image?.url || defaultAvatar}
                            alt={banner.name}
                            className="h-14 w-14 rounded-2xl border border-slate-200 object-cover"
                          />

                          <div>
                            <p className="text-sm font-semibold text-slate-900">
                              {banner.name}
                            </p>

                            <p className="text-xs text-slate-400">
                              ID: {banner._id.slice(0, 8)}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      {/* TITLE */}
                      <TableCell>
                        <div className="max-w-[220px]">
                          <p className="line-clamp-2 text-sm font-medium text-slate-700">
                            {banner.title}
                          </p>
                        </div>
                      </TableCell>

                      {/* START DATE */}
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                          <Calendar size={14} className="text-slate-400" />

                          {new Date(banner.startFrom).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </div>
                      </TableCell>

                      {/* CREATED */}
                      <TableCell>
                        <span className="text-sm font-medium text-slate-700">
                          {new Date(banner.createdAt).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </span>
                      </TableCell>

                      {/* UPDATED */}
                      <TableCell>
                        <span className="text-sm font-medium text-slate-700">
                          {new Date(banner.updatedAt).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </span>
                      </TableCell>

                      {/* STATUS */}
                      <TableCell className="text-center">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            status === "active"
                              ? "bg-emerald-50 text-emerald-700"
                              : status === "deleted"
                                ? "bg-slate-100 text-slate-600"
                                : "bg-red-50 text-red-700"
                          }`}
                        >
                          {status === "active"
                            ? "Active"
                            : status === "deleted"
                              ? "Deleted"
                              : "Inactive"}
                        </span>
                      </TableCell>

                      {/* ACTIONS */}
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          {!banner.isDeleted ? (
                            <>
                              <ViewButton
                                onClick={() => {
                                  setViewBanner(banner);
                                  setViewOpen(true);
                                }}
                              />

                              <EditButton
                                onClick={() =>
                                  navigate(
                                    `/dashboard/banners/edit/${banner._id}`,
                                  )
                                }
                              />

                              <DeleteButton
                                onClick={() => {
                                  setSelectedBanner(banner);
                                  setOpen(true);
                                }}
                              />
                            </>
                          ) : (
                            <button
                              onClick={async () => {
                                await handleBulkRestore([banner._id]);

                                await refetch({
                                  page,
                                  limit: 10,
                                  search,
                                });
                              }}
                              className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100"
                            >
                              <RotateCcw size={16} />
                              Restore
                            </button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>

          {/* ================= SINGLE DELETE ================= */}
          <ConfirmModal
            open={open}
            userName={selectedBanner?.name || "banner"}
            onClose={() => {
              setOpen(false);
              setSelectedBanner(null);
            }}
            onConfirm={async () => {
              if (!selectedBanner) return;

              await handleDeleteBanner(selectedBanner._id);

              setOpen(false);
              setSelectedBanner(null);
            }}
            loading={loading}
          />

          {/* ================= BULK DELETE ================= */}
          <ConfirmModal
            open={bulkDeleteOpen}
            userName={`${selectedBanners.length} banners`}
            onClose={() => setBulkDeleteOpen(false)}
            onConfirm={async () => {
              await handleBulkDeleteClick();
              setBulkDeleteOpen(false);
            }}
            loading={bulkLoading}
          />

          {/* ================= PERMANENT DELETE ================= */}
          <ConfirmModal
            open={permanentDeleteOpen}
            userName={`${selectedBanners.length} banners`}
            onClose={() => setPermanentDeleteOpen(false)}
            onConfirm={async () => {
              await handlePermanentDeleteClick();
              setPermanentDeleteOpen(false);
            }}
            loading={bulkLoading}
          />

          {/* ================= VIEW BANNER ================= */}
          <ViewBanner
            banner={viewBanner}
            onClose={() => {
              setViewOpen(false);
              setViewBanner(null);
            }}
          />
        </div>

        {/* ================= PAGINATION ================= */}
        <Pagination
          page={page}
          pages={pages}
          total={total}
          onChange={(p) =>
            refetch({
              page: p,
              limit: 10,
              search,
            })
          }
        />
      </div>
    </div>
  );
};

export default Banner;
