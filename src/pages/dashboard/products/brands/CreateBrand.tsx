import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";

import { Header } from "@/components/dashbaord/Header";
import { FormField } from "@/components/form/FormInput";
import { SaveButton } from "@/components/common/Action";

import { FiRefreshCw } from "react-icons/fi";
import {
  ArrowLeft,
  Save,
  Sparkles,
  ImagePlus,
  Layers,
  Tag,
  FolderTree,
  Image as ImageIcon,
  ChevronDown,
  Search,
  Globe,
  X,
  RotateCcw,
  Award,
  Link,
  LayoutTemplate,
  ShieldCheck,
  SortAsc,
} from "lucide-react";

import { toast } from "sonner";
import { useCreateBrand } from "@/hooks/brand/useBrandActions";

// =========================================
// TYPES
// =========================================
type BrandCategory =
  | "baby-care"
  | "diapers"
  | "feeding"
  | "clothing"
  | "toys"
  | "health"
  | "bath"
  | "strollers"
  | "maternity"
  | "nursery"
  | "school"
  | "accessories";

type FormValues = {
  name: string;
  category: BrandCategory | "";
  description: string;
  logo: string;
  website: string;
  isFeatured: boolean;
  isVerified: boolean;
  isActive: boolean;
  sortOrder: string;
  seoTitle: string;
  seoDescription: string;
};

// =========================================
// CONSTANTS
// =========================================
const BRAND_CATEGORIES: {
  value: BrandCategory;
  label: string;
  emoji: string;
}[] = [
  { value: "baby-care", label: "Baby Care", emoji: "🍼" },
  { value: "diapers", label: "Diapers", emoji: "👶" },
  { value: "feeding", label: "Feeding", emoji: "🥛" },
  { value: "clothing", label: "Clothing", emoji: "👕" },
  { value: "toys", label: "Toys", emoji: "🧸" },
  { value: "health", label: "Health", emoji: "💊" },
  { value: "bath", label: "Bath", emoji: "🛁" },
  { value: "strollers", label: "Strollers", emoji: "🚼" },
  { value: "maternity", label: "Maternity", emoji: "🤱" },
  { value: "nursery", label: "Nursery", emoji: "🛏️" },
  { value: "school", label: "School", emoji: "🎒" },
  { value: "accessories", label: "Accessories", emoji: "🎀" },
];

const cardStyle =
  "rounded-3xl border border-slate-200 bg-white p-7 shadow-sm hover:shadow-lg transition-all duration-300";

// =========================================
// SECTION HEADER COMPONENT
// =========================================
const SectionHeader = ({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
}) => (
  <div className="mb-6 flex items-center gap-3">
    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 shadow-sm">
      <Icon className="text-emerald-600" size={18} />
    </div>
    <div>
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <p className="text-sm text-slate-500">{subtitle}</p>
    </div>
  </div>
);

