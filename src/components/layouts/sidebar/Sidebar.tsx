import { useState } from "react";
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
} from "lucide-react";
import { SidebarLink } from "./SidebarLink";
import { useAuthStore } from "@/store/auth/useAuthStore";

export const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const { isAdmin } = useAuthStore();

  return (
    <aside
      className={`
        flex flex-col justify-between
        bg-gradient-to-b from-emerald-600 via-teal-600 to-cyan-600 text-white shadow-2xl
        transition-all duration-300 ease-in-out
        ${open ? "w-72" : "w-20"}
      `}
    >
      {/* TOP SECTION */}
      <div>
        {/* HEADER */}
        <div className="p-4 flex items-center justify-between border-b border-white/10">
          {open && (
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 rounded-xl bg-white/20 blur-md scale-110" />
                <div className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-white/15 backdrop-blur-md shadow-lg border border-white/20">
                  <ShoppingCart className="w-5 h-5 text-white" />
                </div>
              </div>

              <div className="leading-tight">
                <h1 className="text-lg font-bold">BabyMart</h1>
                <p className="text-xs text-white/70">Admin Panel</p>
              </div>
            </div>
          )}

          {/* TOGGLE */}
          <button
            onClick={() => setOpen(!open)}
            className={`rounded-xl hover:bg-white/10 transition ${
              open ? "p-2" : "p-5"
            }`}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* NAV */}
        <nav className="p-3 space-y-1.5">
          <SidebarLink
            open={open}
            to="/dashboard"
            label="Dashboard"
            icon={<LayoutDashboard size={18} />}
          />
          <SidebarLink
            open={open}
            to="/dashboard/products"
            label="Products"
            icon={<ShoppingBag size={18} />}
          />
          <SidebarLink
            open={open}
            to="/dashboard/brands"
            label="Brands"
            icon={<Tags size={18} />}
          />
          <SidebarLink
            open={open}
            to="/dashboard/categories"
            label="Categories"
            icon={<Boxes size={18} />}
          />
          <SidebarLink
            open={open}
            to="/dashboard/banners"
            label="Banners"
            icon={<Image size={18} />}
          />
          <SidebarLink
            open={open}
            to="/dashboard/orders"
            label="Orders"
            icon={<ClipboardList size={18} />}
          />

          {isAdmin && (
            <>
              <SidebarLink
                open={open}
                to="/dashboard/users"
                label="Users"
                icon={<Users size={18} />}
              />
              <SidebarLink
                open={open}
                to="/dashboard/invoices"
                label="Invoices"
                icon={<FileText size={18} />}
              />
            </>
          )}
        </nav>
      </div>

      {/* BOTTOM SECTION */}
      <div>
        {/* SETTINGS */}
        <div className="p-3 border-t border-white/10">
          <p
            className={`px-3 mb-2 text-xs uppercase tracking-wide text-white/60 ${
              !open && "text-center"
            }`}
          >
            {open ? "Settings" : "..."}
          </p>

          <div className="space-y-1.5">
            <SidebarLink
              open={open}
              to="/dashboard/profile"
              label="Profile"
              icon={<User size={18} />}
            />

            <SidebarLink
              open={open}
              to="/dashboard/security"
              label="Security"
              icon={<Lock size={18} />}
            />

            {isAdmin && (
              <SidebarLink
                open={open}
                to="/dashboard/system-settings"
                label="System"
                icon={<Shield size={18} />}
              />
            )}
          </div>
        </div>

        {/* FOOTER */}
        {open && (
          <div className="p-4 border-t border-white/10 text-xs text-white/70">
            © 2026 BabyMart Admin
          </div>
        )}
      </div>
    </aside>
  );
};
