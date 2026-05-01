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

const Brands = () => {
  const navigate = useNavigate();

  // ================= STATE MANAGEMENT =================
  const [open, setOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<any>(null);
  const [_, setViewOpen] = useState(false);
  const [viewBrand, setViewBrand] = useState<any>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [permanentDeleteOpen, setPermanentDeleteOpen] = useState(false);

  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  // ================= DATA FETCHING =================
  const { brands, loading, refetch, isFetchingBrands, page, pages, total } =
    useBrands();

  const { handleDeleteBrand } = useDeleteBrand();

  const { handleBulkDelete, handleBulkRestore, handleBulkPermanentDelete } =
    useBrandBulkActions();

  // ================= FILTER BRANDS =================
  const filteredBrands = useMemo(() => {
    return brands.filter((brand) =>
      brand.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [brands, search]);

  // ================= SELECTION HANDLERS =================
  const toggleSelectAll = () => {
    if (selectedBrands.length === filteredBrands.length) {
      setSelectedBrands([]);
    } else {
      setSelectedBrands(filteredBrands.map((brand) => brand._id));
    }
  };

  const toggleBrandSelection = (id: string) => {
    setSelectedBrands((prev) =>
      prev.includes(id)
        ? prev.filter((brandId) => brandId !== id)
        : [...prev, id],
    );
  };

  // ================= BULK ACTION HANDLERS =================
  const handleRestoreClick = async () => {
    await handleBulkRestore(selectedBrands);
    setSelectedBrands([]);
  };

  const handleBulkDeleteClick = async () => {
    await handleBulkDelete(selectedBrands);
    setSelectedBrands([]);
  };

  const handlePermanentDeleteClick = async () => {
    await handleBulkPermanentDelete(selectedBrands);
    setSelectedBrands([]);
  };

  // ================= HELPERS =================
  const isAllSelected =
    filteredBrands.length > 0 &&
    selectedBrands.length === filteredBrands.length;

  const getBrandStatus = (brand: any) => {
    if (brand.isDeleted) return "deleted";
    if (brand.isActive) return "active";
    return "inactive";
  };

  return (
    <div className="space-y-6">
      {/* ================= PAGE HEADER ================= */}
      <Header
        title="Brands Management"
        description="Manage product brands and visibility."
        icon={Tag}
        actionLabel="Add Brand"
        actionIcon={FiPlus}
        onAction={() => navigate("/dashboard/brands/create")}
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
            placeholder="Search brands..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
        </div>
      </div>

      {/* ================= BRANDS TABLE SECTION ================= */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        {/* ================= BULK ACTION TOOLBAR ================= */}
        {selectedBrands.length > 0 && (
          <div className="border-b border-slate-100 px-6 py-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              {/* LEFT */}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                  <span className="text-sm font-bold text-emerald-600">
                    {selectedBrands.length}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    {selectedBrands.length} Brands Selected
                  </h3>
                  <p className="text-xs text-slate-500">
                    Perform bulk actions on selected brands
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
                  onClick={() => setSelectedBrands([])}
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
                    className="h-4 w-4 rounded border-slate-300 text-emerald-600"
                  />
                </TableHead>

                <TableHead className="text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Image
                </TableHead>

                <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Brand
                </TableHead>

                <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Status
                </TableHead>

                <TableHead className="text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isFetchingBrands ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-20">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2Icon className="h-6 w-6 animate-spin text-slate-400" />
                      <p className="text-sm font-medium text-slate-600">
                        Loading brands...
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredBrands.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-20 text-center">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-slate-600">
                        No brands found
                      </p>
                      <p className="text-xs text-slate-400">
                        Try creating a new brand
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredBrands.map((brand) => (
                  <TableRow
                    key={brand._id}
                    className="group border-t border-slate-100 transition hover:bg-slate-50/70"
                  >
                    <TableCell className="text-center">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand._id)}
                        onChange={() => toggleBrandSelection(brand._id)}
                        className="h-4 w-4 rounded border-slate-300 text-emerald-600"
                      />
                    </TableCell>

                    <TableCell className="text-center">
                      <img
                        src={brand.images?.[0]?.url || defaultAvatar}
                        alt={brand.name}
                        className="mx-auto h-11 w-11 rounded-full object-cover ring-2 ring-slate-100"
                      />
                    </TableCell>

                    <TableCell>
                      <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600">
                        {brand.name}
                      </span>
                    </TableCell>

                    <TableCell>
                      {(() => {
                        const status = getBrandStatus(brand);
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
                            navigate(`/dashboard/brands/edit/${brand._id}`)
                          }
                        />
                        <DeleteButton
                          onClick={() => {
                            setSelectedBrand(brand);
                            setOpen(true);
                          }}
                        />
                        <ViewButton
                          onClick={() => {
                            setViewBrand(brand);
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
            userName={selectedBrand?.name || ""}
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

          {/* ================= BULK DELETE CONFIRMATION ================= */}
          <ConfirmModal
            open={bulkDeleteOpen}
            userName={`${selectedBrands.length} brands`}
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
            userName={`${selectedBrands.length} brands`}
            onClose={() => setPermanentDeleteOpen(false)}
            onConfirm={async () => {
              await handlePermanentDeleteClick();
              setPermanentDeleteOpen(false);
            }}
            loading={loading}
          />

          {/* ================= VIEW BRAND ================= */}
          <ViewBrand
            brand={viewBrand}
            onClose={() => {
              setViewOpen(false);
              setViewBrand(null);
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

export default Brands;
