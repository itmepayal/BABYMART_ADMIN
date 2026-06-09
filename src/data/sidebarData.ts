import {
  LayoutDashboard,
  ShoppingBag,
  Tags,
  Boxes,
  Image,
  ClipboardList,
  Users,
  FileText,
  TicketPercent,
  Star,
  Bell,
  BarChart3,
  Store,
  Truck,
  RotateCcw,
  PackageSearch,
  CreditCard,
  LifeBuoy,
  ShieldCheck,
  Settings,
  Wallet,
  MessageSquare,
  MapPinned,
  Warehouse,
  UserCog,
  Layers3,
} from "lucide-react";

export const sidebarItems = [
  // =========================================
  // MAIN
  // =========================================
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },

  // =========================================
  // CATALOG
  // =========================================
  {
    to: "/dashboard/products",
    label: "Products",
    icon: ShoppingBag,
  },
  {
    to: "/dashboard/categories",
    label: "Categories",
    icon: Boxes,
  },
  {
    to: "/dashboard/brands",
    label: "Brands",
    icon: Tags,
  },
  {
    to: "/dashboard/banners",
    label: "Banners",
    icon: Image,
  },

  // =========================================
  // ORDERS
  // =========================================
  {
    to: "/dashboard/orders",
    label: "Orders",
    icon: ClipboardList,
  },
  {
    to: "/dashboard/invoices",
    label: "Invoices",
    icon: FileText,
  },
  {
    to: "/dashboard/refunds",
    label: "Refund Requests",
    icon: RotateCcw,
  },

  // =========================================
  // INVENTORY
  // =========================================
  {
    to: "/dashboard/inventory",
    label: "Inventory",
    icon: Warehouse,
  },
  {
    to: "/dashboard/stock",
    label: "Stock Management",
    icon: PackageSearch,
  },

  // =========================================
  // USERS & VENDORS
  // =========================================
  {
    to: "/dashboard/users",
    label: "Users",
    icon: Users,
  },
  {
    to: "/dashboard/vendors",
    label: "Vendors",
    icon: Store,
  },
  {
    to: "/dashboard/roles",
    label: "Roles & Permissions",
    icon: ShieldCheck,
  },
  {
    to: "/dashboard/staff",
    label: "Staff Management",
    icon: UserCog,
  },

  // =========================================
  // DELIVERY
  // =========================================
  {
    to: "/dashboard/delivery",
    label: "Delivery Management",
    icon: Truck,
  },
  {
    to: "/dashboard/tracking",
    label: "Live Tracking",
    icon: MapPinned,
  },

  // =========================================
  // PAYMENTS
  // =========================================
  {
    to: "/dashboard/payments",
    label: "Payments",
    icon: CreditCard,
  },
  {
    to: "/dashboard/wallets",
    label: "Wallets",
    icon: Wallet,
  },

  // =========================================
  // MARKETING
  // =========================================
  {
    to: "/dashboard/coupons",
    label: "Coupons",
    icon: TicketPercent,
  },
  {
    to: "/dashboard/reviews",
    label: "Reviews",
    icon: Star,
  },
  {
    to: "/dashboard/broadcasts",
    label: "Notifications",
    icon: Bell,
  },

  // =========================================
  // SUPPORT
  // =========================================
  {
    to: "/dashboard/support",
    label: "Support Tickets",
    icon: LifeBuoy,
  },
  {
    to: "/dashboard/chat-support",
    label: "Customer Chats",
    icon: MessageSquare,
  },

  // =========================================
  // ANALYTICS
  // =========================================
  {
    to: "/dashboard/analytics",
    label: "Analytics",
    icon: BarChart3,
  },

  // =========================================
  // SYSTEM
  // =========================================
  {
    to: "/dashboard/settings",
    label: "Settings",
    icon: Settings,
  },
  {
    to: "/dashboard/logs",
    label: "Activity Logs",
    icon: Layers3,
  },
];
