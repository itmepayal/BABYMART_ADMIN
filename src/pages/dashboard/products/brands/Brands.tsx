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

import { useBrands } from "@/hooks/brand/useBrands";
import {
  useBrandBulkActions,
  useDeleteBrand,
} from "@/hooks/brand/useBrandActions";

import {
  Trash2,
  RotateCcw,
  Trash,
  XCircle,
  Award,
  Loader2Icon,
  Search,
  ShieldCheck,
  Star,
} from "lucide-react";

import { FiPlus, FiRefreshCw } from "react-icons/fi";
import { defaultAvatar } from "@/assets";
import { ViewBrand } from "@/pages/dashboard/products/brands/ViewBrand";
import { BrandSkeleton } from "@/components/skeletons/BrandSkeleton";

const StatusBadge = ({
  status,
}: {
  status: "active" | "inactive" | "deleted";
}) => {
  const styles = {
    active:
      "bg-emerald-50 text-emerald-700 border border-emerald-200 ring-1 ring-emerald-100",
    inactive:
      "bg-amber-50 text-amber-700 border border-amber-200 ring-1 ring-amber-100",
    deleted:
      "bg-slate-100 text-slate-500 border border-slate-200 ring-1 ring-slate-100",
  };

  const dots = {
    active: "bg-emerald-500",
    inactive: "bg-amber-400",
    deleted: "bg-slate-400",
  };

  const labels = { active: "Active", inactive: "Inactive", deleted: "Deleted" };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dots[status]}`} />
      {labels[status]}
    </span>
  );
};

const CategoryChip = ({ label }: { label: string }) => (
  <span className="inline-flex items-center rounded-lg bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700 border border-teal-100 capitalize">
    {label}
  </span>
);

const VerifiedBadge = ({ verified }: { verified: boolean }) =>
  verified ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-600 border border-blue-100">
      <ShieldCheck size={10} />
      Verified
    </span>
  ) : null;

const FeaturedBadge = ({ featured }: { featured: boolean }) =>
  featured ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-semibold text-violet-600 border border-violet-100">
      <Star size={10} />
      Featured
    </span>
  ) : null;

interface BulkToolbarProps {
  count: number;
  onRestore: () => void;
  onDelete: () => void;
  onPermanentDelete: () => void;
  onClear: () => void;
}

const BulkToolbar = ({
  count,
  onRestore,
  onDelete,
  onPermanentDelete,
  onClear,
}: BulkToolbarProps) => (
  <div className="flex flex-col gap-3 border-b border-emerald-100 bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 px-6 py-3.5 lg:flex-row lg:items-center lg:justify-between">
    <div className="flex items-center gap-3">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 text-xs font-bold text-white shadow-md shadow-teal-200">
        {count}
      </span>
      <div>
        <p className="text-sm font-semibold text-slate-800">
          {count} {count === 1 ? "Brand" : "Brands"} selected
        </p>
        <p className="text-xs text-slate-500">Choose a bulk action below</p>
      </div>
    </div>
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={onRestore}
        className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-white px-3.5 py-2 text-xs font-semibold text-emerald-700 shadow-sm transition hover:bg-emerald-50 active:scale-95"
      >
        <RotateCcw size={13} />
        Restore
      </button>
      <button
        onClick={onDelete}
        className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-amber-600 active:scale-95"
      >
        <Trash2 size={13} />
        Soft Delete
      </button>
      <button
        onClick={onPermanentDelete}
        className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-rose-700 active:scale-95"
      >
        <Trash size={13} />
        Permanent Delete
      </button>
      <button
        onClick={onClear}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 active:scale-95"
      >
        <XCircle size={13} />
        Clear
      </button>
    </div>
  </div>
);

const EmptyState = ({ searching }: { searching: boolean }) => (
  <TableRow>
    <TableCell colSpan={8}>
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <div className="relative">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 via-teal-100 to-cyan-100 shadow-inner">
            <Award className="h-7 w-7 text-teal-500" />
          </div>
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-emerald-300 via-teal-300 to-cyan-300 opacity-20 blur-sm -z-10" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-700">
            {searching ? "No matching brands" : "No brands yet"}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            {searching
              ? "Try a different search term"
              : "Add your first brand to get started"}
          </p>
        </div>
      </div>
    </TableCell>
  </TableRow>
);

const Brands = () => {
  const navigate = useNavigate();

  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<any>(null);
  const [_, setViewOpen] = useState(false);
  const [viewBrand, setViewBrand] = useState<any>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [permanentDeleteOpen, setPermanentDeleteOpen] = useState(false);

  const { brands, loading, refetch, isFetchingBrands, page, pages, total } =
    useBrands();

  const { handleDeleteBrand } = useDeleteBrand();
  const {
    handleBulkDelete,
    handleBulkRestore,
    handleBulkPermanentDelete,
    loading: bulkLoading,
  } = useBrandBulkActions();

  const filteredBrands = brands;

  const isAllSelected =
    filteredBrands.length > 0 &&
    selectedBrands.length === filteredBrands.length;

  const toggleSelectAll = () =>
    setSelectedBrands(isAllSelected ? [] : filteredBrands.map((b) => b._id));

  const toggleSelection = (id: string) =>
    setSelectedBrands((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const getBrandStatus = (brand: any): "active" | "inactive" | "deleted" => {
    if (brand.isDeleted) return "deleted";
    if (brand.isActive) return "active";
    return "inactive";
  };

  const doRefetch = (p = page) => refetch({ page: p, limit: 10, search });

  const handleRestoreClick = async () => {
    await handleBulkRestore(selectedBrands);
    await doRefetch();
    setSelectedBrands([]);
  };

  const handleBulkDeleteClick = async () => {
    await handleBulkDelete(selectedBrands);
    await doRefetch();
    setSelectedBrands([]);
  };

  const handlePermanentDeleteClick = async () => {
    await handleBulkPermanentDelete(selectedBrands);
    await doRefetch();
    setSelectedBrands([]);
  };

  useEffect(() => {
    const t = setTimeout(() => refetch({ page: 1, limit: 10, search }), 500);
    return () => clearTimeout(t);
  }, [search, refetch]);

  if (loading) return <BrandSkeleton />;

  return (
    <div className="space-y-5">
      <Header
        title="Brands"
        description="Manage brand logos, banners, categories, and visibility."
        icon={Award}
        actionLabel="Add Brand"
        actionIcon={FiPlus}
        onAction={() => navigate("/dashboard/brands/create")}
        refreshIcon={FiRefreshCw}
        onRefresh={() => doRefetch()}
        isRefreshing={loading}
      />

      <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm">
        <div className="relative w-full max-w-sm">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 flex items-center justify-center">
            <Search className="h-4 w-4 text-teal-500" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name…"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-9 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              aria-label="Clear search"
            >
              <XCircle size={15} />
            </button>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {selectedBrands.length > 0 && (
          <BulkToolbar
            count={selectedBrands.length}
            onRestore={handleRestoreClick}
            onDelete={() => setBulkDeleteOpen(true)}
            onPermanentDelete={() => setPermanentDeleteOpen(true)}
            onClear={() => setSelectedBrands([])}
          />
        )}

        <div className="overflow-x-auto">
          <Table className="min-w-[960px]">
            <TableHeader>
              <TableRow className="border-b border-slate-100 bg-gradient-to-r from-emerald-50/60 via-teal-50/40 to-cyan-50/60 hover:from-emerald-50/60 hover:via-teal-50/40 hover:to-cyan-50/60">
                <TableHead className="w-10 pl-5">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-teal-600"
                    aria-label="Select all"
                  />
                </TableHead>
                {["Brand", "Category", "Badges", "Created", "Updated"].map(
                  (h) => (
                    <TableHead
                      key={h}
                      className="text-xs font-bold uppercase tracking-widest text-teal-700/70"
                    >
                      {h}
                    </TableHead>
                  ),
                )}
                <TableHead className="text-center text-xs font-bold uppercase tracking-widest text-teal-700/70">
                  Status
                </TableHead>
                <TableHead className="pr-5 text-center text-xs font-bold uppercase tracking-widest text-teal-700/70">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isFetchingBrands ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="relative flex h-10 w-10 items-center justify-center">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-400 opacity-20 blur-md" />
                        <Loader2Icon className="h-6 w-6 animate-spin text-teal-500" />
                      </div>
                      <p className="text-xs font-medium text-slate-500">
                        Loading brands…
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredBrands.length === 0 ? (
                <EmptyState searching={search.length > 0} />
              ) : (
                filteredBrands.map((brand) => {
                  const status = getBrandStatus(brand);
                  const isSelected = selectedBrands.includes(brand._id);
                  return (
                    <TableRow
                      key={brand._id}
                      data-selected={isSelected}
                      className="group border-b border-slate-100 transition-colors hover:bg-gradient-to-r hover:from-emerald-50/30 hover:via-teal-50/20 hover:to-cyan-50/30 data-[selected=true]:bg-gradient-to-r data-[selected=true]:from-emerald-50/50 data-[selected=true]:via-teal-50/30 data-[selected=true]:to-cyan-50/50"
                    >
                      <TableCell className="pl-5">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelection(brand._id)}
                          className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-teal-600"
                        />
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="relative flex-shrink-0">
                            <div className="absolute -inset-[2px] rounded-xl bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 blur-[1px]" />
                            <img
                              src={brand.logo?.url || defaultAvatar}
                              alt={brand.name}
                              className="relative h-10 w-10 rounded-xl border border-slate-200 object-cover shadow-sm bg-white"
                            />
                            {status === "active" && (
                              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500 shadow-sm" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-800 leading-tight">
                              {brand.name}
                            </p>
                            <p className="mt-0.5 font-mono text-[10px] text-slate-400">
                              #{brand._id.slice(0, 8)}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <CategoryChip label={brand.category} />
                      </TableCell>

                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          <VerifiedBadge verified={brand.isVerified} />
                          <FeaturedBadge featured={brand.isFeatured} />
                          {!brand.isVerified && !brand.isFeatured && (
                            <span className="text-xs text-slate-400">—</span>
                          )}
                        </div>
                      </TableCell>

                      <TableCell>
                        <span className="text-sm text-slate-600">
                          {new Date(brand.createdAt).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </span>
                      </TableCell>

                      <TableCell>
                        <span className="text-sm text-slate-600">
                          {new Date(brand.updatedAt).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </span>
                      </TableCell>

                      <TableCell className="text-center">
                        <StatusBadge status={status} />
                      </TableCell>

                      <TableCell className="pr-5">
                        <div className="flex items-center justify-center gap-1.5">
                          {!brand.isDeleted ? (
                            <>
                              <ViewButton
                                onClick={() => {
                                  setViewBrand(brand);
                                  setViewOpen(true);
                                }}
                              />
                              <EditButton
                                onClick={() =>
                                  navigate(
                                    `/dashboard/brands/edit/${brand._id}`,
                                  )
                                }
                              />
                              <DeleteButton
                                onClick={() => {
                                  setSelectedBrand(brand);
                                  setOpen(true);
                                }}
                              />
                            </>
                          ) : (
                            <button
                              onClick={async () => {
                                await handleBulkRestore([brand._id]);
                                await doRefetch();
                              }}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:from-emerald-100 hover:to-teal-100 active:scale-95 shadow-sm"
                            >
                              <RotateCcw size={12} />
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
        </div>

        <Pagination
          page={page}
          pages={pages}
          total={total}
          onChange={(p) => doRefetch(p)}
        />
      </div>

      <ConfirmModal
        open={open}
        userName={selectedBrand?.name ?? "brand"}
        onClose={() => {
          setOpen(false);
          setSelectedBrand(null);
        }}
        onConfirm={async () => {
          if (!selectedBrand) return;
          await handleDeleteBrand(selectedBrand._id);
          setOpen(false);
          setSelectedBrand(null);
        }}
        loading={loading}
      />

      <ConfirmModal
        open={bulkDeleteOpen}
        userName={`${selectedBrands.length} brands`}
        onClose={() => setBulkDeleteOpen(false)}
        onConfirm={async () => {
          await handleBulkDeleteClick();
          setBulkDeleteOpen(false);
        }}
        loading={bulkLoading}
      />

      <ConfirmModal
        open={permanentDeleteOpen}
        userName={`${selectedBrands.length} brands`}
        onClose={() => setPermanentDeleteOpen(false)}
        onConfirm={async () => {
          await handlePermanentDeleteClick();
          setPermanentDeleteOpen(false);
        }}
        loading={bulkLoading}
      />

      <ViewBrand
        brand={viewBrand}
        onClose={() => {
          setViewOpen(false);
          setViewBrand(null);
        }}
      />
    </div>
  );
};

export default Brands;
