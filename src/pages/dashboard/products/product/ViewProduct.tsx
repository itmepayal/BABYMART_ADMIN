import {
  X,
  Package,
  IndianRupee,
  Calendar,
  CheckCircle2,
  XCircle,
  Tag,
  Boxes,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";
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
  category?: { name: string };
  brand?: { name: string };
  images: ImageType[];
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

  if (!product) return null;

  const images = product.images?.length
    ? product.images
    : [{ url: defaultAvatar }];

  const nextImage = () => {
    setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const stockPercent = Math.min((product.stock / 100) * 100, 100);

  const getStockColor = () => {
    if (product.stock < 10) return "bg-red-500";
    if (product.stock < 30) return "bg-yellow-500";
    return "bg-emerald-500";
  };

  return (
    <AnimatePresence>
      <motion.div
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.95, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative max-h-[84vh] w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl"
        >
          {/* Header */}
          <div className="sticky top-0 z-20 flex items-center justify-between border-b bg-white px-8 py-5">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Product Preview
              </h2>
              <p className="text-sm text-slate-500">
                Advanced product information dashboard
              </p>
            </div>

            <button
              onClick={onClose}
              className="rounded-xl border p-2 hover:bg-slate-100"
            >
              <X size={18} />
            </button>
          </div>

          <div className="grid max-h-[78vh] overflow-y-auto lg:grid-cols-2">
            {/* LEFT - IMAGES */}
            <div className="border-r bg-slate-50 p-8">
              <div className="relative overflow-hidden rounded-3xl border bg-white shadow-sm group">
                <img
                  src={images[selectedImage]?.url}
                  alt={product.name}
                  className="h-[450px] w-full object-cover transition duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition" />

                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow hover:scale-110"
                >
                  <ChevronLeft size={18} />
                </button>

                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow hover:scale-110"
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              {/* Thumbnails */}
              <div className="mt-4 grid grid-cols-4 gap-3">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`overflow-hidden rounded-2xl border-2 transition ${
                      selectedImage === index
                        ? "border-indigo-500 ring-2 ring-indigo-200"
                        : "border-transparent hover:border-slate-300"
                    }`}
                  >
                    <img
                      src={img.url}
                      alt=""
                      className="h-20 w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* RIGHT */}
            <div className="p-8">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <h1 className="text-xl font-bold text-slate-900">
                    {product.name}
                  </h1>

                  <p className="mt-1 text-sm text-slate-500">
                    SKU: {product.sku || "N/A"}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <Badge
                      text={!product.isDeleted ? "Active" : "Inactive"}
                      icon={
                        !product.isDeleted ? (
                          <CheckCircle2 size={14} />
                        ) : (
                          <XCircle size={14} />
                        )
                      }
                      color={
                        !product.isDeleted
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                      }
                    />

                    <Badge
                      text={`Stock: ${product.stock}`}
                      icon={<Boxes size={14} />}
                      color="bg-blue-100 text-blue-700"
                    />
                  </div>
                </div>

                <div className="rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 px-6 py-4 text-white shadow-lg">
                  <div className="flex items-center gap-1 text-xl font-bold">
                    <IndianRupee size={22} />
                    {product.price}
                  </div>
                </div>
              </div>

              {/* Description */}
              {product.description && (
                <section className="mt-8 rounded-2xl border bg-slate-50 p-5">
                  <h3 className="font-semibold text-slate-900">Description</h3>
                  <p className="mt-2 text-sm text-slate-600 leading-6">
                    {product.description}
                  </p>
                </section>
              )}

              {/* Stock meter */}
              <section className="mt-6">
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-medium text-slate-700">
                    Inventory Level
                  </span>
                  <span>{product.stock}/100</span>
                </div>

                <div className="h-3 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    style={{ width: `${stockPercent}%` }}
                    className={`h-full ${getStockColor()} transition-all`}
                  />
                </div>
              </section>

              {/* Info cards */}
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <InfoCard
                  icon={<Tag size={18} />}
                  label="Category"
                  value={product.category?.name}
                />

                <InfoCard
                  icon={<Package size={18} />}
                  label="Brand"
                  value={product.brand?.name}
                />

                <InfoCard
                  icon={<ImageIcon size={18} />}
                  label="Images"
                  value={images.length}
                />

                <InfoCard
                  icon={<Calendar size={18} />}
                  label="Created"
                  value={new Date(product.createdAt).toLocaleDateString()}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ---------------- Components ---------------- */

const InfoCard = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: React.ReactNode;
}) => (
  <div className="rounded-2xl border bg-white p-4 shadow-sm hover:shadow-md transition">
    <div className="mb-2 flex items-center gap-2 text-slate-500">
      <div className="rounded-lg bg-slate-100 p-2">{icon}</div>
      <span className="text-xs font-medium">{label}</span>
    </div>
    <p className="text-sm font-semibold text-slate-900">{value || "N/A"}</p>
  </div>
);

const Badge = ({
  icon,
  text,
  color,
}: {
  icon: React.ReactNode;
  text: string;
  color: string;
}) => (
  <span
    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold ${color}`}
  >
    {icon}
    {text}
  </span>
);
