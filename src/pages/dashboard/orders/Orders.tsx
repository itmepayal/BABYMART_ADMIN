import { useMemo, useState } from "react";
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
import { useOrders } from "@/hooks/orders/useOrders";
import {
  useDeleteOrder,
  useOrderBulkActions,
} from "@/hooks/orders/useOrderAction";
import { ViewOrder } from "@/pages/dashboard/orders/ViewOrder";
import {
  Trash2,
  XCircle,
  Loader2Icon,
  Search,
  ShoppingCart,
  PackageCheck,
} from "lucide-react";
import { FiRefreshCw } from "react-icons/fi";

const Orders = () => {
  const navigate = useNavigate();

  // =========================================
  // STATE
  // =========================================
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);

  // =========================================
  // DATA
  // =========================================
  const {
    orders = [],
    loading,
    refetch,
    isFetchingOrders,
    page,
    pages,
    total,
  } = useOrders();

  const { handleDeleteOrder } = useDeleteOrder();

  const { handleBulkDeleteOrders, loading: bulkLoading } =
    useOrderBulkActions();

  // =========================================
  // NORMALIZE API DATA
  // =========================================
  const normalizedOrders = useMemo(() => {
    return (orders || []).map((order: any) => ({
      _id: order?.id || order?._id || "",

      userId: {
        email: order?.user?.email || "No Email",
      },

      items: order?.items || [],

      totalAmount: order?.total || order?.totalAmount || 0,

      paymentStatus: order?.paymentStatus?.toUpperCase() || "PENDING",

      orderStatus: order?.status?.toUpperCase() || "PENDING",

      paymentMethod: order?.paymentMethod || "N/A",

      createdAt: order?.createdAt || null,
    }));
  }, [orders]);

  // =========================================
  // FILTER
  // =========================================
  const filteredOrders = useMemo(() => {
    return normalizedOrders.filter((order: any) => {
      const orderId = order?._id?.toString()?.toLowerCase() || "";

      return orderId.includes(search.toLowerCase());
    });
  }, [normalizedOrders, search]);

  // =========================================
  // VALID ORDERS
  // =========================================
  const validOrders = useMemo(() => {
    return filteredOrders.filter((order: any) => order?._id);
  }, [filteredOrders]);

  // =========================================
  // SELECTION
  // =========================================
  const toggleSelectAll = () => {
    if (selectedOrders.length === validOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(validOrders.map((o: any) => o._id));
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedOrders((prev) =>
      prev.includes(id) ? prev.filter((o) => o !== id) : [...prev, id],
    );
  };

  const isAllSelected =
    validOrders.length > 0 && selectedOrders.length === validOrders.length;

  // =========================================
  // BULK DELETE
  // =========================================
  const handleBulkDeleteClick = async () => {
    await handleBulkDeleteOrders(selectedOrders);

    setSelectedOrders([]);
  };

  // =========================================
  // ORDER STATUS COLOR
  // =========================================
  const getOrderStatusColor = (status?: string) => {
    switch (status) {
      case "DELIVERED":
        return "bg-emerald-50 text-emerald-700";

      case "PROCESSING":
        return "bg-blue-50 text-blue-700";

      case "SHIPPED":
        return "bg-purple-50 text-purple-700";

      case "CANCELLED":
        return "bg-red-50 text-red-700";

      case "PENDING":
        return "bg-amber-50 text-amber-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  // =========================================
  // PAYMENT STATUS COLOR
  // =========================================
  const getPaymentStatusColor = (status?: string) => {
    switch (status) {
      case "PAID":
        return "bg-emerald-50 text-emerald-700";

      case "FAILED":
        return "bg-red-50 text-red-700";

      case "REFUNDED":
        return "bg-slate-100 text-slate-700";

      case "PENDING":
        return "bg-amber-50 text-amber-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  // =========================================
  // LOADING
  // =========================================
  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2Icon className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ========================================= */}
      {/* HEADER */}
      {/* ========================================= */}
      <Header
        title="Orders Management"
        description="Manage orders, payments, shipping, and delivery."
        icon={ShoppingCart}
        refreshIcon={FiRefreshCw}
        onRefresh={() => refetch()}
        isRefreshing={loading}
      />

      {/* ========================================= */}
      {/* SEARCH */}
      {/* ========================================= */}
      <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search orders by ID..."
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

      {/* ========================================= */}
      {/* TABLE SECTION */}
      {/* ========================================= */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* ========================================= */}
        {/* BULK ACTIONS */}
        {/* ========================================= */}
        {selectedOrders.length > 0 && (
          <div className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-6 py-4 backdrop-blur-md">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 shadow-sm">
                  <span className="text-base font-bold text-emerald-700">
                    {selectedOrders.length}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    {selectedOrders.length} Order
                    {selectedOrders.length > 1 ? "s" : ""} Selected
                  </h3>

                  <p className="text-xs text-slate-500">
                    Manage selected orders
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setBulkDeleteOpen(true)}
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-amber-600"
                >
                  <Trash2 size={16} />
                  Delete
                </button>

                <button
                  onClick={() => setSelectedOrders([])}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  <XCircle size={16} />
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================= */}
        {/* TABLE */}
        {/* ========================================= */}
        <div className="overflow-x-auto">
          <Table className="min-w-[1200px]">
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

                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="text-center">Items</TableHead>
                <TableHead className="text-center">Amount</TableHead>
                <TableHead className="text-center">Payment</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Created</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isFetchingOrders ? (
                <TableRow>
                  <TableCell colSpan={9} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2Icon className="h-6 w-6 animate-spin text-slate-400" />

                      <p className="text-sm text-slate-500">
                        Loading orders...
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : validOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <PackageCheck className="h-10 w-10 text-slate-300" />

                      <p className="text-sm font-medium text-slate-600">
                        No orders found
                      </p>

                      <p className="text-xs text-slate-400">
                        Try creating a new order
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                validOrders.map((order: any) => (
                  <TableRow
                    key={order._id}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    {/* CHECKBOX */}
                    <TableCell className="text-center">
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order._id)}
                        onChange={() => toggleSelection(order._id)}
                        className="h-4 w-4 rounded border-slate-300"
                      />
                    </TableCell>

                    {/* ORDER ID */}
                    <TableCell>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          #{order._id.slice(-8)}
                        </p>

                        <p className="text-xs text-slate-400">
                          {order.paymentMethod}
                        </p>
                      </div>
                    </TableCell>

                    {/* CUSTOMER */}
                    <TableCell>
                      <div>
                        <p className="text-sm text-slate-800 font-medium">
                          {order.userId?.email || "No Email"}
                        </p>
                      </div>
                    </TableCell>

                    {/* ITEMS */}
                    <TableCell className="text-center">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                        {order.items.length} Items
                      </span>
                    </TableCell>

                    {/* TOTAL */}
                    <TableCell className="text-center font-semibold text-slate-800">
                      ₹{order.totalAmount}
                    </TableCell>

                    {/* PAYMENT */}
                    <TableCell className="text-center">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${getPaymentStatusColor(
                          order.paymentStatus,
                        )}`}
                      >
                        {order.paymentStatus}
                      </span>
                    </TableCell>

                    {/* STATUS */}
                    <TableCell className="text-center">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${getOrderStatusColor(
                          order.orderStatus,
                        )}`}
                      >
                        {order.orderStatus}
                      </span>
                    </TableCell>

                    {/* CREATED */}
                    <TableCell className="text-center text-sm text-slate-500">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : "N/A"}
                    </TableCell>

                    {/* ACTIONS */}
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <ViewButton
                          onClick={() => {
                            setSelectedOrder(order);
                            setViewOpen(true);
                          }}
                        />

                        <EditButton
                          onClick={() =>
                            navigate(`/dashboard/orders/edit/${order._id}`)
                          }
                        />

                        <DeleteButton
                          onClick={() => {
                            setSelectedOrder(order);
                            setOpen(true);
                          }}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* ========================================= */}
          {/* SINGLE DELETE */}
          {/* ========================================= */}
          <ConfirmModal
            open={open}
            userName={selectedOrder?._id || "order"}
            onClose={() => {
              setOpen(false);
              setSelectedOrder(null);
            }}
            onConfirm={async () => {
              if (!selectedOrder?._id) return;

              await handleDeleteOrder(selectedOrder._id);

              setOpen(false);

              setSelectedOrder(null);
            }}
            loading={loading}
          />

          {/* ========================================= */}
          {/* BULK DELETE */}
          {/* ========================================= */}
          <ConfirmModal
            open={bulkDeleteOpen}
            userName={`${selectedOrders.length} orders`}
            onClose={() => setBulkDeleteOpen(false)}
            onConfirm={async () => {
              await handleBulkDeleteClick();

              setBulkDeleteOpen(false);
            }}
            loading={bulkLoading}
          />

          {/* ========================================= */}
          {/* VIEW ORDER */}
          {/* ========================================= */}
          {viewOpen && (
            <ViewOrder
              order={selectedOrder}
              onClose={() => {
                setViewOpen(false);
                setSelectedOrder(null);
              }}
            />
          )}
        </div>

        {/* ========================================= */}
        {/* PAGINATION */}
        {/* ========================================= */}
        <Pagination
          page={page || 1}
          pages={pages || 1}
          total={total || 0}
          onChange={(p) =>
            refetch({
              page: p,
            })
          }
        />
      </div>
    </div>
  );
};

export default Orders;
