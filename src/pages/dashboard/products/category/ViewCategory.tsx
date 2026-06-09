import {
  X,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
  Calendar,
  FolderTree,
  Tag,
} from "lucide-react";

import { defaultAvatar } from "@/assets";

type ImageType = {
  url: string;
  public_id?: string;
};

type CategoryType = {
  _id: string;
  name: string;
  categoryType: string;
  image: string | ImageType;
  isActive: boolean;
  createdAt: string;
};

type Props = {
  category: CategoryType | null;
  open?: boolean;
  onClose: () => void;
};

export const ViewCategory = ({ category, onClose }: Props) => {
  if (!category) return null;

  const imageUrl =
    typeof category.image === "string"
      ? category.image
      : category.image?.url || defaultAvatar;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="animate-in fade-in zoom-in-95 relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl duration-200"
      >
        <div className="relative h-36 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500">
          <div className="absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-white/10" />
          <div className="absolute -bottom-14 -right-14 h-48 w-48 rounded-full bg-white/5" />
          <div className="absolute -top-6 -left-6 h-24 w-24 rounded-full bg-white/10" />

          <div className="absolute bottom-14 left-6">
            <p className="text-xs -mt-18 font-semibold uppercase tracking-widest text-white/70">
              Category Details
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30 hover:scale-105"
          >
            <X size={16} />
          </button>
        </div>

        <div className="relative px-6">
          <div className="relative -mt-26 flex items-end gap-4">
            <div className="relative shrink-0">
              <img
                src={imageUrl}
                alt={category.name}
                className="h-24 w-24 rounded-2xl border-4 border-white object-cover shadow-xl"
              />
              <span
                className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white ${
                  category.isActive ? "bg-emerald-500" : "bg-red-400"
                }`}
              />
            </div>

            <div className="pb-2 min-w-0">
              <h2 className="text-xl font-bold text-white leading-tight truncate">
                {category.name}
              </h2>
              <span
                className={`mt-1.5 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                  category.isActive
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {category.isActive ? (
                  <CheckCircle size={12} />
                ) : (
                  <XCircle size={12} />
                )}
                {category.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-5 space-y-2.5 px-6">
          <InfoCard
            icon={<FolderTree size={15} className="text-teal-600" />}
            label="Category type"
            value={category.categoryType}
            accent="teal"
          />
          <InfoCard
            icon={<Calendar size={15} className="text-cyan-600" />}
            label="Created at"
            value={new Date(category.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
            accent="cyan"
          />
          <InfoCard
            icon={<Tag size={15} className="text-emerald-600" />}
            label="Category ID"
            value={
              <span className="font-mono text-xs text-gray-500 truncate">
                {category._id}
              </span>
            }
            accent="emerald"
          />
        </div>

        <div className="mt-5 px-6">
          <p className="mb-2.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
            <ImageIcon size={14} />
            Image preview
          </p>
          <div className="overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-cyan-50 p-2.5">
            <img
              src={imageUrl}
              alt={category.name}
              className="h-44 w-full rounded-xl object-cover"
            />
          </div>
        </div>

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

const InfoCard = ({ icon, label, value, accent }: InfoCardProps) => {
  return (
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
};
