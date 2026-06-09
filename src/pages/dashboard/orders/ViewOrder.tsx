import {
  X,
  Calendar,
  CreditCard,
  ShoppingBag,
  MapPin,
  Mail,
  Package,
  CheckCircle,
  XCircle,
  Truck,
  Clock,
} from "lucide-react";

// ================= TYPES =================
type ProductType = {
  id?: string;
  name?: string;
  price?: number;
};

type OrderItemType = {
  product?: ProductType | null;
  quantity: number;
  price: number;
};

type ShippingAddressType = {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
};

export type OrderType = {
  _id?: string;
  id?: string;

  userId?: {
    email?: string;
    name?: string;
  };

  user?: {
    id?: string;
    name?: string;
    email?: string;
  };

  items?: OrderItemType[];

  total?: number;
  totalAmount?: number;

  status?: string;
  orderStatus?: string;

  paymentStatus?: string;

  paymentMethod?: string;

  shippingAddress?: ShippingAddressType;

  createdAt?: string;
};

type Props = {
  order: OrderType | null;
  onClose: () => void;
};

// ================= COMPONENT =================
export const ViewOrder = ({ order, onClose }: Props) => {
  if (!order) return null;

  // =========================================
  // NORMALIZE DATA
  // =========================================
  const orderId = order._id || order.id || "";

  const customer = order.userId || order.user;

  const orderStatus = order.orderStatus || order.status || "PENDING";

  const paymentStatus = order.paymentStatus || "PENDING";

  const total = order.totalAmount || order.total || 0;

  // =========================================
  // STATUS COLOR
  // =========================================
  const getStatusColor = (status?: string) => {
    switch (status?.toUpperCase()) {
      case "DELIVERED":
        return "bg-emerald-50 text-emerald-700";

      case "PROCESSING":
        return "bg-blue-50 text-blue-700";

      case "SHIPPED":
        return "bg-purple-50 text-purple-700";

      case "CANCELLED":
        return "bg-red-50 text-red-700";

      case "PAID":
        return "bg-emerald-50 text-emerald-700";

      case "FAILED":
        return "bg-red-50 text-red-700";

      default:
        return "bg-amber-50 text-amber-700";
    }
  };

  // =========================================
  // STATUS ICON
  // =========================================
  const getStatusIcon = (status?: string) => {
    switch (status?.toUpperCase()) {
      case "DELIVERED":
        return <CheckCircle size={14} />;

      case "CANCELLED":
        return <XCircle size={14} />;

      case "SHIPPED":
        return <Truck size={14} />;

      default:
        return <Clock size={14} />;
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[95vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-300"
      >
        {/* ========================================= */}
        {/* HEADER */}
        {/* ========================================= */}
        <div className="relative bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 px-6 py-8">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full bg-white/20 p-2 text-white transition hover:bg-white/30"
          >
            <X size={18} />
          </button>

          <div>
            <p className="text-sm text-white/80">Order Details</p>

            <h2 className="mt-1 text-2xl font-bold text-white">
              #{orderId.slice(-8)}
            </h2>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              {/* ORDER STATUS */}
              <span
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold ${getStatusColor(
                  orderStatus,
                )}`}
              >
                {getStatusIcon(orderStatus)}
                {orderStatus}
              </span>

              {/* PAYMENT STATUS */}
              <span
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold ${getStatusColor(
                  paymentStatus,
                )}`}
              >
                <CreditCard size={14} />
                {paymentStatus}
              </span>
            </div>
          </div>
        </div>

        {/* ========================================= */}
        {/* CONTENT */}
        {/* ========================================= */}
        <div className="space-y-6 p-6">
          {/* ========================================= */}
          {/* CUSTOMER */}
          {/* ========================================= */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">
              Customer Information
            </h3>

            <div className="grid gap-4 md:grid-cols-1">
              <InfoCard
                icon={<Mail size={16} />}
                label="Email"
                value={customer?.email || "No Email"}
              />
            </div>
          </div>

          {/* ========================================= */}
          {/* ORDER INFO */}
          {/* ========================================= */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">
              Order Information
            </h3>

            <div className="grid gap-4 md:grid-cols-2">
              <InfoCard
                icon={<ShoppingBag size={16} />}
                label="Payment Method"
                value={(order.paymentMethod || "N/A").toUpperCase()}
              />

              <InfoCard
                icon={<Calendar size={16} />}
                label="Created At"
                value={
                  order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString()
                    : "N/A"
                }
              />
            </div>
          </div>

          {/* ========================================= */}
          {/* SHIPPING */}
          {/* ========================================= */}
          {order.shippingAddress && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="mb-4 text-lg font-semibold text-slate-900">
                Shipping Address
              </h3>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="mt-1 text-emerald-600" />

                  <div className="space-y-1 text-sm text-slate-700">
                    <p>{order.shippingAddress?.street || "N/A"}</p>

                    <p>
                      {order.shippingAddress?.city || "N/A"},{" "}
                      {order.shippingAddress?.state || "N/A"}
                    </p>

                    <p>
                      {order.shippingAddress?.country || "N/A"} -{" "}
                      {order.shippingAddress?.postalCode || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================= */}
          {/* ORDER ITEMS */}
          {/* ========================================= */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">
              Order Items
            </h3>

            <div className="space-y-4">
              {(order.items || []).map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
                      <Package size={20} className="text-emerald-700" />
                    </div>

                    <div>
                      <h4 className="font-medium text-slate-900">
                        {item.product?.name || "Deleted Product"}
                      </h4>

                      <p className="text-sm text-slate-500">
                        Quantity: {item.quantity}
                      </p>

                      {item.product?.price && (
                        <p className="text-xs text-slate-400">
                          Product Price: ₹{item.product.price}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-slate-900">
                      ₹{item.price}
                    </p>

                    <p className="text-xs text-slate-400">Each</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ========================================= */}
          {/* TOTAL */}
          {/* ========================================= */}
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-slate-900">
                Total Amount
              </span>

              <span className="text-2xl font-bold text-emerald-700">
                ₹{total}
              </span>
            </div>
          </div>
        </div>

        {/* ========================================= */}
        {/* FOOTER */}
        {/* ========================================= */}
        <div className="border-t bg-slate-50 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full rounded-xl bg-slate-200 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ================= INFO CARD =================
type InfoCardProps = {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
};

const InfoCard = ({ icon, label, value }: InfoCardProps) => {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
        {icon}
      </div>

      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="mt-1 text-sm font-medium text-slate-900">{value}</p>
      </div>
    </div>
  );
};
