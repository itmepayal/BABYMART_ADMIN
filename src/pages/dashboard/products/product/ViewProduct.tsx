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
  Star,
  Barcode,
  ShoppingCart,
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

  const nextImage = () => {
    setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const stockPercent = Math.min(product.stock, 100);

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
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-6xl overflow-hidden rounded-3xl bg-white shadow-2xl"
        >
          {/* HEADER */}
          <div className="sticky top-0 z-20 flex items-center justify-between border-b bg-white px-8 py-5">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Product Details
              </h2>
              <p className="text-sm text-slate-500">
                Detailed product overview dashboard
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border p-2 transition hover:bg-slate-100"
            >
              <X size={18} />
            </button>
          </div>

          <div className="grid max-h-[85vh] overflow-y-auto lg:grid-cols-2">
            {/* LEFT SIDE */}
            <div className="border-r bg-slate-50 p-8">
              <div className="group relative overflow-hidden rounded-3xl border bg-white shadow-sm">
                <img
                  src={images[selectedImage]?.url}
                  alt={product.name}
                  className="h-[450px] w-full object-cover transition duration-700 group-hover:scale-110"
                />

                <button
                  type="button"
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow hover:scale-110"
                >
                  <ChevronLeft size={18} />
                </button>

                <button
                  type="button"
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow hover:scale-110"
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              {/* THUMBNAILS */}
              <div className="mt-4 grid grid-cols-4 gap-3">
                {images.map((img, index) => (
                  <button
                    type="button"
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`overflow-hidden rounded-2xl border-2 transition ${
                      selectedImage === index
                        ? "border-emerald-500 ring-2 ring-emerald-200"
                        : "border-transparent hover:border-slate-300"
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={`Product image ${index + 1}`}
                      className="h-20 w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="p-8">
              <div className="flex flex-col gap-5">
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                      {product.name}
                    </h1>

                    <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                      <Barcode size={15} />
                      SKU: {product.sku || "N/A"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-4 text-white shadow-lg">
                    <div className="flex items-center gap-1 text-xl font-bold">
                      <IndianRupee size={20} />
                      {product.price}
                    </div>
                  </div>
                </div>

                {/* BADGES */}
                <div className="flex flex-wrap gap-3">
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

                  {product.discountPercentage ? (
                    <Badge
                      text={`${product.discountPercentage}% OFF`}
                      icon={<Tag size={14} />}
                      color="bg-orange-100 text-orange-700"
                    />
                  ) : null}
                </div>

                {/* DESCRIPTION */}
                {product.description && (
                  <section className="rounded-2xl border bg-slate-50 p-5">
                    <h3 className="font-semibold text-slate-900">
                      Description
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {product.description}
                    </p>
                  </section>
                )}

                {/* STOCK BAR */}
                <section>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="font-medium text-slate-700">
                      Inventory Level
                    </span>
                    <span>{product.stock}/100</span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                    <div
                      style={{ width: `${stockPercent}%` }}
                      className={`h-full ${getStockColor()} transition-all`}
                    />
                  </div>
                </section>

                {/* INFO GRID */}
                <div className="grid gap-4 sm:grid-cols-2">
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

                  <InfoCard
                    icon={<Star size={18} />}
                    label="Rating"
                    value={product.averageRating?.toFixed(1) || "No Rating"}
                  />

                  <InfoCard
                    icon={<ShoppingCart size={18} />}
                    label="Product ID"
                    value={product._id.slice(0, 10)}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* COMPONENTS */

const InfoCard = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: React.ReactNode;
}) => (
  <div className="rounded-2xl border bg-white p-4 shadow-sm transition hover:shadow-md">
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
