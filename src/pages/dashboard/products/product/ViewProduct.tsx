import {
  X,
  Package,
  IndianRupee,
  Calendar,
  CheckCircle2,
  XCircle,
  Tag,
  Boxes,
  Star,
  Barcode,
  Percent,
  ChevronLeft,
  ChevronRight,
  Hash,
} from "lucide-react";

import { useState, useEffect } from "react";
import { defaultAvatar } from "@/assets";

type ImageType = {
  url: string;
};

type ProductType = {
  _id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  sku?: string;
  averageRating?: number;
  discountPercentage?: number;
  category?: { name: string };
  brand?: { name: string };
  images?: ImageType[];
  isDeleted: boolean;
  createdAt: string;
};

type Props = {
  product: ProductType | null;
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

export const ViewProduct = ({ product, onClose }: Props) => {
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    setSelectedImage(0);
  }, [product]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  if (!product) return null;

  const images = product.images?.length
    ? product.images
    : [{ url: defaultAvatar }];
  const isActive = !product.isDeleted;
  const mainImage = images[selectedImage]?.url || defaultAvatar;
  const firstImage = images[0]?.url || defaultAvatar;

  const nextImage = () =>
    setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  const prevImage = () =>
    setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  const stockColor =
    product.stock < 10
      ? "text-red-600 bg-red-50 ring-1 ring-red-200"
      : product.stock < 30
        ? "text-amber-700 bg-amber-50 ring-1 ring-amber-200"
        : "text-emerald-700 bg-emerald-50 ring-1 ring-emerald-200";

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
            isActive
              ? "bg-gradient-to-b from-emerald-400 to-emerald-600"
              : "bg-gradient-to-b from-red-300 to-red-500"
          }`}
        />

        <div className="flex-1 overflow-y-auto">
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white/98 px-6 py-4 backdrop-blur-sm">
            <div className="min-w-0 flex items-center gap-3">
              <div
                className={`h-2 w-2 rounded-full flex-shrink-0 ${
                  isActive ? "bg-emerald-500" : "bg-red-400"
                }`}
              />
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                  Product Details
                </p>
                <h2 className="mt-0.5 truncate text-[15px] font-semibold text-gray-900">
                  {product.name}
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
            <div className="relative overflow-hidden rounded-xl border border-gray-100">
              <img
                src={mainImage}
                alt={product.name}
                className="h-52 w-full object-cover"
              />
              <div className="absolute -bottom-5 left-5">
                <div className="relative">
                  <img
                    src={firstImage}
                    alt={product.name}
                    className="h-16 w-16 rounded-xl border-4 border-white object-cover shadow-md"
                  />
                  <span
                    className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white ${
                      isActive ? "bg-emerald-500" : "bg-red-400"
                    }`}
                  />
                </div>
              </div>

              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-gray-600 shadow hover:bg-white transition"
                  >
                    <ChevronLeft size={15} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-gray-600 shadow hover:bg-white transition"
                  >
                    <ChevronRight size={15} />
                  </button>
                  <span className="absolute bottom-3 right-3 rounded-md bg-black/40 px-2 py-0.5 text-[11px] font-medium text-white">
                    {selectedImage + 1} / {images.length}
                  </span>
                </>
              )}
            </div>

            {images.length > 1 && (
              <div className="mt-2.5 grid grid-cols-5 gap-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`overflow-hidden rounded-lg border-2 transition ${
                      selectedImage === index
                        ? "border-emerald-500 ring-1 ring-emerald-200"
                        : "border-transparent hover:border-gray-200"
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={`Image ${index + 1}`}
                      className="h-12 w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            <div className="mt-8 ml-1">
              <h3 className="text-[15px] font-semibold text-gray-900 leading-snug">
                {product.name}
              </h3>
              {product.brand?.name && (
                <p className="mt-0.5 text-[13px] text-gray-400">
                  by {product.brand.name}
                </p>
              )}
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <span
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-semibold ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                    : "bg-red-50 text-red-600 ring-1 ring-red-200"
                }`}
              >
                {isActive ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                {isActive ? "Active" : "Deleted"}
              </span>

              {product.category?.name && (
                <span className="flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-[12px] font-semibold capitalize text-gray-600">
                  <Tag size={13} />
                  {product.category.name}
                </span>
              )}

              {product.discountPercentage != null &&
                product.discountPercentage > 0 && (
                  <span className="flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-1.5 text-[12px] font-semibold text-amber-700 ring-1 ring-amber-200">
                    <Percent size={13} />
                    {product.discountPercentage}% off
                  </span>
                )}

              {product.averageRating != null && (
                <span className="flex items-center gap-1.5 rounded-lg bg-yellow-50 px-3 py-1.5 text-[12px] font-semibold text-yellow-700 ring-1 ring-yellow-200">
                  <Star size={13} />
                  {product.averageRating.toFixed(1)}
                </span>
              )}
            </div>

            <div className="mt-5 border-t border-gray-100" />

            <table className="mt-1 w-full">
              <tbody>
                <Row
                  icon={<IndianRupee size={13} />}
                  label="Price"
                  value={
                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-emerald-700 font-semibold">
                      ₹{product.price.toLocaleString("en-IN")}
                    </span>
                  }
                />

                <Row
                  icon={<Boxes size={13} />}
                  label="Stock"
                  value={
                    <span
                      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-semibold ${stockColor}`}
                    >
                      {product.stock} units
                    </span>
                  }
                />

                {product.brand?.name && (
                  <Row
                    icon={<Package size={13} />}
                    label="Brand"
                    value={
                      <span className="inline-flex items-center gap-1 rounded-md bg-gray-50 px-2 py-0.5 text-gray-700">
                        {product.brand.name}
                      </span>
                    }
                  />
                )}

                {product.category?.name && (
                  <Row
                    icon={<Tag size={13} />}
                    label="Category"
                    value={
                      <span className="inline-flex items-center gap-1 rounded-md bg-gray-50 px-2 py-0.5 capitalize text-gray-700">
                        {product.category.name}
                      </span>
                    }
                  />
                )}

                {product.sku && (
                  <Row
                    icon={<Barcode size={13} />}
                    label="SKU"
                    value={
                      <span className="inline-flex items-center gap-1 rounded-md bg-gray-50 px-2 py-0.5 font-mono text-[12px] text-gray-600">
                        {product.sku}
                      </span>
                    }
                  />
                )}

                {product.discountPercentage != null &&
                  product.discountPercentage > 0 && (
                    <Row
                      icon={<Percent size={13} />}
                      label="Discount"
                      value={
                        <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-amber-700">
                          {product.discountPercentage}% off
                        </span>
                      }
                    />
                  )}

                <Row
                  icon={<Hash size={13} />}
                  label="Images"
                  value={
                    <span className="inline-flex items-center gap-1 rounded-md bg-gray-50 px-2 py-0.5 text-gray-700">
                      {images.length} image{images.length !== 1 ? "s" : ""}
                    </span>
                  }
                />

                <Row
                  icon={<Calendar size={13} />}
                  label="Created"
                  value={fmt(product.createdAt)}
                />
              </tbody>
            </table>

            {product.description && (
              <div className="mt-5 rounded-xl bg-gray-50 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
                  Description
                </p>
                <p className="mt-2 text-[13px] leading-relaxed text-gray-600 line-clamp-3">
                  {product.description}
                </p>
              </div>
            )}

            <div className="mt-6 flex items-center gap-2 rounded-lg border border-dashed border-gray-200 bg-gray-50 px-3 py-2.5">
              <span className="text-[11px] text-gray-400 font-medium">ID</span>
              <p className="truncate font-mono text-[11px] text-gray-500">
                {product._id}
              </p>
            </div>
          </div>

          <div className="h-8" />
        </div>
      </div>
    </div>
  );
};