// =========================================
// BRAND CATEGORY SELECT COMPONENT
// =========================================
const BrandCategorySelect = ({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (val: BrandCategory) => void;
  error?: string;
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = BRAND_CATEGORIES.filter((t) =>
    t.label.toLowerCase().includes(search.toLowerCase()),
  );

  const selected = BRAND_CATEGORIES.find((t) => t.value === value);

  return (
    <div className="relative">
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        Brand Category <span className="text-red-500">*</span>
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
            <span>{selected.emoji}</span>
            <span>{selected.label}</span>
          </span>
        ) : (
          <span className="flex items-center gap-2 text-sm text-slate-400">
            <FolderTree size={15} />
            Select brand category
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
                No category found
              </p>
            ) : (
              filtered.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => {
                    onChange(type.value);
                    setOpen(false);
                    setSearch("");
                  }}
                  className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                    value === type.value
                      ? "bg-emerald-50 font-semibold text-emerald-700"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span className="text-base">{type.emoji}</span>
                  <span>{type.label}</span>
                  {value === type.value && (
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
// CHAR COUNTER COMPONENT
// =========================================
const CharCount = ({ current, max }: { current: number; max: number }) => (
  <span
    className={`text-xs ${current > max * 0.9 ? "text-amber-500" : "text-slate-400"}`}
  >
    {current}/{max}
  </span>
);

// =========================================
// TOGGLE BUTTON COMPONENT
// =========================================
const ToggleField = ({
  label,
  description,
  value,
  onChange,
  activeColor = "emerald",
}: {
  label: string;
  description: string;
  value: boolean;
  onChange: (val: boolean) => void;
  activeColor?: "emerald" | "blue" | "purple";
}) => {
  const colorMap = {
    emerald: {
      active: "border-emerald-200 bg-emerald-50 text-emerald-700",
      inactive: "border-slate-200 bg-slate-50 text-slate-500",
      thumb: "bg-emerald-500",
    },
    blue: {
      active: "border-blue-200 bg-blue-50 text-blue-700",
      inactive: "border-slate-200 bg-slate-50 text-slate-500",
      thumb: "bg-blue-500",
    },
    purple: {
      active: "border-purple-200 bg-purple-50 text-purple-700",
      inactive: "border-slate-200 bg-slate-50 text-slate-500",
      thumb: "bg-purple-500",
    },
  };

  const c = colorMap[activeColor];

  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`flex w-full items-center justify-between rounded-2xl border px-5 py-4 transition-all duration-300 ${
        value ? c.active : c.inactive
      }`}
    >
      <div className="flex flex-col items-start">
        <span className="text-sm font-semibold">{label}</span>
        <span className="text-xs opacity-70">{description}</span>
      </div>
      <div
        className={`relative h-7 w-12 rounded-full p-1 transition-all ${
          value ? c.thumb : "bg-slate-300"
        }`}
      >
        <div
          className={`h-5 w-5 rounded-full bg-white shadow transition-all duration-300 ${
            value ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </div>
    </button>
  );
};

// =========================================
// MAIN COMPONENT
// =========================================
const CreateBrand = () => {
  const navigate = useNavigate();
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFiles, setBannerFiles] = useState<File[]>([]);
  const [bannerPreviews, setBannerPreviews] = useState<string[]>([]);

  const { handleCreateBrand, loading } = useCreateBrand();

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      category: "",
      description: "",
      logo: "",
      website: "",
      isFeatured: false,
      isVerified: false,
      isActive: true,
      sortOrder: "",
      seoTitle: "",
      seoDescription: "",
    },
  });

  const watchedName = watch("name");
  const watchedDescription = watch("description");
  const watchedSeoTitle = watch("seoTitle");
  const watchedSeoDescription = watch("seoDescription");
  const watchedLogo = watch("logo");
  const watchedIsActive = watch("isActive");
  const watchedIsFeatured = watch("isFeatured");
  const watchedIsVerified = watch("isVerified");
  const watchedCategory = watch("category");
  const watchedWebsite = watch("website");

  // =========================================
  // LOGO UPLOAD
  // =========================================
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (selected.size > 5 * 1024 * 1024) {
      toast.error("Logo size must be less than 5MB");
      return;
    }

    setLogoFile(selected);
    setValue("logo", URL.createObjectURL(selected));
  };

  const removeLogo = () => {
    setLogoFile(null);
    setValue("logo", "");
  };

  // =========================================
  // BANNER UPLOAD
  // =========================================
  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    const remaining = 10 - bannerFiles.length;
    if (remaining <= 0) {
      toast.error("Maximum 10 banners allowed");
      return;
    }

    const toAdd = files.slice(0, remaining);
    const oversized = toAdd.filter((f) => f.size > 5 * 1024 * 1024);
    if (oversized.length) {
      toast.error("Each banner must be less than 5MB");
      return;
    }

    setBannerFiles((prev) => [...prev, ...toAdd]);
    setBannerPreviews((prev) => [
      ...prev,
      ...toAdd.map((f) => URL.createObjectURL(f)),
    ]);
  };

  const removeBanner = (index: number) => {
    setBannerFiles((prev) => prev.filter((_, i) => i !== index));
    setBannerPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // =========================================
  // AUTO-FILL SEO
  // =========================================
  const autoFillSeo = () => {
    if (watchedName && !watchedSeoTitle) {
      setValue("seoTitle", `${watchedName} | Baby Store`);
    }
    if (watchedDescription && !watchedSeoDescription) {
      setValue("seoDescription", watchedDescription.slice(0, 160));
    }
  };

  // =========================================
  // SUBMIT
  // =========================================
  const onSubmit = async (data: FormValues) => {
    if (!logoFile) {
      toast.error("Please upload a brand logo");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", data.name.trim());
      formData.append("category", data.category);
      formData.append("isActive", String(data.isActive));
      formData.append("isFeatured", String(data.isFeatured));
      formData.append("isVerified", String(data.isVerified));
      formData.append("logo", logoFile);

      bannerFiles.forEach((file) => formData.append("banners", file));

      if (data.description.trim()) {
        formData.append("description", data.description.trim());
      }
      if (data.website.trim()) {
        formData.append("website", data.website.trim());
      }
      if (data.sortOrder) {
        formData.append("sortOrder", data.sortOrder);
      }
      if (data.seoTitle.trim()) {
        formData.append("seoTitle", data.seoTitle.trim());
      }
      if (data.seoDescription.trim()) {
        formData.append("seoDescription", data.seoDescription.trim());
      }

      await handleCreateBrand(formData);

      toast.success("Brand created successfully! 🎉");
      navigate("/dashboard/brands");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create brand");
    }
  };

  // =========================================
  // SLUG PREVIEW
  // =========================================
  const slugPreview = watchedName
    ? watchedName
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "")
    : null;

  return (
    <div className="min-h-screen">
      <Header
        title="Create Brand"
        description="Add a new brand to your product catalog"
        actionLabel="Back"
        actionIcon={ArrowLeft}
        onAction={() => navigate("/dashboard/brands")}
        refreshIcon={FiRefreshCw}
        isRefreshiingShow={false}
      />

      <div className="mx-auto py-8">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-8 xl:grid-cols-12">
            {/* ================= LEFT SECTION ================= */}
            <div className="space-y-8 xl:col-span-8">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className={cardStyle}
              >
                <SectionHeader
                  icon={Award}
                  title="Brand Details"
                  subtitle="Basic information about the brand"
                />

                <div className="space-y-5">
                  <div>
                    <FormField
                      label="Brand Name"
                      icon={Tag}
                      placeholder="e.g. Little Stars"
                      {...register("name", {
                        required: "Brand name is required",
                        minLength: {
                          value: 2,
                          message: "Name must be at least 2 characters",
                        },
                        maxLength: {
                          value: 100,
                          message: "Name cannot exceed 100 characters",
                        },
                      })}
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

                  <Controller
                    name="category"
                    control={control}
                    rules={{ required: "Brand category is required" }}
                    render={({ field }) => (
                      <BrandCategorySelect
                        value={field.value}
                        onChange={field.onChange}
                        error={errors.category?.message}
                      />
                    )}
                  />

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Website <span className="text-slate-400">(optional)</span>
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                        <Link size={15} className="text-slate-400" />
                      </div>
                      <input
                        {...register("website", {
                          pattern: {
                            value: /^https?:\/\/.+/,
                            message:
                              "Please enter a valid URL starting with http:// or https://",
                          },
                        })}
                        placeholder="https://brand.com"
                        className={`w-full rounded-2xl border px-4 py-3.5 pl-10 text-sm text-slate-800 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all ${
                          errors.website
                            ? "border-red-300 bg-red-50"
                            : "border-slate-200 bg-white"
                        }`}
                      />
                    </div>
                    {errors.website && (
                      <p className="mt-1.5 text-xs text-red-500">
                        {errors.website.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <div className="mb-1.5 flex items-center justify-between">
                      <label className="text-sm font-medium text-slate-700">
                        Description{" "}
                        <span className="text-slate-400">(optional)</span>
                      </label>
                      <CharCount
                        current={watchedDescription.length}
                        max={1000}
                      />
                    </div>
                    <textarea
                      {...register("description", {
                        maxLength: {
                          value: 1000,
                          message: "Description cannot exceed 1000 characters",
                        },
                      })}
                      placeholder="Describe the brand, its values, and the products it offers..."
                      rows={4}
                      className={`w-full resize-none rounded-2xl border px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all ${
                        errors.description
                          ? "border-red-300 bg-red-50"
                          : "border-slate-200 bg-white"
                      }`}
                    />
                    {errors.description && (
                      <p className="mt-1.5 text-xs text-red-500">
                        {errors.description.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Sort Order{" "}
                      <span className="text-slate-400">(optional)</span>
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                        <SortAsc size={15} className="text-slate-400" />
                      </div>
                      <input
                        type="number"
                        min={0}
                        {...register("sortOrder", {
                          min: {
                            value: 0,
                            message: "Sort order must be 0 or greater",
                          },
                        })}
                        placeholder="e.g. 1"
                        className={`w-full rounded-2xl border px-4 py-3.5 pl-10 text-sm text-slate-800 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all ${
                          errors.sortOrder
                            ? "border-red-300 bg-red-50"
                            : "border-slate-200 bg-white"
                        }`}
                      />
                    </div>
                    {errors.sortOrder && (
                      <p className="mt-1.5 text-xs text-red-500">
                        {errors.sortOrder.message}
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
                  title="Brand Logo"
                  subtitle="Upload a high-quality logo (max 5MB)"
                />

                {watchedLogo ? (
                  <div className="relative overflow-hidden rounded-2xl border border-slate-200">
                    <img
                      src={watchedLogo}
                      alt="logo preview"
                      className="h-72 w-full object-contain bg-slate-50"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                    {logoFile && (
                      <div className="absolute bottom-3 left-3 rounded-xl bg-black/60 px-3 py-1.5 backdrop-blur">
                        <p className="text-xs font-medium text-white">
                          {logoFile.name}
                        </p>
                        <p className="text-[10px] text-white/70">
                          {(logoFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    )}

                    <div className="absolute right-3 top-3 flex gap-2">
                      <label
                        title="Change logo"
                        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl bg-white/90 shadow-sm transition-all hover:bg-white"
                      >
                        <RotateCcw size={15} className="text-slate-700" />
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={handleLogoUpload}
                        />
                      </label>
                      <button
                        type="button"
                        title="Remove logo"
                        onClick={removeLogo}
                        className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/90 shadow-sm transition-all hover:bg-red-500"
                      >
                        <X size={15} className="text-white" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="flex min-h-[280px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 transition-all hover:border-emerald-500 hover:bg-emerald-50/30">
                    <div className="rounded-2xl bg-emerald-50 p-4">
                      <ImagePlus className="text-emerald-600" size={28} />
                    </div>
                    <p className="mt-3 text-sm font-semibold text-slate-700">
                      Click to upload logo
                    </p>
                    <p className="text-xs text-slate-400">
                      PNG, JPG, WEBP — max 5MB
                    </p>
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleLogoUpload}
                    />
                  </label>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 }}
                className={cardStyle}
              >
                <div className="mb-6 flex items-center justify-between">
                  <SectionHeader
                    icon={LayoutTemplate}
                    title="Brand Banners"
                    subtitle="Upload up to 10 promotional banners (optional)"
                  />
                  <span className="shrink-0 text-xs text-slate-400">
                    {bannerFiles.length}/10
                  </span>
                </div>

                {bannerPreviews.length > 0 && (
                  <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {bannerPreviews.map((src, i) => (
                      <div
                        key={i}
                        className="group relative overflow-hidden rounded-xl border border-slate-200"
                      >
                        <img
                          src={src}
                          alt={`banner ${i + 1}`}
                          className="h-28 w-full object-cover transition duration-300 group-hover:scale-105"
                        />
                        <button
                          type="button"
                          onClick={() => removeBanner(i)}
                          className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/90 opacity-0 shadow transition-all group-hover:opacity-100 hover:bg-red-500"
                        >
                          <X size={13} className="text-white" />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-black/40 px-2 py-1 text-[10px] text-white">
                          {bannerFiles[i]?.name}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {bannerFiles.length < 10 && (
                  <label className="flex min-h-[120px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 transition-all hover:border-emerald-500 hover:bg-emerald-50/30">
                    <div className="rounded-xl bg-emerald-50 p-3">
                      <ImagePlus className="text-emerald-600" size={20} />
                    </div>
                    <p className="mt-2 text-sm font-medium text-slate-600">
                      {bannerFiles.length === 0
                        ? "Add banners"
                        : "Add more banners"}
                    </p>
                    <p className="text-xs text-slate-400">
                      PNG, JPG, WEBP — max 5MB each
                    </p>
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      multiple
                      onChange={handleBannerUpload}
                    />
                  </label>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className={cardStyle}
              >
                <div className="mb-6 flex items-center justify-between">
                  <SectionHeader
                    icon={Globe}
                    title="SEO Settings"
                    subtitle="Help customers find this brand via search"
                  />
                  {watchedName && (
                    <button
                      type="button"
                      onClick={autoFillSeo}
                      className="flex shrink-0 items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 transition-all hover:bg-emerald-100"
                    >
                      <Sparkles size={12} />
                      Auto-fill
                    </button>
                  )}
                </div>

                <div className="space-y-5">
                  <div>
                    <div className="mb-1.5 flex items-center justify-between">
                      <label className="text-sm font-medium text-slate-700">
                        SEO Title{" "}
                        <span className="text-slate-400">(optional)</span>
                      </label>
                      <CharCount current={watchedSeoTitle.length} max={120} />
                    </div>
                    <input
                      {...register("seoTitle", {
                        maxLength: {
                          value: 120,
                          message: "SEO title cannot exceed 120 characters",
                        },
                      })}
                      placeholder="e.g. Little Stars Baby Products | Your Store Name"
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all"
                    />
                    {errors.seoTitle && (
                      <p className="mt-1.5 text-xs text-red-500">
                        {errors.seoTitle.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <div className="mb-1.5 flex items-center justify-between">
                      <label className="text-sm font-medium text-slate-700">
                        SEO Description{" "}
                        <span className="text-slate-400">(optional)</span>
                      </label>
                      <CharCount
                        current={watchedSeoDescription.length}
                        max={300}
                      />
                    </div>
                    <textarea
                      {...register("seoDescription", {
                        maxLength: {
                          value: 300,
                          message:
                            "SEO description cannot exceed 300 characters",
                        },
                      })}
                      placeholder="Brief description for search engines..."
                      rows={3}
                      className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all"
                    />
                    {errors.seoDescription && (
                      <p className="mt-1.5 text-xs text-red-500">
                        {errors.seoDescription.message}
                      </p>
                    )}

                    {(watchedSeoTitle || watchedSeoDescription) && (
                      <div className="mt-3 rounded-xl border border-slate-200 bg-white p-3">
                        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                          Google Preview
                        </p>
                        <p className="cursor-pointer truncate text-sm font-medium text-blue-700 hover:underline">
                          {watchedSeoTitle || watchedName || "Page Title"}
                        </p>
                        <p className="truncate text-xs text-green-700">
                          yourstore.com/brands/{slugPreview || "slug"}
                        </p>
                        <p className="mt-0.5 line-clamp-2 text-xs leading-5 text-slate-600">
                          {watchedSeoDescription ||
                            watchedDescription ||
                            "No description provided."}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={cardStyle}
              >
                <SectionHeader
                  icon={Layers}
                  title="Brand Settings"
                  subtitle="Control visibility and display options"
                />

                <div className="space-y-3">
                  <Controller
                    name="isActive"
                    control={control}
                    render={({ field }) => (
                      <ToggleField
                        label={field.value ? "Active" : "Inactive"}
                        description={
                          field.value
                            ? "Visible in product listings and filters"
                            : "Hidden from all product listings"
                        }
                        value={field.value}
                        onChange={field.onChange}
                        activeColor="emerald"
                      />
                    )}
                  />

                  <Controller
                    name="isFeatured"
                    control={control}
                    render={({ field }) => (
                      <ToggleField
                        label={field.value ? "Featured" : "Not Featured"}
                        description={
                          field.value
                            ? "Highlighted in featured brand sections"
                            : "Not shown in featured sections"
                        }
                        value={field.value}
                        onChange={field.onChange}
                        activeColor="blue"
                      />
                    )}
                  />

                  <Controller
                    name="isVerified"
                    control={control}
                    render={({ field }) => (
                      <ToggleField
                        label={field.value ? "Verified Brand" : "Unverified"}
                        description={
                          field.value
                            ? "Shows a verified badge on the brand page"
                            : "No verification badge displayed"
                        }
                        value={field.value}
                        onChange={field.onChange}
                        activeColor="purple"
                      />
                    )}
                  />
                </div>
              </motion.div>
            </div>

            {/* ================= RIGHT SIDEBAR ================= */}
            <div className="xl:col-span-4">
              <div className="sticky top-6">
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-100">
                  <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">
                        Live Preview
                      </h2>
                      <p className="text-xs text-slate-500">
                        How this brand will appear
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
                        watchedIsActive
                          ? "bg-emerald-50 text-emerald-600 ring-emerald-100"
                          : "bg-red-50 text-red-600 ring-red-100"
                      }`}
                    >
                      {watchedIsActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div className="p-6 pb-0">
                    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                      {watchedLogo ? (
                        <>
                          <img
                            src={watchedLogo}
                            alt="logo preview"
                            className="h-56 w-full object-contain bg-white transition duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-transparent" />
                          {watchedCategory && (
                            <div className="absolute left-3 top-3">
                              <span className="rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
                                {
                                  BRAND_CATEGORIES.find(
                                    (t) => t.value === watchedCategory,
                                  )?.emoji
                                }{" "}
                                {
                                  BRAND_CATEGORIES.find(
                                    (t) => t.value === watchedCategory,
                                  )?.label
                                }
                              </span>
                            </div>
                          )}
                          {watchedIsVerified && (
                            <div className="absolute right-3 top-3">
                              <span className="flex items-center gap-1 rounded-full bg-purple-500/90 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
                                <ShieldCheck size={11} />
                                Verified
                              </span>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="flex h-56 flex-col items-center justify-center gap-3 text-slate-400">
                          <div className="rounded-2xl bg-slate-100 p-4">
                            <ImageIcon size={36} />
                          </div>
                          <p className="text-sm">No logo uploaded</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4 p-6">
                    <div>
                      <h3 className="text-xl font-bold capitalize tracking-tight text-slate-900">
                        {watchedName || (
                          <span className="text-slate-400">Brand Name</span>
                        )}
                      </h3>
                      {slugPreview && (
                        <p className="mt-1 font-mono text-xs text-slate-400">
                          /{slugPreview}
                        </p>
                      )}
                      {watchedWebsite && (
                        <a
                          href={watchedWebsite}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-1 flex items-center gap-1 text-xs text-blue-500 hover:underline"
                        >
                          <Globe size={10} />
                          {watchedWebsite.replace(/^https?:\/\//, "")}
                        </a>
                      )}
                      {watchedDescription && (
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                          {watchedDescription}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-3.5">
                        <p className="text-xs text-slate-500">Status</p>
                        <p
                          className={`mt-1 text-base font-bold ${
                            watchedIsActive
                              ? "text-emerald-600"
                              : "text-red-500"
                          }`}
                        >
                          {watchedIsActive ? "Active" : "Inactive"}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5">
                        <p className="text-xs text-slate-500">Category</p>
                        <p className="mt-1 text-base font-bold capitalize text-slate-900">
                          {watchedCategory ? (
                            BRAND_CATEGORIES.find(
                              (t) => t.value === watchedCategory,
                            )?.label
                          ) : (
                            <span className="font-normal text-slate-400">
                              Not set
                            </span>
                          )}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-3.5">
                        <p className="text-xs text-slate-500">Featured</p>
                        <p
                          className={`mt-1 text-base font-bold ${
                            watchedIsFeatured
                              ? "text-blue-600"
                              : "text-slate-400"
                          }`}
                        >
                          {watchedIsFeatured ? "Yes" : "No"}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50 to-white p-3.5">
                        <p className="text-xs text-slate-500">Verified</p>
                        <p
                          className={`mt-1 text-base font-bold ${
                            watchedIsVerified
                              ? "text-purple-600"
                              : "text-slate-400"
                          }`}
                        >
                          {watchedIsVerified ? "Yes" : "No"}
                        </p>
                      </div>

                      {bannerFiles.length > 0 && (
                        <div className="col-span-2 rounded-2xl border border-slate-200 bg-slate-50 p-3.5">
                          <p className="text-xs text-slate-500">Banners</p>
                          <p className="mt-1 text-sm font-bold text-slate-900">
                            {bannerFiles.length} banner
                            {bannerFiles.length !== 1 ? "s" : ""} uploaded
                          </p>
                        </div>
                      )}
                    </div>

                    {watchedName && (
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 ring-1 ring-blue-100">
                          Brand Ready
                        </span>
                        {watchedIsActive && (
                          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600 ring-1 ring-emerald-100">
                            Visible
                          </span>
                        )}
                        {watchedSeoTitle && (
                          <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-600 ring-1 ring-purple-100">
                            SEO Ready
                          </span>
                        )}
                        {logoFile && (
                          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-600 ring-1 ring-amber-100">
                            Logo Set
                          </span>
                        )}
                        {watchedIsFeatured && (
                          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 ring-1 ring-blue-100">
                            Featured
                          </span>
                        )}
                        {watchedIsVerified && (
                          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600 ring-1 ring-indigo-100">
                            Verified
                          </span>
                        )}
                        {bannerFiles.length > 0 && (
                          <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-600 ring-1 ring-rose-100">
                            {bannerFiles.length} Banner
                            {bannerFiles.length !== 1 ? "s" : ""}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="border-t border-slate-100 bg-slate-50 px-6 py-5">
                    <SaveButton
                      loading={loading}
                      icon={<Save size={18} />}
                      label="Create Brand"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBrand;
