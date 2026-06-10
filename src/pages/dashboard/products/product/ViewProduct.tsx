import {
  X,
  Package,
  IndianRupee,
  Calendar,
  CheckCircle,
  XCircle,
  Tag,
  Boxes,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Star,
  Barcode,
  ShoppingCart,
  Layers,
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

  const nextImage = () =>
    setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  const prevImage = () =>
    setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  const isActive = !product.isDeleted;
  const firstImage = images[selectedImage]?.url || defaultAvatar;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="animate-in fade-in zoom-in-95 relative w-full max-w-md rounded-3xl bg-white shadow-2xl duration-200 flex flex-col max-h-[90vh]"
      >
        {/* HEADER BANNER */}
        <div className="relative h-20 shrink-0 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500">
          <div className="absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-white/10" />
          <div className="absolute -bottom-14 -right-14 h-48 w-48 rounded-full bg-white/5" />
          <div className="absolute -top-6 -left-6 h-24 w-24 rounded-full bg-white/10" />

          <div className="absolute bottom-8 left-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/70">
              Product Details
            </p>
          </div>

          <button
            onClick={onClose}
            className="absolute right-4 top-6 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30 hover:scale-105"
          >
            <X size={16} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          <div className="relative px-6">
            <div className=" flex items-end gap-4 z-50">
              <div className="relative shrink-0">
                <img
                  src={firstImage}
                  alt={product.name}
                  className="h-24 w-24 rounded-2xl border-4 border-white object-cover shadow-xl z-50"
                />
                <span
                  className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white ${
                    isActive ? "bg-emerald-500" : "bg-red-400"
                  }`}
                />
              </div>

              <div className="min-w-0 pb-2">
                <h2 className="truncate text-xl font-bold leading-tight text-gray-900">
                  {product.name}
                </h2>

                <span
                  className={`mt-1.5 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {isActive ? <CheckCircle size={12} /> : <XCircle size={12} />}
                  {isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>

          {/* INFO CARDS GRID */}
          <div className="mt-5 grid grid-cols-2 gap-2.5 px-6">
            <InfoCard
              icon={<IndianRupee size={15} className="text-teal-600" />}
              label="Price"
              value={`₹${product.price.toLocaleString("en-IN")}`}
              accent="teal"
            />

            <InfoCard
              icon={<Tag size={15} className="text-cyan-600" />}
              label="Category"
              value={product.category?.name}
              accent="cyan"
            />

            <InfoCard
              icon={<Package size={15} className="text-emerald-600" />}
              label="Brand"
              value={product.brand?.name}
              accent="emerald"
            />

            <InfoCard
              icon={<Boxes size={15} className="text-teal-600" />}
              label="Stock"
              value={
                <span
                  className={
                    product.stock < 10
                      ? "text-red-500 font-semibold"
                      : product.stock < 30
                        ? "text-yellow-600 font-semibold"
                        : "text-emerald-600 font-semibold"
                  }
                >
                  {product.stock} units
                </span>
              }
              accent="teal"
            />

            <InfoCard
              icon={<Star size={15} className="text-emerald-600" />}
              label="Rating"
              value={product.averageRating?.toFixed(1) || "No Rating"}
              accent="emerald"
            />

            <InfoCard
              icon={<Layers size={15} className="text-cyan-600" />}
              label="Images"
              value={images.length}
              accent="cyan"
            />

            <InfoCard
              icon={<Calendar size={15} className="text-emerald-600" />}
              label="Created"
              value={new Date(product.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
              accent="emerald"
            />

            {product.discountPercentage ? (
              <InfoCard
                icon={<Tag size={15} className="text-cyan-600" />}
                label="Discount"
                value={`${product.discountPercentage}% OFF`}
                accent="cyan"
              />
            ) : null}

            <div className="col-span-2">
              <InfoCard
                icon={<Barcode size={15} className="text-teal-600" />}
                label="SKU"
                value={
                  <span className="font-mono text-xs text-gray-500">
                    {product.sku || "N/A"}
                  </span>
                }
                accent="teal"
              />
            </div>

            <div className="col-span-2">
              <InfoCard
                icon={<ShoppingCart size={15} className="text-teal-600" />}
                label="Product ID"
                value={
                  <span className="font-mono text-xs text-gray-500 truncate">
                    {product._id}
                  </span>
                }
                accent="teal"
              />
            </div>
          </div>

          {/* DESCRIPTION */}
          {product.description && (
            <div className="mt-5 px-6">
              <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Description
              </p>
              <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-cyan-50 p-4 text-sm leading-6 text-gray-600">
                {product.description}
              </div>
            </div>
          )}

          {/* IMAGE GALLERY */}
          <div className="mt-5 px-6">
            <p className="mb-2.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
              <ImageIcon size={14} />
              Product Images
            </p>

            {/* Main image with prev/next */}
            <div className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-cyan-50 p-2.5">
              <img
                src={firstImage}
                alt={product.name}
                className="h-44 w-full rounded-xl object-cover"
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md hover:scale-105 transition"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md hover:scale-105 transition"
                  >
                    <ChevronRight size={16} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="mt-3 grid grid-cols-4 gap-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`overflow-hidden rounded-xl border-2 transition ${
                      selectedImage === index
                        ? "border-emerald-500 ring-2 ring-emerald-200"
                        : "border-transparent hover:border-slate-300"
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={`Product image ${index + 1}`}
                      className="h-16 w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="shrink-0 border-t border-gray-100 bg-gray-50/70 px-6 py-4">
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

const InfoCard = ({ icon, label, value, accent }: InfoCardProps) => (
  <div
    className={`flex flex-col gap-2 rounded-xl border px-4 py-3 transition hover:brightness-95 ${accentMap[accent]}`}
  >
    <div className="flex items-center gap-2">
      <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-white shadow-sm">
        {icon}
      </div>
      <span className="text-xs font-medium text-gray-500">{label}</span>
    </div>
    <div className="text-sm font-semibold text-gray-800 truncate">
      {value ?? "N/A"}
    </div>
  </div>
);
