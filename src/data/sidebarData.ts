import {
  LayoutDashboard,
  ShoppingBag,
  Tags,
  Boxes,
  Image,
  ClipboardList,
  Users,
  FileText,
} from "lucide-react";

export const sidebarItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/dashboard/products", label: "Products", icon: ShoppingBag },
  { to: "/dashboard/brands", label: "Brands", icon: Tags },
  { to: "/dashboard/categories", label: "Categories", icon: Boxes },
  { to: "/dashboard/banners", label: "Banners", icon: Image },
  { to: "/dashboard/orders", label: "Orders", icon: ClipboardList },
  { to: "/dashboard/users", label: "Users", icon: Users },
  { to: "/dashboard/invoices", label: "Invoices", icon: FileText },
];
