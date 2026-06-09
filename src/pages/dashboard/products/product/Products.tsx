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
import { ProductSkeleton } from "@/components/skeletons/ProductSkeleton";

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

  const {
    handleBulkDelete,
    handleBulkRestore,
    handleBulkPermanentDelete,
    loading: bulkLoading,
  } = useProductBulkActions();

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

  // ================= SKELETON =================
  if (loading) {
    return <ProductSkeleton />;
  }

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
      <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products by name..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-10 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            >
              ✕
            </button>
          )}
        </div>
      </div>
      {/* ================= TABLE SECTION ================= */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* ================= BULK ACTION TOOLBAR ================= */}
        {selectedProducts.length > 0 && (
          <div className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-6 py-4 backdrop-blur-md">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 shadow-sm">
                  <span className="text-base font-bold text-emerald-700">
                    {selectedProducts.length}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    {selectedProducts.length} Product
                    {selectedProducts.length > 1 ? "s" : ""} Selected
                  </h3>
                  <p className="text-xs text-slate-500">
                    Manage selected products with bulk actions
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
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-amber-600"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
                <button
                  onClick={() => setPermanentDeleteOpen(true)}
                  className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-red-700"
                >
                  <Trash size={16} />
                  Permanent Delete
                </button>
                <button
                  onClick={() => setSelectedProducts([])}
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
          <Table className="min-w-[1200px]">
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50 h-14!">
                <TableHead className="w-[50px] text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 rounded border-slate-300"
                  />
                </TableHead>
                <TableHead className="min-w-[280px]">Product</TableHead>
                <TableHead className="w-[110px] text-center">Price</TableHead>
                <TableHead className="w-[160px]">Category</TableHead>
                <TableHead className="w-[160px]">Brand</TableHead>
                <TableHead className="w-[120px] text-center">
                  Discount
                </TableHead>
                <TableHead className="w-[120px] text-center">Stock</TableHead>
                <TableHead className="w-[100px] text-center">Rating</TableHead>
                <TableHead className="w-[100px] text-center">Status</TableHead>
                <TableHead className="w-[150px] text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isFetchingProducts ? (
                <TableRow>
                  <TableCell colSpan={10} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2Icon className="h-6 w-6 animate-spin text-slate-400" />
                      <p className="text-sm text-slate-500">
                        Loading products...
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="py-20 text-center">
                    <p className="text-sm font-medium text-slate-600">
                      No products found
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Try creating a new product
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => {
                  const stockStatus = getStocks(product);
                  const productStatus = getProductStatus(product);

                  return (
                    <TableRow
                      key={product._id}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >
                      <TableCell className="text-center">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product._id)}
                          onChange={() => toggleSelection(product._id)}
                          className="h-4 w-4 rounded border-slate-300"
                        />
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={product.images?.[0]?.url || defaultAvatar}
                            alt={product.name}
                            className="h-12 w-12 rounded-xl border object-cover"
                          />

                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-900">
                              {product.name}
                            </p>
                            <p className="truncate text-xs text-slate-400">
                              ID: {product._id?.slice(0, 8) || "N/A"}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="text-center font-medium">
                        ₹{product.price}
                      </TableCell>

                      <TableCell>
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                          {product.category?.name || "No Category"}
                        </span>
                      </TableCell>

                      <TableCell>
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 capitalize">
                          {product.brand?.name || "No Brand"}
                        </span>
                      </TableCell>

                      <TableCell className="text-center">
                        {product.discountPercentage > 0 ? (
                          <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                            {product.discountPercentage}% OFF
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400">
                            No Discount
                          </span>
                        )}
                      </TableCell>

                      <TableCell className="text-center">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            stockStatus === "in-stock"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {stockStatus === "in-stock"
                            ? "In Stock"
                            : "Out of Stock"}
                        </span>
                      </TableCell>

                      <TableCell className="text-center">
                        {product.averageRating ? (
                          <span className="rounded-full bg-yellow-50 px-3 py-1 text-xs font-medium text-yellow-700">
                            ⭐ {product.averageRating.toFixed(1)}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400">
                            No Ratings
                          </span>
                        )}
                      </TableCell>

                      <TableCell className="text-center">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            productStatus === "active"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {productStatus === "active" ? "Active" : "Deleted"}
                        </span>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          {!product.isDeleted ? (
                            <>
                              <ViewButton
                                onClick={() => {
                                  setViewProduct(product);
                                  setViewOpen(true);
                                }}
                              />

                              <EditButton
                                onClick={() =>
                                  navigate(
                                    `/dashboard/products/edit/${product._id}`,
                                  )
                                }
                              />

                              <DeleteButton
                                onClick={() => {
                                  setSelectedProduct(product);
                                  setOpen(true);
                                }}
                              />
                            </>
                          ) : (
                            <button
                              onClick={async () => {
                                await handleBulkRestore([product._id]);

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
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
          {/* ================= SINGLE DELETE CONFIRMATION ================= */}
          <ConfirmModal
            open={open}
            userName={selectedProduct?.name || "product"}
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
            loading={bulkLoading}
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
            loading={bulkLoading}
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
