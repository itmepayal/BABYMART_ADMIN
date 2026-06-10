import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm, useFieldArray, Controller } from "react-hook-form";

import { Header } from "@/components/dashbaord/Header";
import { FormField } from "@/components/form/FormInput";
import { SaveButton } from "@/components/common/Action";
import TextEditor from "@/components/form/FromTextEditor";

import { FiRefreshCw } from "react-icons/fi";
import {
  ArrowLeft,
  Image as ImageIcon,
  Save,
  Sparkles,
  ImagePlus,
  Tag,
  Package,
  IndianRupee,
  Plus,
  X,
  RotateCcw,
  Layers,
  Star,
  Hash,
  ShoppingBag,
  Eye,
  EyeOff,
  CheckCircle2,
  Circle,
  ChevronDown,
  Search,
  User,
} from "lucide-react";

import { toast } from "sonner";
import { useUsers } from "@/hooks/users/useUsers";
import { useCreateProduct } from "@/hooks/product/useProductActions";
import { useCategories } from "@/hooks/categories/useCategories";
import { useBrands } from "@/hooks/brand/useBrands";
import {
  createProductSchema,
  type CreateProductFormData,
} from "@/validations/product.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ISeller } from "@/types/users";

// =========================================
// CONSTANTS
// =========================================
const cardStyle =
  "rounded-3xl border border-slate-200 bg-white p-7 shadow-sm hover:shadow-lg transition-all duration-300";

const defaultImage = { url: "" };

// =========================================
// SECTION HEADER
// =========================================
const SectionHeader = ({
  icon: Icon,
  title,
  subtitle,
  badge,
  action,
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  badge?: string | number;
  action?: React.ReactNode;
}) => (
  <div className="mb-6 flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 shadow-sm">
        <Icon className="text-emerald-600" size={18} />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        <p className="text-sm text-slate-500">{subtitle}</p>
      </div>
    </div>
    <div className="flex items-center gap-2">
      {badge !== undefined && (
        <span className="rounded-xl bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
          {badge}
        </span>
      )}
      {action}
    </div>
  </div>
);

// =========================================
// CHAR COUNTER
// =========================================
const CharCount = ({ current, max }: { current: number; max: number }) => (
  <span
    className={`text-xs ${current > max * 0.9 ? "text-amber-500" : "text-slate-400"}`}
  >
    {current}/{max}
  </span>
);

