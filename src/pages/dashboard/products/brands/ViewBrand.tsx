import {
  X,
  Image as ImageIcon,
  Layers,
  CheckCircle,
  XCircle,
  Calendar,
} from "lucide-react";

import { defaultAvatar } from "@/assets";

type ImageType = {
  url: string;
  public_id?: string;
};

type BrandType = {
  _id: string;
  name: string;
  images: ImageType[];
  isActive: boolean;
  createdAt: string;
};

type Props = {
  brand: BrandType | null;
  onClose: () => void;
};

export const ViewBrand = ({ brand, onClose }: Props) => {
  if (!brand) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-300"
      >
        {/* HEADER */}
        <div className="relative h-32 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full bg-white/20 p-2 text-white hover:bg-white/30"
          >
            <X size={18} />
          </button>
        </div>

        {/* BRAND PROFILE */}
        <div className="relative px-6 pb-6 text-center">
          <img
            src={brand.images?.[0]?.url || defaultAvatar}
            alt={brand.name}
            className="mx-auto -mt-14 h-28 w-28 rounded-full border-4 border-white object-cover shadow-xl"
          />

          <h2 className="mt-4 text-2xl font-bold text-gray-900">
            {brand.name}
          </h2>

          {/* STATUS */}
          <div className="mt-4">
            <span
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide ${
                brand.isActive
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-red-50 text-red-600"
              }`}
            >
              {brand.isActive ? (
                <CheckCircle size={14} />
              ) : (
                <XCircle size={14} />
              )}
              {brand.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        {/* DETAILS */}
        <div className="space-y-3 px-6 pb-6">
          <InfoCard
            label="Total Images"
            value={
              <span className="flex items-center gap-2 text-gray-700">
                <Layers size={15} />
                {brand.images?.length || 0}
              </span>
            }
          />

          <InfoCard
            label="Created At"
            value={
              <span className="flex items-center gap-2 text-gray-700">
                <Calendar size={15} />
                {new Date(brand.createdAt).toLocaleDateString()}
              </span>
            }
          />
        </div>

        {/* IMAGES GRID */}
        {brand.images && brand.images.length > 0 && (
          <div className="px-6 pb-6">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
              <ImageIcon size={16} />
              Brand Images
            </h3>

            <div className="grid grid-cols-3 gap-3 max-h-[220px] overflow-y-auto">
              {brand.images.map((img, index) => (
                <img
                  key={index}
                  src={img.url}
                  alt="brand"
                  className="h-20 w-full rounded-xl object-cover border"
                />
              ))}
            </div>
          </div>
        )}

        {/* FOOTER */}
        <div className="border-t bg-gray-50 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full rounded-xl bg-gray-200 py-3 text-sm font-medium text-slate-600 hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ================= INFO CARD =================
type InfoCardProps = {
  label: string;
  value: React.ReactNode;
};

const InfoCard = ({ label, value }: InfoCardProps) => {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 px-4 py-4 hover:bg-gray-100">
      <span className="text-sm font-medium text-gray-500">{label}</span>
      <div className="max-w-[60%] text-sm">{value}</div>
    </div>
  );
};
