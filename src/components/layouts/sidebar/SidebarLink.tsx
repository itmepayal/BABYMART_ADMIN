import { NavLink } from "react-router-dom";

type Props = {
  to: string;
  label: string;
  icon: React.ReactNode;
  open: boolean;
};

export const SidebarLink = ({ to, label, icon, open }: Props) => {
  return (
    <NavLink
      to={to}
      title={!open ? label : undefined}
      className={({ isActive }) =>
        `
        group relative flex items-center rounded-xl
        text-sm font-medium transition-all duration-200

        ${open ? "gap-3 px-4 py-2.5" : "justify-center py-3"}

        ${
          isActive
            ? "bg-white text-emerald-700 shadow-md"
            : "text-white/80 hover:bg-white/10 hover:text-white"
        }
        `
      }
    >
      <span className="absolute left-0 top-2 bottom-2 w-1 rounded-full bg-white opacity-0 group-hover:opacity-40 transition" />

      <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 group-hover:bg-white/20 transition">
        <span className="group-hover:scale-110 transition-transform">
          {icon}
        </span>
      </span>

      {open && <span className="tracking-wide">{label}</span>}
    </NavLink>
  );
};
