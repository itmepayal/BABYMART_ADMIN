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
        group relative flex items-center overflow-hidden
        rounded-xl text-sm font-medium
        transition-all duration-200

        ${open ? "gap-3 px-3 py-2.5" : "justify-center py-3"}

        ${
          isActive
            ? "bg-white text-emerald-700 shadow-md"
            : "text-white/80 hover:bg-white/10 hover:text-white"
        }
        `
      }
    >
      {({ isActive }: { isActive: boolean }) => (
        <>
          <span
            className={`
              absolute left-0 top-2 bottom-2 w-[3px] rounded-full bg-white
              transition-opacity duration-150
              ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-40"}
            `}
          />

          <span
            className={`
              w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0
              transition-all duration-150
              ${
                isActive
                  ? "bg-emerald-100/60"
                  : "bg-white/10 group-hover:bg-white/20"
              }
            `}
          >
            <span className="group-hover:scale-110 transition-transform duration-150">
              {icon}
            </span>
          </span>

          {open && <span className="tracking-wide truncate">{label}</span>}
        </>
      )}
    </NavLink>
  );
};
