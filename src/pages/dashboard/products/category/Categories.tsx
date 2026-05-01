import { useState, useMemo } from "react";
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

import { useCategories } from "@/hooks/categories/useCategories";
import {
  useCategoryBulkActions,
  useDeleteCategory,
} from "@/hooks/categories/useCategoryActions";

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
import { ViewCategory } from "@/pages/dashboard/products/category/ViewCategory";

const Categories = () => {
  const navigate = useNavigate();

  // ================= STATE =================
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  const [viewOpen, setViewOpen] = useState(false);
  const [viewCategory, setViewCategory] = useState<any>(null);

  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [permanentDeleteOpen, setPermanentDeleteOpen] = useState(false);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  // ================= DATA =================
  const {
    categories,
    loading,
    refetch,
    isFetchingCategories,
    page,
    pages,
    total,
  } = useCategories();

  const { handleDeleteCategory } = useDeleteCategory();

  const { handleBulkDelete, handleBulkRestore, handleBulkPermanentDelete } =
    useCategoryBulkActions();

  // ================= FILTER =================
  const filteredCategories = useMemo(() => {
    return categories.filter((category) =>
      category.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [categories, search]);

  // ================= SELECTION =================
  const toggleSelectAll = () => {
    if (selectedCategories.length === filteredCategories.length) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(filteredCategories.map((category) => category._id));
    }
  };

  const toggleCategorySelection = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id)
        ? prev.filter((categoryId) => categoryId !== id)
        : [...prev, id],
    );
  };

  // ================= BULK ACTIONS =================
  const handleRestoreClick = async () => {
    await handleBulkRestore(selectedCategories);
    setSelectedCategories([]);
  };

  const handleBulkDeleteClick = async () => {
    await handleBulkDelete(selectedCategories);
    setSelectedCategories([]);
  };

  const handlePermanentDeleteClick = async () => {
    await handleBulkPermanentDelete(selectedCategories);
    setSelectedCategories([]);
  };

  // ================= HELPERS =================
  const isAllSelected =
    filteredCategories.length > 0 &&
    selectedCategories.length === filteredCategories.length;

  const getCategoryStatus = (category: any) => {
    if (category.isDeleted) return "deleted";
    if (category.isActive) return "active";
    return "inactive";
  };

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <Header
        title="Categories Management"
        description="Manage product categories and visibility."
        icon={Tag}
        actionLabel="Add Category"
        actionIcon={FiPlus}
        onAction={() => navigate("/dashboard/categories/create")}
        refreshIcon={FiRefreshCw}
        onRefresh={refetch}
        isRefreshing={loading}
      />

      {/* ================= SEARCH ================= */}
      <div className="rounded-2xl border bg-white px-4 py-3 shadow-sm">
        <div className="relative w-full max-w-sm">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
        </div>
      </div>

      {/* ================= TABLE WRAPPER ================= */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        {/* ================= BULK TOOLBAR ================= */}
        {selectedCategories.length > 0 && (
          <div className="border-b border-slate-100 px-6 py-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                  <span className="text-sm font-bold text-emerald-600">
                    {selectedCategories.length}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    {selectedCategories.length} Categories Selected
                  </h3>
                  <p className="text-xs text-slate-500">
                    Perform bulk actions on selected categories
                  </p>
                </div>
              </div>

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
                  className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-100"
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
                  onClick={() => setSelectedCategories([])}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                >
                  <XCircle size={16} />
                  Clear Selection
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= TABLE ================= */}
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
                  Category
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
              {isFetchingCategories ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-20">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2Icon className="h-6 w-6 animate-spin text-slate-400" />
                      <p className="text-sm font-medium text-slate-600">
                        Loading categories...
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredCategories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-20 text-center">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-slate-600">
                        No categories found
                      </p>
                      <p className="text-xs text-slate-400">
                        Try creating a new category
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredCategories.map((category) => (
                  <TableRow
                    key={category._id}
                    className="group border-t border-slate-100 transition hover:bg-slate-50/70"
                  >
                    <TableCell className="text-center">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category._id)}
                        onChange={() => toggleCategorySelection(category._id)}
                        className="h-4 w-4 rounded border-slate-300 text-emerald-600"
                      />
                    </TableCell>

                    <TableCell className="text-center">
                      <img
                        src={category.image?.url || defaultAvatar}
                        alt={category.name}
                        className="mx-auto h-11 w-11 rounded-full object-cover ring-2 ring-slate-100"
                      />
                    </TableCell>

                    <TableCell>
                      <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600">
                        {category.name}
                      </span>
                    </TableCell>

                    <TableCell>
                      {(() => {
                        const status = getCategoryStatus(category);

                        const base =
                          "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border";

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
                            navigate(
                              `/dashboard/categories/edit/${category._id}`,
                            )
                          }
                        />

                        <DeleteButton
                          onClick={() => {
                            setSelectedCategory(category);
                            setOpen(true);
                          }}
                        />

                        <ViewButton
                          onClick={() => {
                            setViewCategory(category);
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

          {/* SINGLE DELETE */}
          <ConfirmModal
            open={open}
            userName={selectedCategory?.name || ""}
            onClose={() => {
              setOpen(false);
              setSelectedCategory(null);
            }}
            onConfirm={async () => {
              if (!selectedCategory) return;

              await handleDeleteCategory(selectedCategory._id);

              setOpen(false);
              setSelectedCategory(null);
            }}
            loading={loading}
          />

          {/* BULK DELETE */}
          <ConfirmModal
            open={bulkDeleteOpen}
            userName={`${selectedCategories.length} categories`}
            onClose={() => setBulkDeleteOpen(false)}
            onConfirm={async () => {
              await handleBulkDeleteClick();
              setBulkDeleteOpen(false);
            }}
            loading={loading}
          />

          {/* PERMANENT DELETE */}
          <ConfirmModal
            open={permanentDeleteOpen}
            userName={`${selectedCategories.length} categories`}
            onClose={() => setPermanentDeleteOpen(false)}
            onConfirm={async () => {
              await handlePermanentDeleteClick();
              setPermanentDeleteOpen(false);
            }}
            loading={loading}
          />

          {/* VIEW CATEGORY */}
          <ViewCategory
            category={viewCategory}
            open={viewOpen}
            onClose={() => {
              setViewOpen(false);
              setViewCategory(null);
            }}
          />
        </div>

        {/* PAGINATION */}
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

export default Categories;
