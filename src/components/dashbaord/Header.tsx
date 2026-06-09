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
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* ── Top gradient accent bar ── */}
      <div className="h-[3px] bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />

      {/* ── Header content ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-[18px]">
        {/* Left — icon + title */}
        <div className="flex items-center gap-3.5">
          {Icon && (
            <div className="flex h-[46px] w-[46px] flex-shrink-0 items-center justify-center rounded-[13px] bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 shadow-[0_2px_8px_rgba(16,185,129,0.28)]">
              <Icon size={20} className="text-white" />
            </div>
          )}
          <div className="flex flex-col gap-0.5">
            <h1 className="text-[17px] font-semibold leading-tight tracking-tight text-slate-800">
              {title}
            </h1>
            {description && (
              <p className="text-[13px] leading-snug text-slate-500">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Right — actions (admin-only) */}
        {isAdmin && (
          <div className="flex items-center gap-2.5">
            {children}

            {/* Refresh button */}
            {onRefresh && isRefreshiingShow && (
              <RefreshButton onClick={onRefresh} loading={isRefreshing} />
            )}

            {/* Divider — only when both refresh + action exist */}
            {onRefresh && isRefreshiingShow && actionLabel && (
              <div className="h-5 w-px bg-slate-200" />
            )}

            {/* Primary action button */}
            {actionLabel && (
              <button
                onClick={onAction}
                className="
                  inline-flex items-center gap-1.5
                  h-9 px-[18px]
                  rounded-[10px] border-none
                  bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500
                  text-[13px] font-medium text-white
                  shadow-[0_2px_8px_rgba(16,185,129,0.30)]
                  transition-all duration-150
                  hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600
                  hover:shadow-[0_3px_10px_rgba(16,185,129,0.38)]
                  active:scale-[0.97]
                  whitespace-nowrap
                "
              >
                {ActionIcon && <ActionIcon size={15} />}
                <span>{actionLabel}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
