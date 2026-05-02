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

import { useProducts } from "@/hooks/product/useProducts";
import {
  useDeleteProduct,
  useProductBulkActions,
} from "@/hooks/product/useProductActions";

import {
  Trash2,
  RotateCcw,
  Trash,
  XCircle,
  Loader2Icon,
  Search,
  ShoppingBag,
} from "lucide-react";

import { FiPlus, FiRefreshCw } from "react-icons/fi";
import { defaultAvatar } from "@/assets";
import { ConfirmModal } from "@/components/dashbaord/ConfirmModal";
import { ViewProduct } from "./ViewProduct";

const Products = () => {
  const navigate = useNavigate();

  // ================= STATE =================
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [_, setViewOpen] = useState(false);
  const [viewProduct, setViewProduct] = useState<any>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [permanentDeleteOpen, setPermanentDeleteOpen] = useState(false);

  // ================= DATA =================
  const { products, loading, refetch, isFetchingProducts, page, pages, total } =
    useProducts({ search });

  const { handleDeleteProduct } = useDeleteProduct();

  const { handleBulkDelete, handleBulkRestore, handleBulkPermanentDelete } =
    useProductBulkActions();

  // ================= FILTER =================
  const filteredProducts = useMemo(() => {
    return products.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [products, search]);

  // ================= SELECTION =================
  const toggleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map((p) => p._id));
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };

  const isAllSelected =
    filteredProducts.length > 0 &&
    selectedProducts.length === filteredProducts.length;

  // ================= BULK ACTIONS =================
  const handleRestoreClick = async () => {
    await handleBulkRestore(selectedProducts);
    setSelectedProducts([]);
  };

  const handleBulkDeleteClick = async () => {
    await handleBulkDelete(selectedProducts);
    setSelectedProducts([]);
  };

  const handlePermanentDeleteClick = async () => {
    await handleBulkPermanentDelete(selectedProducts);
    setSelectedProducts([]);
  };

  // ================= STATUS =================
  const getProductStatus = (product: any) => {
    console.log(product);
    if (product.isDeleted) return "deleted";
    if (!product.isDeleted) return "active";
    return "active";
  };

  // ================= STOCKS =================
  const getStocks = (product: any) => {
    if (product.stock > 0) return "in-stock";
    return "out-of-stock";
  };

  return (
    <div className="space-y-6">
      {/* ================= PAGE HEADER ================= */}
      <Header
        title="Products Management"
        description="Manage products, pricing, stock, and visibility."
        icon={ShoppingBag}
        actionLabel="Add Product"
        actionIcon={FiPlus}
        onAction={() => navigate("/dashboard/products/create")}
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
            placeholder="Search products..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
        </div>
      </div>

      {/* ================= BRANDS TABLE SECTION ================= */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        {/* ================= BULK ACTION TOOLBAR ================= */}
        {selectedProducts.length > 0 && (
          <div className="border-b border-slate-100 px-6 py-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              {/* LEFT */}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                  <span className="text-sm font-bold text-emerald-600">
                    {selectedProducts.length}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    {selectedProducts.length} Products Selected
                  </h3>
                  <p className="text-xs text-slate-500">
                    Perform bulk actions on selected products
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
                  onClick={() => setSelectedProducts([])}
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
                  Name
                </TableHead>

                <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-500 pl-8">
                  Price
                </TableHead>

                <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Category Name
                </TableHead>

                <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Brand Name
                </TableHead>

                <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Discount (%)
                </TableHead>

                <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Stock
                </TableHead>

                <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Rating
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
              {isFetchingProducts ? (
                <TableRow>
                  <TableCell colSpan={11} className="py-20">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2Icon className="h-6 w-6 animate-spin text-slate-400" />
                      <p className="text-sm font-medium text-slate-600">
                        Loading products...
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="py-20 text-center">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-slate-600">
                        No products found
                      </p>
                      <p className="text-xs text-slate-400">
                        Try creating a new products
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <TableRow
                    key={product._id}
                    className="group border-t border-slate-100 transition hover:bg-slate-50/70"
                  >
                    <TableCell className="text-center">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product._id)}
                        onChange={() => toggleSelection(product._id)}
                        className="h-4 w-4 rounded border-slate-300 text-emerald-600"
                      />
                    </TableCell>

                    <TableCell className="text-center">
                      <img
                        src={product.images?.[0]?.url || defaultAvatar}
                        alt={product.name}
                        className="mx-auto h-11 w-11 rounded-full object-cover ring-2 ring-slate-100"
                      />
                    </TableCell>

                    <TableCell className="max-w-[120px]">
                      <div className="flex items-center gap-3">
                        <div className="min-w-0 flex flex-col">
                          <span className="truncate text-sm font-medium text-slate-900">
                            {product.name}
                          </span>
                          <span className="text-xs text-slate-400">
                            Product Name
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center justify-center">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                          ₹ {product.price}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex max-w-[140px] items-center gap-2 overflow-hidden whitespace-nowrap truncate rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                        <span className="h-2 w-2 flex-shrink-0 rounded-full bg-emerald-500" />
                        <span className="truncate">
                          {product?.category?.name || "No Category"}
                        </span>
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex max-w-[140px] items-center gap-2 overflow-hidden whitespace-nowrap truncate rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                        <span className="h-2 w-2 flex-shrink-0 rounded-full bg-emerald-500" />
                        <span className="truncate">
                          {product.brand?.name || "No Brand"}
                        </span>
                      </span>
                    </TableCell>

                    <TableCell>
                      {product.discountPercentage > 0 ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                          <span className="h-2 w-2 rounded-full bg-emerald-500" />
                          {product.discountPercentage}% OFF
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-500">
                          No Discount
                        </span>
                      )}
                    </TableCell>

                    <TableCell>
                      {(() => {
                        const status = getStocks(product);

                        const base =
                          "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border";

                        const styles: Record<string, string> = {
                          "in-stock":
                            "bg-emerald-50 text-emerald-700 border-emerald-200",
                          "out-of-stock":
                            "bg-red-50 text-red-700 border-red-200",
                        };

                        const labels: Record<string, string> = {
                          "in-stock": "In Stock",
                          "out-of-stock": "Out of Stock",
                        };

                        const dotColor: Record<string, string> = {
                          "in-stock": "bg-emerald-500",
                          "out-of-stock": "bg-red-500",
                        };

                        return (
                          <span className={`${base} ${styles[status]}`}>
                            <span
                              className={`h-2 w-2 rounded-full ${dotColor[status]}`}
                            />
                            {labels[status]}
                          </span>
                        );
                      })()}
                    </TableCell>

                    <TableCell>
                      {product.averageRating ? (
                        <div className="inline-flex items-center gap-2 rounded-full border border-yellow-200 bg-yellow-50 px-3 py-1 text-xs font-semibold text-yellow-700">
                          ⭐ {product.averageRating.toFixed(1)}
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-500">
                          No Ratings
                        </span>
                      )}
                    </TableCell>

                    <TableCell>
                      {(() => {
                        const status = getProductStatus(product);
                        const base =
                          "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border transition";
                        const styles = {
                          deleted:
                            "bg-slate-100 text-slate-600 border-slate-200",
                          active:
                            "bg-emerald-50 text-emerald-700 border-emerald-200",
                        };

                        const labels = {
                          deleted: "Deleted",
                          active: "Active",
                        };

                        return (
                          <span className={`${base} ${styles[status]}`}>
                            <span
                              className={`h-2 w-2 rounded-full ${
                                status === "deleted"
                                  ? "bg-slate-400"
                                  : status === "active" && "bg-emerald-500"
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
                            navigate(`/dashboard/products/edit/${product._id}`)
                          }
                        />

                        <DeleteButton
                          onClick={() => {
                            setSelectedProduct(product);
                            setOpen(true);
                          }}
                        />

                        {/* VIEW */}
                        <ViewButton
                          onClick={() => {
                            setViewProduct(product);
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
            userName={`${selectedProducts.length} products`}
            onClose={() => {
              setOpen(false);
              setSelectedProduct(null);
            }}
            onConfirm={async () => {
              if (!selectedProduct) return;

              await handleDeleteProduct(selectedProduct._id);

              setOpen(false);
              setSelectedProduct(null);
            }}
            loading={loading}
          />

          {/* ================= BULK DELETE CONFIRMATION ================= */}
          <ConfirmModal
            open={bulkDeleteOpen}
            userName={`${selectedProducts.length} products`}
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
            userName={`${selectedProducts.length} products`}
            onClose={() => setPermanentDeleteOpen(false)}
            onConfirm={async () => {
              await handlePermanentDeleteClick();
              setPermanentDeleteOpen(false);
            }}
            loading={loading}
          />

          {/* ================= VIEW BRAND ================= */}
          <ViewProduct
            product={viewProduct}
            onClose={() => {
              setViewOpen(false);
              setViewProduct(null);
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

export default Products;