// =========================================
// CATEGORY SELECT  (emoji + image)
// =========================================
const CategorySelectDropdown = ({
  value,
  onChange,
  categories,
  error,
}: {
  value: string;
  onChange: (val: string) => void;
  categories: { _id: string; name: string; image?: { url: string } }[];
  error?: string;
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );
  const selected = categories.find((c) => c._id === value);

  return (
    <div className="relative">
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        Category <span className="text-red-500">*</span>
      </label>

      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3.5 text-left transition-all ${
          error
            ? "border-red-300 bg-red-50"
            : open
              ? "border-emerald-400 ring-2 ring-emerald-100"
              : "border-slate-200 bg-white hover:border-slate-300"
        }`}
      >
        {selected ? (
          <span className="flex items-center gap-2 text-sm font-medium text-slate-800">
            {selected.image?.url && (
              <img
                src={selected.image.url}
                alt={selected.name}
                className="h-5 w-5 rounded-full object-cover ring-1 ring-slate-200"
              />
            )}
            <span>{selected.name}</span>
          </span>
        ) : (
          <span className="flex items-center gap-2 text-sm text-slate-400">
            <Tag size={15} />
            Select category
          </span>
        )}
        <ChevronDown
          size={16}
          className={`text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
          <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-2.5">
            <Search size={14} className="text-slate-400" />
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search categories..."
              className="w-full text-sm outline-none placeholder:text-slate-400"
            />
          </div>
          <div className="max-h-64 overflow-y-auto p-2">
            {filtered.length === 0 ? (
              <p className="py-4 text-center text-sm text-slate-400">
                No categories found
              </p>
            ) : (
              filtered.map((cat) => (
                <button
                  key={cat._id}
                  type="button"
                  onClick={() => {
                    onChange(cat._id);
                    setOpen(false);
                    setSearch("");
                  }}
                  className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                    value === cat._id
                      ? "bg-emerald-50 font-semibold text-emerald-700"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {cat.image?.url && (
                    <img
                      src={cat.image.url}
                      alt={cat.name}
                      className="h-6 w-6 rounded-lg object-cover ring-1 ring-slate-200"
                    />
                  )}
                  <span className="flex-1 truncate">{cat.name}</span>
                  {value === cat._id && (
                    <span className="ml-auto text-emerald-500">✓</span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
};

// =========================================
// BRAND SELECT
// =========================================
const BrandSelectDropdown = ({
  value,
  onChange,
  brands,
  error,
}: {
  value: string;
  onChange: (val: string) => void;
  brands: { _id: string; name: string }[];
  error?: string;
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = brands.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase()),
  );
  const selected = brands.find((b) => b._id === value);

  return (
    <div className="relative">
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        Brand <span className="text-red-500">*</span>
      </label>

      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3.5 text-left transition-all ${
          error
            ? "border-red-300 bg-red-50"
            : open
              ? "border-emerald-400 ring-2 ring-emerald-100"
              : "border-slate-200 bg-white hover:border-slate-300"
        }`}
      >
        {selected ? (
          <span className="flex items-center gap-2 text-sm font-medium text-slate-800">
            <ShoppingBag size={15} className="text-emerald-500" />
            <span>{selected.name}</span>
          </span>
        ) : (
          <span className="flex items-center gap-2 text-sm text-slate-400">
            <ShoppingBag size={15} />
            Select brand
          </span>
        )}
        <ChevronDown
          size={16}
          className={`text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
          <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-2.5">
            <Search size={14} className="text-slate-400" />
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search brands..."
              className="w-full text-sm outline-none placeholder:text-slate-400"
            />
          </div>
          <div className="max-h-64 overflow-y-auto p-2">
            {filtered.length === 0 ? (
              <p className="py-4 text-center text-sm text-slate-400">
                No brands found
              </p>
            ) : (
              filtered.map((brand) => (
                <button
                  key={brand._id}
                  type="button"
                  onClick={() => {
                    onChange(brand._id);
                    setOpen(false);
                    setSearch("");
                  }}
                  className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                    value === brand._id
                      ? "bg-emerald-50 font-semibold text-emerald-700"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-100">
                    <ShoppingBag size={12} className="text-slate-500" />
                  </span>
                  <span className="flex-1 truncate">{brand.name}</span>
                  {value === brand._id && (
                    <span className="ml-auto text-emerald-500">✓</span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
};

const SellerSelectDropdown = ({
  value,
  onChange,
  sellers,
  error,
}: {
  value: string;
  onChange: (val: string) => void;
  sellers: any;
  error?: string;
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = sellers.filter(
    (s: ISeller) =>
      `${s.firstname} ${s.lastname}`
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()),
  );

  const selected = sellers.find((s: ISeller) => s._id === value);

  return (
    <div className="relative">
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        Seller
      </label>

      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3.5 text-left transition-all ${
          error
            ? "border-red-300 bg-red-50"
            : open
              ? "border-emerald-400 ring-2 ring-emerald-100"
              : "border-slate-200 bg-white hover:border-slate-300"
        }`}
      >
        {selected ? (
          <span className="flex items-center gap-2 text-sm font-medium text-slate-800">
            <User size={15} className="text-emerald-500" />
            <span>
              {selected.firstname} {selected.lastname}
            </span>
          </span>
        ) : (
          <span className="flex items-center gap-2 text-sm text-slate-400">
            <User size={15} />
            Select Seller
          </span>
        )}
        <ChevronDown
          size={16}
          className={`text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
          <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-2.5">
            <Search size={14} className="text-slate-400" />
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search sellers..."
              className="w-full text-sm outline-none placeholder:text-slate-400"
            />
          </div>
          <div className="max-h-64 overflow-y-auto p-2">
            {filtered.length === 0 ? (
              <p className="py-4 text-center text-sm text-slate-400">
                No sellers found
              </p>
            ) : (
              filtered.map((seller: ISeller) => (
                <button
                  key={seller._id}
                  type="button"
                  onClick={() => {
                    onChange(seller._id);
                    setOpen(false);
                    setSearch("");
                  }}
                  className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                    value === seller._id
                      ? "bg-emerald-50 font-semibold text-emerald-700"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-100">
                    <User size={12} className="text-slate-500" />
                  </span>
                  <span className="flex-1">
                    <span className="block truncate">
                      {seller.firstname} {seller.lastname}
                    </span>
                    <span className="text-xs font-normal text-slate-400">
                      {seller.email}
                    </span>
                  </span>
                  {value === seller._id && (
                    <span className="ml-auto text-emerald-500">✓</span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
};

// =========================================
// PRICE DISPLAY
// =========================================
const PriceDisplay = ({
  price,
  discount,
}: {
  price: number;
  discount: number;
}) => {
  const final = Math.max(price - (price * discount) / 100, 0);
  const saving = price - final;

  return (
    <div className="flex flex-col gap-1">
      <span className="text-2xl font-bold text-slate-900">
        ₹{final.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
      </span>
      {discount > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400 line-through">
            ₹{price.toLocaleString("en-IN")}
          </span>
          <span className="rounded-md bg-rose-50 px-1.5 py-0.5 text-xs font-semibold text-rose-600">
            −{discount}%
          </span>
        </div>
      )}
      {saving > 0 && (
        <p className="text-xs text-emerald-600">
          Save ₹{saving.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
        </p>
      )}
    </div>
  );
};

// =========================================
// MAIN COMPONENT
// =========================================
export default function CreateProduct() {
  const navigate = useNavigate();
  const [files, setFiles] = useState<File[]>([]);
  const [tagInput, setTagInput] = useState("");

  const { handleCreateProduct, loading } = useCreateProduct();
  const { categories } = useCategories();
  const { brands } = useBrands();
  const { sellers, fetchSellers } = useUsers();

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateProductFormData>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
      description: "",
      shortDescription: "",
      category: "",
      brand: "",
      sellerId: "",
      price: 0,
      discountPercentage: 0,
      tags: [],
      isFeatured: false,
      isActive: true,
      images: [{ url: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "images",
  });

  // =========================================
  // IMAGE UPLOAD
  // =========================================
  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return;
    }
    const preview = URL.createObjectURL(file);
    setValue(`images.${index}.url`, preview);
    setFiles((prev) => {
      const updated = [...prev];
      updated[index] = file;
      return updated;
    });
  };

  const removeImage = (index: number) => {
    if (fields.length === 1) {
      toast.error("At least one image slot is required");
      return;
    }
    remove(index);
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // =========================================
  // TAGS
  // =========================================
  const watchedTags: string[] = watch("tags") || [];

  const addTag = () => {
    const trimmed = tagInput.trim().toLowerCase();
    if (!trimmed) return;
    if (watchedTags.includes(trimmed)) {
      toast.error("Tag already added");
      return;
    }
    if (watchedTags.length >= 10) {
      toast.error("Maximum 10 tags allowed");
      return;
    }
    setValue("tags", [...watchedTags, trimmed]);
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setValue(
      "tags",
      watchedTags.filter((t) => t !== tag),
    );
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && !tagInput && watchedTags.length > 0) {
      removeTag(watchedTags[watchedTags.length - 1]);
    }
  };

  // =========================================
  // SUBMIT
  // =========================================
  const onSubmit = async (data: CreateProductFormData) => {
    const uploadedFiles = files.filter(Boolean);
    if (!uploadedFiles.length) {
      toast.error("Please upload at least one product image");
      return;
    }
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === "images") return;
        if (key === "tags") {
          (value as string[]).forEach((tag) => formData.append("tags[]", tag));
        } else {
          formData.append(key, String(value ?? ""));
        }
      });
      uploadedFiles.forEach((file) => formData.append("images", file));
      await handleCreateProduct(formData);
      toast.success("Product created successfully! 🎉");
      navigate("/dashboard/products");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create product");
    }
  };

  useEffect(() => {
    fetchSellers({
      page: 1,
      limit: 100,
    });
  }, []);

  // =========================================
  // DERIVED VALUES
  // =========================================
  const watchedName = watch("name");
  const watchedPrice = watch("price") || 0;
  const watchedDiscount = watch("discountPercentage") || 0;
  const watchedIsActive = watch("isActive");
  const watchedIsFeatured = watch("isFeatured");
  const watchedCategory = watch("category");
  const watchedBrand = watch("brand");
  const watchedImages = watch("images");
  const watchedDescription = watch("description");
  const watchedShortDesc = watch("shortDescription") || "";

  const slugPreview = watchedName
    ? watchedName
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "")
    : null;

  const uploadedCount = files.filter(Boolean).length;

  const completionItems = [
    { done: !!watchedName, label: "Name" },
    {
      done: !!watchedDescription && watchedDescription.length > 10,
      label: "Description",
    },
    { done: !!watchedCategory, label: "Category" },
    { done: !!watchedBrand, label: "Brand" },
    { done: watchedPrice > 0, label: "Price" },
    { done: uploadedCount > 0, label: "Image" },
  ];
  const completedCount = completionItems.filter((i) => i.done).length;
  const completionPct = Math.round(
    (completedCount / completionItems.length) * 100,
  );

  console.log(sellers);

  return (
    <div className="min-h-screen">
      {/* ================= HEADER ================= */}
      <Header
        title="Create Product"
        description="Add a new product to your catalog"
        actionLabel="Back"
        actionIcon={ArrowLeft}
        onAction={() => navigate("/dashboard/products")}
        refreshIcon={FiRefreshCw}
        isRefreshiingShow={false}
      />

      {/* ================= FORM ================= */}
      <div className="mx-auto py-8">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-8 xl:grid-cols-12">
            {/* ============= LEFT SECTION ============= */}
            <div className="space-y-8 xl:col-span-8">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className={cardStyle}
              >
                <SectionHeader
                  icon={Sparkles}
                  title="Product Details"
                  subtitle="Core information about the product"
                />

                <div className="space-y-5">
                  {/* Name + Slug */}
                  <div>
                    <FormField
                      label="Product Name"
                      icon={Package}
                      placeholder="e.g. Soft Cotton Baby Romper"
                      {...register("name")}
                      error={errors.name?.message}
                    />
                    {slugPreview && (
                      <p className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-400">
                        <span className="font-medium text-slate-500">
                          Slug:
                        </span>
                        <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-slate-600">
                          {slugPreview}
                        </span>
                      </p>
                    )}
                  </div>

                  <div>
                    <div className="mb-1.5 flex items-center justify-between">
                      <label className="text-sm font-medium text-slate-700">
                        Short Description{" "}
                        <span className="text-slate-400">(optional)</span>
                      </label>
                      <CharCount current={watchedShortDesc.length} max={300} />
                    </div>
                    <textarea
                      {...register("shortDescription")}
                      placeholder="A brief one-liner shown in product listings..."
                      rows={2}
                      className={`w-full resize-none rounded-2xl border px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all ${
                        errors.shortDescription
                          ? "border-red-300 bg-red-50"
                          : "border-slate-200 bg-white"
                      }`}
                    />
                    {errors.shortDescription && (
                      <p className="mt-1.5 text-xs text-red-500">
                        {errors.shortDescription.message}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-1">
                    <Controller
                      name="category"
                      control={control}
                      render={({ field }) => (
                        <CategorySelectDropdown
                          value={field.value}
                          onChange={field.onChange}
                          categories={categories as any}
                          error={errors.category?.message}
                        />
                      )}
                    />
                    <Controller
                      name="brand"
                      control={control}
                      render={({ field }) => (
                        <BrandSelectDropdown
                          value={field.value}
                          onChange={field.onChange}
                          brands={brands}
                          error={errors.brand?.message}
                        />
                      )}
                    />
                    <Controller
                      name="sellerId"
                      control={control}
                      render={({ field }) => (
                        <SellerSelectDropdown
                          value={field.value}
                          onChange={field.onChange}
                          sellers={sellers}
                          error={errors.sellerId?.message}
                        />
                      )}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      label="Price (₹)"
                      type="number"
                      icon={IndianRupee}
                      placeholder="0"
                      {...register("price", { valueAsNumber: true })}
                      error={errors.price?.message}
                    />
                    <div>
                      <FormField
                        label="Discount %"
                        type="number"
                        icon={Tag}
                        placeholder="0"
                        {...register("discountPercentage", {
                          valueAsNumber: true,
                        })}
                        error={errors.discountPercentage?.message}
                      />
                      {watchedDiscount > 0 && watchedPrice > 0 && (
                        <p className="mt-1.5 text-xs font-medium text-emerald-600">
                          Final price: ₹
                          {Math.max(
                            watchedPrice -
                              (watchedPrice * watchedDiscount) / 100,
                            0,
                          ).toLocaleString("en-IN", {
                            maximumFractionDigits: 0,
                          })}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Description <span className="text-red-400">*</span>
                    </label>
                    <Controller
                      name="description"
                      control={control}
                      render={({ field }) => (
                        <TextEditor
                          value={field.value || ""}
                          onChange={field.onChange}
                        />
                      )}
                    />
                    {errors.description && (
                      <p className="mt-1.5 text-xs text-red-500">
                        {errors.description.message}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={cardStyle}
              >
                <SectionHeader
                  icon={ImageIcon}
                  title="Product Gallery"
                  subtitle="Upload high-quality images (max 5MB each)"
                  badge={`${uploadedCount} / ${fields.length}`}
                />

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {fields.map((field, index) => {
                    const imageUrl = watchedImages?.[index]?.url;
                    const isPrimary = index === 0;
                    const hasFile = !!files[index];

                    return (
                      <div
                        key={field.id}
                        className={`group relative overflow-hidden rounded-2xl border bg-white transition-all duration-200 ${
                          isPrimary
                            ? "border-emerald-300 ring-2 ring-emerald-100"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        {imageUrl ? (
                          <>
                            <div className="relative aspect-square overflow-hidden bg-slate-100">
                              <img
                                src={imageUrl}
                                alt={`Product ${index + 1}`}
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/30 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                <label
                                  title="Replace image"
                                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-white/90 text-slate-700 hover:bg-white"
                                >
                                  <RotateCcw size={13} />
                                  <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) =>
                                      handleImageUpload(e, index)
                                    }
                                  />
                                </label>
                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500 text-white hover:bg-red-600"
                                >
                                  <X size={13} />
                                </button>
                              </div>
                              <span className="absolute left-2 top-2 rounded-lg bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">
                                #{index + 1}
                              </span>
                            </div>
                            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-3 py-2">
                              {isPrimary ? (
                                <span className="text-[10px] font-semibold text-emerald-600">
                                  Primary
                                </span>
                              ) : (
                                <span className="text-[10px] text-slate-400">
                                  Image {index + 1}
                                </span>
                              )}
                              {hasFile && (
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                              )}
                            </div>
                          </>
                        ) : (
                          <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 transition-all hover:border-emerald-400 hover:bg-emerald-50/30">
                            <ImagePlus size={20} className="text-slate-400" />
                            <span className="text-xs text-slate-400">
                              {isPrimary ? "Primary" : "Upload"}
                            </span>
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, index)}
                            />
                          </label>
                        )}
                      </div>
                    );
                  })}

                  {fields.length < 8 && (
                    <button
                      type="button"
                      onClick={() => append(defaultImage)}
                      className="flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 bg-white transition-all hover:border-emerald-400 hover:bg-emerald-50/30"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100">
                        <Plus size={16} className="text-slate-500" />
                      </div>
                      <span className="text-xs text-slate-400">Add Image</span>
                    </button>
                  )}
                </div>

                <p className="mt-4 text-xs text-slate-400">
                  Recommended: 1000×1000 px · JPG, PNG, WEBP · Max 8 images
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className={cardStyle}
              >
                <SectionHeader
                  icon={Hash}
                  title="Tags"
                  subtitle="Help customers find this product"
                  badge={`${watchedTags.length} / 10`}
                />

                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Hash
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagKeyDown}
                      placeholder="Type a tag and press Enter or Add"
                      maxLength={30}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-9 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={addTag}
                    disabled={!tagInput.trim() || watchedTags.length >= 10}
                    className="flex items-center gap-1.5 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Plus size={14} />
                    Add
                  </button>
                </div>

                {watchedTags.length > 0 ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {watchedTags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-1.5 rounded-xl bg-slate-100 pl-3 pr-1.5 py-1.5 text-xs font-medium text-slate-600"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-300 text-slate-600 hover:bg-slate-400 hover:text-white transition"
                        >
                          <X size={9} />
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 text-xs text-slate-400">
                    No tags added yet. Tags improve discoverability.
                  </p>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={cardStyle}
              >
                <SectionHeader
                  icon={Layers}
                  title="Visibility & Status"
                  subtitle="Control how this product appears in your store"
                />

                <div className="space-y-3">
                  <Controller
                    name="isActive"
                    control={control}
                    render={({ field }) => (
                      <button
                        type="button"
                        onClick={() => field.onChange(!field.value)}
                        className={`flex w-full items-center justify-between rounded-2xl border px-5 py-4 transition-all duration-300 ${
                          field.value
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-red-200 bg-red-50 text-slate-600"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {field.value ? (
                            <Eye size={16} className="text-emerald-500" />
                          ) : (
                            <EyeOff size={16} className="text-slate-400" />
                          )}
                          <div className="flex flex-col items-start">
                            <span className="text-sm font-semibold">
                              {field.value
                                ? "Active — Visible in store"
                                : "Inactive — Hidden from store"}
                            </span>
                            <span className="text-xs opacity-70">
                              {field.value
                                ? "Customers can browse and purchase this product"
                                : "Product is saved as draft and not shown publicly"}
                            </span>
                          </div>
                        </div>
                        <div
                          className={`relative h-7 w-12 rounded-full p-1 transition-all ${
                            field.value ? "bg-emerald-500" : "bg-slate-400"
                          }`}
                        >
                          <div
                            className={`h-5 w-5 rounded-full bg-white shadow transition-all duration-300 ${
                              field.value ? "translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </div>
                      </button>
                    )}
                  />

                  <Controller
                    name="isFeatured"
                    control={control}
                    render={({ field }) => (
                      <button
                        type="button"
                        onClick={() => field.onChange(!field.value)}
                        className={`flex w-full items-center justify-between rounded-2xl border px-5 py-4 transition-all duration-300 ${
                          field.value
                            ? "border-blue-200 bg-blue-50 text-blue-700"
                            : "border-slate-200 bg-slate-50 text-slate-600"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Star
                            size={16}
                            className={
                              field.value ? "text-blue-500" : "text-slate-400"
                            }
                          />
                          <div className="flex flex-col items-start">
                            <span className="text-sm font-semibold">
                              {field.value
                                ? "Featured — Highlighted in collections"
                                : "Not featured"}
                            </span>
                            <span className="text-xs opacity-70">
                              {field.value
                                ? "Shown in featured sections, homepage banners, and promotions"
                                : "Not promoted in any special sections"}
                            </span>
                          </div>
                        </div>
                        <div
                          className={`relative h-7 w-12 rounded-full p-1 transition-all ${
                            field.value ? "bg-blue-500" : "bg-slate-200"
                          }`}
                        >
                          <div
                            className={`h-5 w-5 rounded-full bg-white shadow transition-all duration-300 ${
                              field.value ? "translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </div>
                      </button>
                    )}
                  />
                </div>
              </motion.div>
            </div>

            {/* ============= RIGHT SIDEBAR ============= */}
            <div className="xl:col-span-4">
              <div className="sticky top-6">
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-100">
                  <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">
                        Live Preview
                      </h2>
                      <p className="text-xs text-slate-500">
                        How this product will appear
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
                        watchedIsActive
                          ? "bg-emerald-50 text-emerald-600 ring-emerald-100"
                          : "bg-red-50 text-red-600 ring-red-100"
                      }`}
                    >
                      {watchedIsActive ? "Active" : "Draft"}
                    </span>
                  </div>

                  <div className="p-6 pb-0">
                    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                      {watchedImages?.[0]?.url ? (
                        <>
                          <img
                            src={watchedImages[0].url}
                            alt="Product preview"
                            className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent" />
                          {watchedIsFeatured && (
                            <div className="absolute right-3 top-3">
                              <span className="flex items-center gap-1 rounded-full bg-blue-500 px-2.5 py-1 text-[10px] font-semibold text-white">
                                <Star size={9} fill="white" />
                                Featured
                              </span>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="flex h-56 flex-col items-center justify-center gap-3 text-slate-400">
                          <div className="rounded-2xl bg-slate-100 p-4">
                            <ImageIcon size={36} />
                          </div>
                          <p className="text-sm">No image uploaded</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4 p-6">
                    <div>
                      <h3 className="text-xl font-bold capitalize tracking-tight text-slate-900">
                        {watchedName || (
                          <span className="font-semibold text-slate-400">
                            Product name will appear here
                          </span>
                        )}
                      </h3>
                      {slugPreview && (
                        <p className="mt-1 font-mono text-xs text-slate-400">
                          /{slugPreview}
                        </p>
                      )}
                    </div>

                    {(watchedPrice > 0 || watchedDiscount > 0) && (
                      <PriceDisplay
                        price={watchedPrice}
                        discount={watchedDiscount}
                      />
                    )}

                    <div className="grid grid-cols-3 gap-2">
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-center">
                        <p className="text-[10px] text-slate-400">Images</p>
                        <p className="text-sm font-bold text-slate-700">
                          {uploadedCount}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-center">
                        <p className="text-[10px] text-slate-400">Tags</p>
                        <p className="text-sm font-bold text-slate-700">
                          {watchedTags.length}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-center">
                        <p className="text-[10px] text-slate-400">Discount</p>
                        <p className="text-sm font-bold text-slate-700">
                          {watchedDiscount > 0 ? `${watchedDiscount}%` : "—"}
                        </p>
                      </div>
                    </div>

                    {(watchedCategory || watchedBrand) && (
                      <div className="flex flex-wrap gap-1.5">
                        {watchedCategory && (
                          <span className="rounded-full bg-violet-50 px-3 py-1 text-[11px] font-medium text-violet-600 ring-1 ring-violet-100">
                            {(categories as any).find(
                              (c: any) => c._id === watchedCategory,
                            )?.name || "Category"}
                          </span>
                        )}
                        {watchedBrand && (
                          <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-medium text-blue-600 ring-1 ring-blue-100">
                            {brands.find((b) => b._id === watchedBrand)?.name ||
                              "Brand"}
                          </span>
                        )}
                      </div>
                    )}

                    {watchedName && (
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 ring-1 ring-blue-100">
                          Product Ready
                        </span>
                        {watchedIsActive && (
                          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600 ring-1 ring-emerald-100">
                            Visible
                          </span>
                        )}
                        {watchedIsFeatured && (
                          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 ring-1 ring-blue-100">
                            Featured
                          </span>
                        )}
                        {uploadedCount > 0 && (
                          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-600 ring-1 ring-amber-100">
                            Image Set
                          </span>
                        )}
                        {watchedTags.length > 0 && (
                          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600 ring-1 ring-indigo-100">
                            {watchedTags.length} Tags
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="border-t border-slate-100 px-6 py-5">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-800">
                        Readiness
                      </p>
                      <span className="text-sm font-bold text-slate-800">
                        {completionPct}%
                      </span>
                    </div>
                    <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          completionPct === 100
                            ? "bg-emerald-500"
                            : completionPct >= 60
                              ? "bg-blue-500"
                              : "bg-amber-400"
                        }`}
                        style={{ width: `${completionPct}%` }}
                      />
                    </div>
                    <div className="divide-y divide-slate-50">
                      {completionItems.map((item) => (
                        <div
                          key={item.label}
                          className="flex items-center gap-3 py-2"
                        >
                          {item.done ? (
                            <CheckCircle2
                              size={15}
                              className="text-emerald-500"
                              strokeWidth={2}
                            />
                          ) : (
                            <Circle
                              size={15}
                              className="text-slate-300"
                              strokeWidth={2}
                            />
                          )}
                          <span
                            className={`text-xs ${
                              item.done ? "text-slate-700" : "text-slate-400"
                            }`}
                          >
                            {item.label}
                          </span>
                          {item.done && (
                            <span className="ml-auto text-[10px] font-medium text-emerald-500">
                              Done
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-slate-100 bg-slate-50 px-6 py-5">
                    <SaveButton
                      loading={loading}
                      icon={<Save size={18} />}
                      label="Create Product"
                    />
                    <button
                      type="button"
                      onClick={() => navigate("/dashboard/products")}
                      className="mt-2.5 w-full rounded-2xl py-2.5 text-sm text-slate-500 transition hover:text-slate-700"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
