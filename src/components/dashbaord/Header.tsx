import { useAuthStore } from "@/store/auth/useAuthStore";
import type { ReactNode, ComponentType } from "react";
import { RefreshButton } from "@/components/common/Action";

export type HeaderProps = {
  title: string;
  description?: string;

  icon?: ComponentType<{ size?: number; className?: string }>;
  actionIcon?: ComponentType<{ size?: number; className?: string }>;
  refreshIcon?: ComponentType<{ size?: number; className?: string }>;

  actionLabel?: string;
  onAction?: () => void;

  onRefresh?: () => void;
  isRefreshing?: boolean;
  isRefreshiingShow?: boolean;

  children?: ReactNode;
};

export const Header = ({
  title,
  description,
  icon: Icon,
  actionIcon: ActionIcon,
  actionLabel,
  onAction,
  onRefresh,
  children,
  isRefreshing,
  isRefreshiingShow = true,
}: HeaderProps) => {
  const { isAdmin } = useAuthStore();

  return (
    <div className="flex items-center justify-between px-4 py-5 rounded-2xl border bg-white shadow-sm">
      <div className="flex items-center gap-4">
        {Icon && (
          <div className="p-3 rounded-2xl bg-gradient-to-b from-emerald-400 via-teal-400 to-cyan-400 text-white shadow-sm">
            <Icon size={22} />
          </div>
        )}
        <div>
          <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
          {description && (
            <p className="text-gray-500 text-sm mt-0.5">{description}</p>
          )}
        </div>
      </div>
      {isAdmin && (
        <div className="flex items-center gap-3">
          {children}
          {onRefresh && isRefreshiingShow && (
            <RefreshButton onClick={onRefresh} loading={isRefreshing} />
          )}
          {actionLabel && (
            <button
              onClick={onAction}
              className="flex items-center gap-2 px-5 py-2.5 text-sm rounded-xl text-white shadow-sm cursor-pointer
              transition-all duration-300 active:scale-95
              bg-gradient-to-b from-emerald-500 via-teal-500 to-cyan-500
              hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600"
            >
              {ActionIcon && <ActionIcon size={16} />}
              <span className="font-medium">{actionLabel}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
