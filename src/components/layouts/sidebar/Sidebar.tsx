import { useMemo, useState } from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  Tags,
  Boxes,
  Image,
  ClipboardList,
  Users,
  FileText,
  ShoppingCart,
  Menu,
  X,
  User,
  Lock,
  Shield,
  Truck,
  CreditCard,
  BarChart3,
  Star,
  TicketPercent,
  Warehouse,
  RotateCcw,
  PackageSearch,
  Store,
  UserCog,
  ShieldCheck,
  Settings,
  Layers3,
  LifeBuoy,
} from "lucide-react";
import { SidebarLink } from "./SidebarLink";
import { useAuthStore } from "@/store/auth/useAuthStore";

interface SidebarItem {
  label: string;
  to: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
}

interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

export const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const { isAdmin } = useAuthStore();

  const sections: SidebarSection[] = useMemo(
    () => [
      {
        title: "Main",
        items: [
          {
            label: "Dashboard",
            to: "/dashboard",
            icon: <LayoutDashboard size={18} />,
          },
        ],
      },
      {
        title: "Catalog",
        items: [
          {
            label: "Products",
            to: "/dashboard/products",
            icon: <ShoppingBag size={18} />,
          },
          {
            label: "Brands",
            to: "/dashboard/brands",
            icon: <Tags size={18} />,
          },
          {
            label: "Categories",
            to: "/dashboard/categories",
            icon: <Boxes size={18} />,
          },
          {
            label: "Banners",
            to: "/dashboard/banners",
            icon: <Image size={18} />,
          },
        ],
      },
      {
        title: "Orders",
        items: [
          {
            label: "Orders",
            to: "/dashboard/orders",
            icon: <ClipboardList size={18} />,
          },
          {
            label: "Invoices",
            to: "/dashboard/invoices",
            icon: <FileText size={18} />,
            adminOnly: true,
          },
          {
            label: "Refund Requests",
            to: "/dashboard/refunds",
            icon: <RotateCcw size={18} />,
          },
        ],
      },
      {
        title: "Inventory",
        items: [
          {
            label: "Inventory",
            to: "/dashboard/inventory",
            icon: <Warehouse size={18} />,
          },
          {
            label: "Stock Management",
            to: "/dashboard/stock",
            icon: <PackageSearch size={18} />,
          },
        ],
      },
      {
        title: "Users & Vendors",
        items: [
          {
            label: "Users",
            to: "/dashboard/users",
            icon: <Users size={18} />,
            adminOnly: true,
          },
          {
            label: "Vendors",
            to: "/dashboard/vendors",
            icon: <Store size={18} />,
            adminOnly: true,
          },
          {
            label: "Staff",
            to: "/dashboard/staff",
            icon: <UserCog size={18} />,
            adminOnly: true,
          },
          {
            label: "Roles",
            to: "/dashboard/roles",
            icon: <ShieldCheck size={18} />,
            adminOnly: true,
          },
        ],
      },
      {
        title: "Business",
        items: [
          {
            label: "Delivery",
            to: "/dashboard/delivery",
            icon: <Truck size={18} />,
          },
          {
            label: "Payments",
            to: "/dashboard/payments",
            icon: <CreditCard size={18} />,
          },
          {
            label: "Analytics",
            to: "/dashboard/analytics",
            icon: <BarChart3 size={18} />,
          },
        ],
      },
      {
        title: "Marketing",
        items: [
          {
            label: "Coupons",
            to: "/dashboard/coupons",
            icon: <TicketPercent size={18} />,
          },
          {
            label: "Reviews",
            to: "/dashboard/reviews",
            icon: <Star size={18} />,
          },
        ],
      },
      {
        title: "Support",
        items: [
          {
            label: "Support Tickets",
            to: "/dashboard/support",
            icon: <LifeBuoy size={18} />,
          },
        ],
      },
      {
        title: "Settings",
        items: [
          {
            label: "Profile",
            to: "/dashboard/profile",
            icon: <User size={18} />,
          },
          {
            label: "Security",
            to: "/dashboard/security",
            icon: <Lock size={18} />,
          },
          {
            label: "Settings",
            to: "/dashboard/settings",
            icon: <Settings size={18} />,
            adminOnly: true,
          },
          {
            label: "Logs",
            to: "/dashboard/logs",
            icon: <Layers3 size={18} />,
            adminOnly: true,
          },
          {
            label: "System",
            to: "/dashboard/system-settings",
            icon: <Shield size={18} />,
            adminOnly: true,
          },
        ],
      },
    ],
    [],
  );

  return (
    <aside
      className={`
        sticky top-0 h-screen flex flex-col justify-between
        bg-gradient-to-b from-emerald-600 via-teal-600 to-cyan-600
        text-white shadow-2xl border-r border-white/10
        transition-all duration-300 ease-in-out
        ${open ? "w-72" : "w-20"}
      `}
    >
      <div className="flex flex-col overflow-hidden">
        <div className="p-4 flex items-center justify-between border-b border-white/10">
          {open ? (
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 rounded-xl bg-white/20 blur-md scale-110" />
                <div className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-white/15 backdrop-blur-md shadow-lg border border-white/20">
                  <ShoppingCart className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="leading-tight">
                <h1 className="text-lg font-bold">BabyMart</h1>
                <p className="text-xs text-white/70">Ecommerce Admin Panel</p>
              </div>
            </div>
          ) : (
            <div className="mx-auto">
              <ShoppingCart className="w-6 h-6" />
            </div>
          )}

          <button
            onClick={() => setOpen(!open)}
            className={`rounded-xl transition-all duration-200 hover:bg-white/10 active:scale-95 ${open ? "p-2" : "p-4"}`}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-6">
          {sections.map((section) => {
            const filteredItems = section.items.filter(
              (item) => !item.adminOnly || isAdmin,
            );
            if (filteredItems.length === 0) return null;

            return (
              <div key={section.title} className="space-y-1.5">
                {open && (
                  <p className="px-3 pb-1 text-xs uppercase tracking-wider text-white/60">
                    {section.title}
                  </p>
                )}
                {filteredItems.map((item) => (
                  <SidebarLink
                    key={item.to}
                    open={open}
                    to={item.to}
                    label={item.label}
                    icon={item.icon}
                  />
                ))}
              </div>
            );
          })}
        </nav>
      </div>

      <div>
        <div className="p-3 border-t border-white/10">
          {open && (
            <p className="px-3 mb-2 text-xs uppercase tracking-wide text-white/60">
              Quick Info
            </p>
          )}

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
            {open ? (
              <>
                <p className="text-sm font-semibold">BabyMart Admin</p>
                <p className="mt-1 text-xs text-white/60">
                  Manage products, orders, analytics and delivery easily.
                </p>
                <div className="mt-4 flex items-center justify-between text-xs text-white/50">
                  <span>Version 2.0</span>
                  <span>© 2026</span>
                </div>
              </>
            ) : (
              <div className="flex justify-center">
                <div className="h-3 w-3 rounded-full bg-green-400" />
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};
