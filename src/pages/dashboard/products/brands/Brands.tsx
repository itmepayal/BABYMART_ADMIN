import { useState, useEffect } from "react";
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
  Tag,
  Loader2Icon,
  Search,
} from "lucide-react";

import { FiPlus, FiRefreshCw } from "react-icons/fi";
import { defaultAvatar } from "@/assets";
import { ConfirmModal } from "@/components/dashbaord/ConfirmModal";
import { ViewBrand } from "@/pages/dashboard/products/brands/ViewBrand";
import { BrandSkeleton } from "@/components/skeletons/BrandSkeleton";

const Brands = () => {
  const navigate = useNavigate();

  // ================= STATE =================
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<any>(null);
  const [_, setViewOpen] = useState(false);
  const [viewBrand, setViewBrand] = useState<any>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [permanentDeleteOpen, setPermanentDeleteOpen] = useState(false);

  // ================= DATA =================
  const { brands, loading, refetch, isFetchingBrands, page, pages, total } =
    useBrands();

  const { handleDeleteBrand } = useDeleteBrand();

  const {
    handleBulkDelete,
    handleBulkRestore,
    handleBulkPermanentDelete,
    loading: bulkLoading,
  } = useBrandBulkActions();

  // ================= FILTER =================
  const filteredBrands = brands;

  // ================= SELECTION =================
  const toggleSelectAll = () => {
    if (selectedBrands.length === filteredBrands.length) {
      setSelectedBrands([]);
    } else {
      setSelectedBrands(filteredBrands.map((brand) => brand._id));
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedBrands((prev) =>
      prev.includes(id) ? prev.filter((brand) => brand !== id) : [...prev, id],
    );
  };

  const isAllSelected =
    filteredBrands.length > 0 &&
    selectedBrands.length === filteredBrands.length;

  // ================= BULK ACTIONS =================
  const handleRestoreClick = async () => {
    await handleBulkRestore(selectedBrands);
    await refetch({
      page,
      limit: 10,
      search,
    });
    setSelectedBrands([]);
  };

  const handleBulkDeleteClick = async () => {
    await handleBulkDelete(selectedBrands);
    await refetch({
      page,
      limit: 10,
      search,
    });
    setSelectedBrands([]);
  };

  const handlePermanentDeleteClick = async () => {
    await handleBulkPermanentDelete(selectedBrands);
    await refetch({
      page,
      limit: 10,
      search,
    });
    setSelectedBrands([]);
  };

  // ================= STATUS =================
  const getBrandStatus = (brand: any) => {
    if (brand.isDeleted) return "deleted";
    if (brand.isActive) return "active";
    return "inactive";
  };

  /* ================= REFETCH ================= */
  useEffect(() => {
    const timer = setTimeout(() => {
      refetch({
        page: 1,
        limit: 10,
        search,
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [search, refetch]);

  /* ================= SKELETON ================= */
  if (loading) {
    return <BrandSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* ================= PAGE HEADER ================= */}
      <Header
        title="Brands Management"
        description="Manage brands, visibility and status."
        icon={Tag}
        actionLabel="Add Brand"
        actionIcon={FiPlus}
        onAction={() => navigate("/dashboard/brands/create")}
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

      {/* ================= SEARCH BAR ================= */}
      <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search brands by name..."
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
        {selectedBrands.length > 0 && (
          <div className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-6 py-4 backdrop-blur-md">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100">
                  <span className="text-base font-bold text-emerald-700">
                    {selectedBrands.length}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    {selectedBrands.length} Brand
                    {selectedBrands.length > 1 ? "s" : ""} Selected
                  </h3>
                  <p className="text-xs text-slate-500">
                    Manage selected brands with bulk actions
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleRestoreClick}
                  className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700 hover:bg-emerald-100"
                >
                  <RotateCcw size={16} />
                  Restore
                </button>

                <button
                  onClick={() => setBulkDeleteOpen(true)}
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-amber-600"
                >
                  <Trash2 size={16} />
                  Delete
                </button>

                <button
                  onClick={() => setPermanentDeleteOpen(true)}
                  className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700"
                >
                  <Trash size={16} />
                  Permanent Delete
                </button>

                <button
                  onClick={() => setSelectedBrands([])}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
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
          <Table className="min-w-[900px]">
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50 h-14">
                <TableHead className="w-[50px] text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 rounded border-slate-300"
                  />
                </TableHead>

                <TableHead>Brand</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Updated At</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isFetchingBrands ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2Icon className="h-6 w-6 animate-spin text-slate-400" />
                      <p className="text-sm text-slate-500">
                        Loading brands...
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredBrands.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-20 text-center">
                    <p className="text-sm font-medium text-slate-600">
                      No brands found
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Try creating a new brand
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredBrands.map((brand) => {
                  const status = getBrandStatus(brand);

                  return (
                    <TableRow
                      key={brand._id}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >
                      <TableCell className="text-center">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand._id)}
                          onChange={() => toggleSelection(brand._id)}
                          className="h-4 w-4 rounded border-slate-300"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={brand.images?.[0]?.url || defaultAvatar}
                            alt={brand.name}
                            className="h-12 w-12 rounded-xl border object-cover"
                          />

                          <div>
                            <p className="text-sm font-semibold text-slate-900">
                              {brand.name}
                            </p>
                            <p className="text-xs text-slate-400">
                              ID: {brand._id.slice(0, 8)}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex">
                          <span className="inline-flex items-center text-sm font-medium text-slate-700">
                            {new Date(brand.createdAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex">
                          <span className="inline-flex items-center text-sm font-medium text-slate-700">
                            {new Date(brand.updatedAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </span>
                        </div>
                      </TableCell>

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

                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
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
                            <>
                              <button
                                onClick={async () => {
                                  await handleBulkRestore([brand._id]);
                                  await refetch({
                                    page,
                                    limit: 10,
                                    search,
                                  });
                                }}
                                className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700 transition-all hover:bg-emerald-100"
                              >
                                <RotateCcw size={16} />
                                Restore
                              </button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>

          <ConfirmModal
            open={open}
            userName={selectedBrand?.name || "brand"}
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

export default Brands;
