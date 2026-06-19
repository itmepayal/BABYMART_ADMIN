import {
  X,
  CheckCircle2,
  Tag,
  Star,
  Smartphone,
  Monitor,
  ExternalLink,
  Calendar,
  Hash,
  Percent,
  ArrowUpRight,
  Text,
} from "lucide-react";

import { defaultAvatar } from "@/assets";

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
  image?: ImageType;
  createdAt: string;
  updatedAt?: string;
};

type Props = {
  banner: BannerType | null;
  onClose: () => void;
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

type RowProps = {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
};

const Row = ({ label, value, icon }: RowProps) => (
  <tr className="group border-t border-gray-100">
    <td className="py-3 text-[13px] text-gray-400 font-medium">
      <span className="flex items-center gap-2">
        {icon && (
          <span className="text-gray-300 group-hover:text-gray-400 transition-colors">
            {icon}
          </span>
        )}
        {label}
      </span>
    </td>
    <td className="py-3 text-right text-[13px] font-medium text-gray-800">
      {value}
    </td>
  </tr>
);

export const ViewBanner = ({ banner, onClose }: Props) => {
  if (!banner) return null;

  const desktopUrl =
    banner.desktopImage?.url || banner.image?.url || defaultAvatar;
  const mobileUrl = banner.mobileImage?.url;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-[3px]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="animate-in slide-in-from-right relative flex h-full w-full max-w-xl overflow-hidden bg-white shadow-2xl duration-300"
      >
        <div
          className={`w-1 flex-shrink-0 ${
            banner.isActive
              ? "bg-gradient-to-b from-emerald-400 to-emerald-600"
              : "bg-gradient-to-b from-red-300 to-red-500"
          }`}
        />

        <div className="flex-1 overflow-y-auto">
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white/98 px-6 py-4 backdrop-blur-sm">
            <div className="min-w-0 flex items-center gap-3">
              <div
                className={`h-2 w-2 rounded-full flex-shrink-0 ${
                  banner.isActive ? "bg-emerald-500" : "bg-red-400"
                }`}
              />
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                  Banner Details
                </p>
                <h2 className="mt-0.5 truncate text-[15px] font-semibold text-gray-900">
                  {banner.name}
                </h2>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="ml-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-400 transition-all hover:bg-gray-50 hover:text-gray-600 hover:border-gray-300"
            >
              <X size={15} />
            </button>
          </div>

          <div className="px-6 pt-5">
            <div className="flex gap-3">
              <div className="relative flex-1 overflow-hidden rounded-xl border border-gray-100">
                <img
                  src={desktopUrl}
                  alt={banner.name}
                  className="h-44 w-full object-cover"
                />
                <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-lg bg-white/95 px-2.5 py-1.5 text-[11px] font-semibold text-gray-600 shadow-sm">
                  <Monitor size={12} />
                  Desktop
                </span>
              </div>

              {mobileUrl && (
                <div className="relative w-[90px] overflow-hidden rounded-xl border border-gray-100">
                  <img
                    src={mobileUrl}
                    alt={`${banner.name} mobile`}
                    className="h-44 w-full object-cover"
                  />
                  <span className="absolute left-2 top-2 flex items-center gap-1 rounded-md bg-white/95 px-1.5 py-1 text-[10px] font-semibold text-gray-600 shadow-sm">
                    <Smartphone size={11} />
                  </span>
                </div>
              )}
            </div>

            <div className="mt-5">
              <h3 className="text-[15px] font-semibold text-gray-900 leading-snug">
                {banner.title}
              </h3>
              {banner.subtitle && (
                <p className="mt-1 text-[13px] text-gray-500">
                  {banner.subtitle}
                </p>
              )}
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <span
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-semibold ${
                  banner.isActive
                    ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                    : "bg-red-50 text-red-600 ring-1 ring-red-200"
                }`}
              >
                <CheckCircle2 size={13} />
                {banner.isActive ? "Active" : "Inactive"}
              </span>

              <span className="flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-[12px] font-semibold capitalize text-gray-600">
                <Tag size={13} />
                {banner.bannerType}
              </span>

              {banner.isFeatured && (
                <span className="flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-1.5 text-[12px] font-semibold text-amber-700 ring-1 ring-amber-200">
                  <Star size={13} />
                  Featured
                </span>
              )}
            </div>
            <div className="mt-5 border-t border-gray-100" />
            <table className="mt-1 w-full">
              <tbody>
                {banner.discountPercentage != null && (
                  <Row
                    icon={<Percent size={13} />}
                    label="Discount"
                    value={
                      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-emerald-700">
                        {banner.discountPercentage}% off
                      </span>
                    }
                  />
                )}

                {banner.priority != null && (
                  <Row
                    icon={<Hash size={13} />}
                    label="Priority"
                    value={
                      <span className="inline-flex items-center gap-1 rounded-md bg-gray-50 px-2 py-0.5 text-gray-700">
                        {banner.priority}
                      </span>
                    }
                  />
                )}

                {banner.startFrom && (
                  <Row
                    icon={<Calendar size={13} />}
                    label="Starting from"
                    value={banner.startFrom}
                  />
                )}

                {(banner.startDate || banner.endDate) && (
                  <Row
                    icon={<Calendar size={13} />}
                    label="Duration"
                    value={
                      <span className="flex items-center justify-end gap-1.5">
                        <span>{fmt(banner.startDate)}</span>
                        {banner.startDate && banner.endDate && (
                          <span className="text-gray-300">→</span>
                        )}
                        <span>{banner.endDate ? fmt(banner.endDate) : ""}</span>
                      </span>
                    }
                  />
                )}

                {banner.buttonText && (
                  <Row
                    icon={<Text size={13} />}
                    label="Button text"
                    value={
                      <span className="inline-flex items-center gap-1 rounded-md bg-gray-50 px-2 py-0.5 font-mono text-[12px] text-gray-700">
                        {banner.buttonText}
                      </span>
                    }
                  />
                )}

                {banner.redirectUrl && (
                  <Row
                    icon={<ArrowUpRight size={13} />}
                    label="Redirect"
                    value={
                      <a
                        href={banner.redirectUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-md bg-cyan-50 px-2 py-0.5 text-cyan-700 hover:bg-cyan-100 transition-colors"
                      >
                        View link
                        <ExternalLink size={11} />
                      </a>
                    }
                  />
                )}

                {banner.seoTitle && (
                  <Row
                    icon={<Text size={13} />}
                    label="SEO title"
                    value={
                      <span className="line-clamp-1 text-gray-600">
                        {banner.seoTitle}
                      </span>
                    }
                  />
                )}
                <Row
                  icon={<Calendar size={13} />}
                  label="Created"
                  value={fmt(banner.createdAt)}
                />
                {banner.updatedAt && (
                  <Row
                    icon={<Calendar size={13} />}
                    label="Updated"
                    value={fmt(banner.updatedAt)}
                  />
                )}
              </tbody>
            </table>
            {banner.description && (
              <div className="mt-5 rounded-xl bg-gray-50 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                  Description
                </p>
                <p className="mt-2 text-[13px] leading-relaxed text-gray-600">
                  {banner.description}
                </p>
              </div>
            )}
            {banner.seoDescription && (
              <div className="mt-3 rounded-xl bg-gray-50 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                  SEO Description
                </p>
                <p className="mt-2 text-[13px] leading-relaxed text-gray-600">
                  {banner.seoDescription}
                </p>
              </div>
            )}
            <div className="mt-6 flex items-center gap-2 rounded-lg border border-dashed border-gray-200 bg-gray-50 px-3 py-2.5">
              <span className="text-[11px] text-gray-400 font-medium">ID</span>
              <p className="truncate font-mono text-[11px] text-gray-500">
                {banner._id}
              </p>
            </div>
          </div>
          <div className="h-8" />
        </div>
      </div>
    </div>
  );
};
