import {
  X,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
  Calendar,
  Tag,
  Layers,
  Percent,
  Link,
  Star,
  Globe,
  LayoutTemplate,
  Smartphone,
} from "lucide-react";

import { defaultAvatar } from "@/assets";

// ─── Types ────────────────────────────────────────────────────────────────────

type ImageType = {
  url: string;
  public_id?: string;
};

type BannerType = {
  _id: string;
  name: string;
  title: string;
  subtitle?: string;
  description?: string;
  slug?: string;
  bannerType: string;
  redirectUrl?: string;
  buttonText?: string;
  startFrom?: string;
  discountPercentage?: number;
  priority?: number;
  startDate?: string;
  endDate?: string;
  isFeatured?: boolean;
  isActive: boolean;
  isDeleted?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  desktopImage?: ImageType;
  mobileImage?: ImageType;
  // legacy shape
  image?: ImageType;
  createdAt: string;
  updatedAt?: string;
};

type Props = {
  banner: BannerType | null;
  onClose: () => void;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const BANNER_TYPE_EMOJI: Record<string, string> = {
  home: "🏠",
  offer: "🎁",
  category: "📂",
  product: "📦",
  "flash-sale": "⚡",
  seasonal: "🌸",
};

const fmt = (dateStr?: string) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// ─── InfoCard ─────────────────────────────────────────────────────────────────

type InfoCardProps = {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  accent: "emerald" | "teal" | "cyan";
};

const accentMap = {
  emerald: "bg-emerald-50 border-emerald-100",
  teal: "bg-teal-50 border-teal-100",
  cyan: "bg-cyan-50 border-cyan-100",
};

const InfoCard = ({ icon, label, value, accent }: InfoCardProps) => (
  <div
    className={`flex items-center justify-between rounded-xl border px-4 py-3 transition hover:brightness-95 ${accentMap[accent]}`}
  >
    <div className="flex items-center gap-2.5">
      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white shadow-sm">
        {icon}
      </div>
      <span className="text-sm font-medium text-gray-500">{label}</span>
    </div>
    <div className="max-w-[55%] text-right text-sm font-medium text-gray-800">
      {value}
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

export const ViewBanner = ({ banner, onClose }: Props) => {
  if (!banner) return null;

  const desktopUrl =
    banner.desktopImage?.url || banner.image?.url || defaultAvatar;
  const mobileUrl = banner.mobileImage?.url;
  const emoji = BANNER_TYPE_EMOJI[banner.bannerType] || "🏷️";

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="animate-in fade-in zoom-in-95 relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl duration-200 max-h-[90vh] overflow-y-auto"
      >
        {/* ─── GRADIENT HEADER ─── */}
        <div className="relative h-36 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 flex-shrink-0">
          <div className="absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-white/10" />
          <div className="absolute -bottom-14 -right-14 h-48 w-48 rounded-full bg-white/5" />
          <div className="absolute -top-6 -left-6 h-24 w-24 rounded-full bg-white/10" />

          <div className="absolute -mt-12 bottom-14 left-6">
            <p className="text-xs -mt-18 font-semibold uppercase tracking-widest text-white/70">
              Banner Details
            </p>
          </div>

          <button
            onClick={onClose}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30 hover:scale-105"
          >
            <X size={16} />
          </button>
        </div>

        {/* ─── AVATAR + NAME ─── */}
        <div className="relative px-6">
          <div className="-mt-26 flex items-end gap-4">
            <div className="relative shrink-0">
              <img
                src={desktopUrl}
                alt={banner.name}
                className="h-24 w-24 rounded-2xl border-4 border-white object-cover shadow-xl"
              />
              <span
                className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white ${
                  banner.isActive ? "bg-emerald-500" : "bg-red-400"
                }`}
              />
            </div>

            <div className="min-w-0 pb-2">
              <h2 className="truncate text-xl font-bold leading-tight text-white">
                {banner.name}
              </h2>

              <span
                className={`mt-1.5 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                  banner.isActive
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {banner.isActive ? (
                  <CheckCircle size={12} />
                ) : (
                  <XCircle size={12} />
                )}
                {banner.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>

        {/* ─── INFO CARDS ─── */}
        <div className="mt-5 space-y-2.5 px-6">
          <InfoCard
            icon={<LayoutTemplate size={15} className="text-teal-600" />}
            label="Title"
            value={banner.title}
            accent="teal"
          />

          <InfoCard
            icon={<Tag size={15} className="text-emerald-600" />}
            label="Banner Type"
            value={
              <span className="capitalize">
                {emoji} {banner.bannerType}
              </span>
            }
            accent="emerald"
          />

          {banner.isFeatured && (
            <InfoCard
              icon={<Star size={15} className="text-violet-600" />}
              label="Featured"
              value={
                <span className="rounded-full bg-violet-50 px-2 py-0.5 text-xs font-semibold text-violet-600">
                  Yes
                </span>
              }
              accent="teal"
            />
          )}

          {banner.discountPercentage !== undefined &&
            banner.discountPercentage !== null && (
              <InfoCard
                icon={<Percent size={15} className="text-red-500" />}
                label="Discount"
                value={`${banner.discountPercentage}%`}
                accent="cyan"
              />
            )}

          {banner.startFrom && (
            <InfoCard
              icon={<Tag size={15} className="text-emerald-600" />}
              label="Starting From"
              value={banner.startFrom}
              accent="emerald"
            />
          )}

          {banner.startDate && (
            <InfoCard
              icon={<Calendar size={15} className="text-teal-600" />}
              label="Start Date"
              value={fmt(banner.startDate)}
              accent="teal"
            />
          )}

          {banner.endDate && (
            <InfoCard
              icon={<Calendar size={15} className="text-cyan-600" />}
              label="End Date"
              value={fmt(banner.endDate)}
              accent="cyan"
            />
          )}

          {banner.priority !== undefined && banner.priority !== null && (
            <InfoCard
              icon={<Layers size={15} className="text-cyan-600" />}
              label="Priority"
              value={banner.priority}
              accent="cyan"
            />
          )}

          {banner.redirectUrl && (
            <InfoCard
              icon={<Link size={15} className="text-emerald-600" />}
              label="Redirect URL"
              value={
                <a
                  href={banner.redirectUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="truncate text-cyan-600 hover:underline"
                >
                  Visit
                </a>
              }
              accent="emerald"
            />
          )}

          {banner.buttonText && (
            <InfoCard
              icon={<Tag size={15} className="text-teal-600" />}
              label="Button Text"
              value={banner.buttonText}
              accent="teal"
            />
          )}

          {banner.seoTitle && (
            <InfoCard
              icon={<Globe size={15} className="text-cyan-600" />}
              label="SEO Title"
              value={
                <span className="truncate text-xs">{banner.seoTitle}</span>
              }
              accent="cyan"
            />
          )}

          <InfoCard
            icon={<Calendar size={15} className="text-teal-600" />}
            label="Created At"
            value={fmt(banner.createdAt)}
            accent="teal"
          />

          <InfoCard
            icon={<Tag size={15} className="text-emerald-600" />}
            label="Banner ID"
            value={
              <span className="font-mono text-xs text-gray-500 truncate">
                {banner._id}
              </span>
            }
            accent="emerald"
          />
        </div>

        {/* ─── DESKTOP IMAGE PREVIEW ─── */}
        <div className="mt-5 px-6">
          <p className="mb-2.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
            <ImageIcon size={14} />
            Desktop Image
          </p>

          <div className="overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-cyan-50 p-2.5">
            <img
              src={desktopUrl}
              alt={banner.name}
              className="h-44 w-full rounded-xl object-cover"
            />
          </div>
        </div>

        {/* ─── MOBILE IMAGE PREVIEW ─── */}
        {mobileUrl && (
          <div className="mt-4 px-6">
            <p className="mb-2.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
              <Smartphone size={14} />
              Mobile Image
            </p>

            <div className="overflow-hidden rounded-2xl border border-teal-100 bg-gradient-to-br from-teal-50 to-cyan-50 p-2.5">
              <img
                src={mobileUrl}
                alt={`${banner.name} mobile`}
                className="h-36 w-full rounded-xl object-cover"
              />
            </div>
          </div>
        )}

        {/* ─── DESCRIPTION ─── */}
        {banner.description && (
          <div className="mt-4 px-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Description
            </p>
            <p className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-600">
              {banner.description}
            </p>
          </div>
        )}

        {/* ─── FOOTER ─── */}
        <div className="mt-5 border-t border-gray-100 bg-gray-50/70 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 hover:shadow-md active:scale-[0.98]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
