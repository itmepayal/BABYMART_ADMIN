import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { Header } from "@/components/dashbaord/Header";
import { Pagination } from "@/components/dashbaord/Pagination";

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
  Tag,
  Loader2Icon,
  Search,
} from "lucide-react";

import { FiPlus, FiRefreshCw } from "react-icons/fi";
import { defaultAvatar } from "@/assets";
import { ConfirmModal } from "@/components/dashbaord/ConfirmModal";
import { ViewBanner } from "@/pages/dashboard/products/banner/ViewBanner";

const Banner = () => {
  const navigate = useNavigate();

  // ================= STATE =================
  const [open, setOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<any>(null);

  const [_, setViewOpen] = useState(false);
  const [viewBanner, setViewBanner] = useState<any>(null);

  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [permanentDeleteOpen, setPermanentDeleteOpen] = useState(false);

  const [selectedBanners, setSelectedBanners] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  // ================= DATA =================
  const { banners, loading, refetch, isFetchingBanners, page, pages, total } =
    useBanners();

  const { handleDeleteBanner } = useDeleteBanner();

  const { handleBulkDelete, handleBulkRestore, handleBulkPermanentDelete } =
    useBannerBulkActions();

  // ================= FILTER =================
  const filteredBanners = useMemo(() => {
    return banners.filter((banner) =>
      banner?.name?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [banners, search]);

  // ================= SELECTION =================
  const toggleSelectAll = () => {
    if (selectedBanners.length === filteredBanners.length) {
      setSelectedBanners([]);
    } else {
      setSelectedBanners(filteredBanners.map((b) => b._id));
    }
  };

  const toggleBannerSelection = (id: string) => {
    setSelectedBanners((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  // ================= BULK ACTIONS =================
  const handleRestoreClick = async () => {
    await handleBulkRestore(selectedBanners);
    setSelectedBanners([]);
  };

  const handleBulkDeleteClick = async () => {
    await handleBulkDelete(selectedBanners);
    setSelectedBanners([]);
  };

  const handlePermanentDeleteClick = async () => {
    await handleBulkPermanentDelete(selectedBanners);
    setSelectedBanners([]);
  };

  const isAllSelected =
    filteredBanners.length > 0 &&
    selectedBanners.length === filteredBanners.length;

  const getBannerStatus = (banner: any) => {
    if (banner.isDeleted) return "deleted";
    if (banner.isActive) return "active";
    return "inactive";
  };

  return (
    <div className="space-y-6">
      {/* ================= PAGE HEADER ================= */}
      <Header
        title="Banners Management"
        description="Manage homepage banners and their visibility."
        icon={Tag}
        actionLabel="Add Banner"
        actionIcon={FiPlus}
        onAction={() => navigate("/dashboard/banners/create")}
        refreshIcon={FiRefreshCw}
        onRefresh={refetch}
        isRefreshing={loading}
      />

      {/* ================= SEARCH BAR ================= */}
      <div className="rounded-2xl border bg-white px-4 py-3 shadow-sm">
        <div className="relative w-full max-w-sm">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search banners..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
        </div>
      </div>

      {/* ================= BRANDS TABLE SECTION ================= */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        {/* ================= BULK ACTION TOOLBAR ================= */}
        {selectedBanners.length > 0 && (
          <div className="border-b border-slate-100 px-6 py-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              {/* LEFT */}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                  <span className="text-sm font-bold text-emerald-600">
                    {selectedBanners.length}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    {selectedBanners.length} Banners Selected
                  </h3>
                  <p className="text-xs text-slate-500">
                    Perform bulk actions on selected banners
                  </p>
                </div>
              </div>

              {/* RIGHT */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setBulkDeleteOpen(true)}
                  className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-red-700"
                >
                  <Trash2 size={16} />
                  Delete Selected
                </button>

                <button
                  onClick={() => setPermanentDeleteOpen(true)}
                  className="flex items-center gap-2  rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-100"
                >
                  <Trash size={16} />
                  Permanent Delete
                </button>

                <button
                  onClick={handleRestoreClick}
                  className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-600 hover:bg-emerald-100"
                >
                  <RotateCcw size={16} />
                  Restore Selected
                </button>

                <button
                  onClick={() => setSelectedBanners([])}
                  className="flex items-center gap-2  rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                >
                  <XCircle size={16} />
                  Clear Selection
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= BRANDS TABLE ================= */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50">
                <TableHead className="w-[50px] text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 rounded border-slate-300 text-emerald-600 "
                  />
                </TableHead>

                <TableHead className="text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Image
                </TableHead>

                <TableHead className="pl-5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Name
                </TableHead>

                <TableHead className="pl-5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Title
                </TableHead>

                <TableHead className="pl-5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Start From
                </TableHead>

                <TableHead className="pl-5  text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Status
                </TableHead>

                <TableHead className="text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isFetchingBanners ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-20">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2Icon className="h-6 w-6 animate-spin text-slate-400" />
                      <p className="text-sm font-medium text-slate-600">
                        Loading banners...
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredBanners.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-20 text-center">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-slate-600">
                        No banners found
                      </p>
                      <p className="text-xs text-slate-400">
                        Try creating a new banner
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredBanners.map((banner) => (
                  <TableRow
                    key={banner._id}
                    className="group border-t border-slate-100 transition hover:bg-slate-50/70"
                  >
                    <TableCell className="text-center">
                      <input
                        type="checkbox"
                        checked={selectedBanners.includes(banner._id)}
                        onChange={() => toggleBannerSelection(banner._id)}
                        className="h-4 w-4 rounded border-slate-300 text-emerald-600"
                      />
                    </TableCell>

                    <TableCell className="text-center ">
                      <img
                        src={banner.image?.url || defaultAvatar}
                        alt={banner.name}
                        className="mx-auto h-11 w-11 rounded-full object-cover ring-2 ring-slate-100"
                      />
                    </TableCell>

                    <TableCell>
                      <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600">
                        {banner.name}
                      </span>
                    </TableCell>

                    <TableCell>
                      <span className="inline-flex items-center gap-2  px-3 py-1 text-xs text-slate-600">
                        {banner.title}
                      </span>
                    </TableCell>

                    <TableCell>
                      <span className="inline-flex items-center gap-2  px-3 py-1 text-xs text-slate-600">
                        {new Date(banner.startFrom).toLocaleString()}
                      </span>
                    </TableCell>

                    <TableCell>
                      {(() => {
                        const status = getBannerStatus(banner);
                        const base =
                          "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border transition";
                        const styles = {
                          deleted:
                            "bg-slate-100 text-slate-600 border-slate-200",
                          active:
                            "bg-emerald-50 text-emerald-700 border-emerald-200",
                          inactive: "bg-red-50 text-red-700 border-red-200",
                        };

                        const labels = {
                          deleted: "Deleted",
                          active: "Active",
                          inactive: "Inactive",
                        };

                        return (
                          <span className={`${base} ${styles[status]}`}>
                            <span
                              className={`h-2 w-2 rounded-full ${
                                status === "deleted"
                                  ? "bg-slate-400"
                                  : status === "active"
                                    ? "bg-emerald-500"
                                    : "bg-red-500"
                              }`}
                            />

                            {labels[status]}
                          </span>
                        );
                      })()}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center justify-center gap-2 opacity-70 transition group-hover:opacity-100">
                        <EditButton
                          onClick={() =>
                            navigate(`/dashboard/banners/edit/${banner._id}`)
                          }
                        />
                        <DeleteButton
                          onClick={() => {
                            setSelectedBanner(banner);
                            setOpen(true);
                          }}
                        />
                        <ViewButton
                          onClick={() => {
                            setViewBanner(banner);
                            setViewOpen(true);
                          }}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* ================= SINGLE DELETE CONFIRMATION ================= */}
          <ConfirmModal
            open={open}
            userName={selectedBanner?.name || ""}
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

          {/* ================= BULK DELETE CONFIRMATION ================= */}
          <ConfirmModal
            open={bulkDeleteOpen}
            userName={`${selectedBanners.length} banners`}
            onClose={() => setBulkDeleteOpen(false)}
            onConfirm={async () => {
              await handleBulkDeleteClick();
              setBulkDeleteOpen(false);
            }}
            loading={loading}
          />

          {/* ================= PERMANENT DELETE CONFIRMATION ================= */}
          <ConfirmModal
            open={permanentDeleteOpen}
            userName={`${selectedBanners.length} brands`}
            onClose={() => setPermanentDeleteOpen(false)}
            onConfirm={async () => {
              await handlePermanentDeleteClick();
              setPermanentDeleteOpen(false);
            }}
            loading={loading}
          />

          {/* ================= VIEW BRAND ================= */}
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
          onChange={(p) => refetch({ page: p })}
        />
      </div>
    </div>
  );
};

export default Banner;
