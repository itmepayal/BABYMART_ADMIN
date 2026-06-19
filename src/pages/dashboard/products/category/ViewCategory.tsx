import {
  X,
  CheckCircle2,
  XCircle,
  FolderTree,
  Calendar,
  ImageIcon,
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

export const ViewCategory = ({ category, onClose }: Props) => {
  if (!category) return null;

  const imageUrl =
    typeof category.image === "string"
      ? category.image
      : category.image?.url || defaultAvatar;

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
            category.isActive
              ? "bg-gradient-to-b from-emerald-400 to-emerald-600"
              : "bg-gradient-to-b from-red-300 to-red-500"
          }`}
        />

        <div className="flex-1 overflow-y-auto">
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white/98 px-6 py-4 backdrop-blur-sm">
            <div className="min-w-0 flex items-center gap-3">
              <div
                className={`h-2 w-2 rounded-full flex-shrink-0 ${
                  category.isActive ? "bg-emerald-500" : "bg-red-400"
                }`}
              />
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                  Category Details
                </p>
                <h2 className="mt-0.5 truncate text-[15px] font-semibold text-gray-900">
                  {category.name}
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
            <div className="relative overflow-hidden rounded-xl border border-gray-100 bg-gray-50 h-44 flex items-center justify-center">
              <img
                src={imageUrl}
                alt={category.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute -bottom-5 left-5">
                <div className="relative">
                  <img
                    src={imageUrl}
                    alt={category.name}
                    className="h-16 w-16 rounded-xl border-4 border-white object-cover shadow-md"
                  />
                  <span
                    className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white ${
                      category.isActive ? "bg-emerald-500" : "bg-red-400"
                    }`}
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 ml-1">
              <h3 className="text-[15px] font-semibold text-gray-900 leading-snug">
                {category.name}
              </h3>
              <p className="mt-0.5 text-[13px] text-gray-400 font-mono capitalize">
                {category.categoryType}
              </p>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <span
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-semibold ${
                  category.isActive
                    ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                    : "bg-red-50 text-red-600 ring-1 ring-red-200"
                }`}
              >
                {category.isActive ? (
                  <CheckCircle2 size={13} />
                ) : (
                  <XCircle size={13} />
                )}
                {category.isActive ? "Active" : "Inactive"}
              </span>

              <span className="flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-[12px] font-semibold capitalize text-gray-600">
                <FolderTree size={13} />
                {category.categoryType}
              </span>
            </div>

            <div className="mt-5 border-t border-gray-100" />

            <table className="mt-1 w-full">
              <tbody>
                <Row
                  icon={<FolderTree size={13} />}
                  label="Category type"
                  value={
                    <span className="inline-flex items-center gap-1 rounded-md bg-gray-50 px-2 py-0.5 capitalize text-gray-700">
                      {category.categoryType}
                    </span>
                  }
                />

                <Row
                  icon={<Calendar size={13} />}
                  label="Created"
                  value={fmt(category.createdAt)}
                />
              </tbody>
            </table>

            <div className="mt-5">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
                <ImageIcon size={13} />
                Image Preview
              </p>
              <div className="overflow-hidden rounded-xl border border-gray-100">
                <img
                  src={imageUrl}
                  alt={category.name}
                  className="h-40 w-full object-cover"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center gap-2 rounded-lg border border-dashed border-gray-200 bg-gray-50 px-3 py-2.5">
              <span className="text-[11px] text-gray-400 font-medium">ID</span>
              <p className="truncate font-mono text-[11px] text-gray-500">
                {category._id}
              </p>
            </div>
          </div>

          <div className="h-8" />
        </div>
      </div>
    </div>
  );
};
