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
  Image as ImageIcon,
  Calendar,
  LayoutTemplate,
  Tag,
  Globe,
  Percent,
  AlignLeft,
  Link,
  ListOrdered,
  ChevronDown,
  Search,
  X,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";

import { toast } from "sonner";
import { useCreateBanner } from "@/hooks/banner/useBannerAction";

// =========================================
// TYPES
// =========================================
type BannerType =
  | "home"
  | "offer"
  | "category"
  | "product"
  | "flash-sale"
  | "seasonal";

type FormValues = {
  name: string;
  title: string;
  subtitle: string;
  description: string;
  bannerType: BannerType | "";
  redirectUrl: string;
  buttonText: string;
  startFrom: string;
  discountPercentage: string;
  priority: string;
  startDate: string;
  endDate: string;
  isFeatured: boolean;
  isActive: boolean;
  seoTitle: string;
  seoDescription: string;
};

// =========================================
// CONSTANTS
// =========================================
const BANNER_TYPES: { value: BannerType; label: string; emoji: string }[] = [
  { value: "home", label: "Home", emoji: "🏠" },
  { value: "offer", label: "Offer", emoji: "🎁" },
  { value: "category", label: "Category", emoji: "📂" },
  { value: "product", label: "Product", emoji: "📦" },
  { value: "flash-sale", label: "Flash Sale", emoji: "⚡" },
  { value: "seasonal", label: "Seasonal", emoji: "🌸" },
];

const cardStyle =
  "rounded-3xl border border-slate-200 bg-white p-7 shadow-sm hover:shadow-lg transition-all duration-300";

// =========================================
// SECTION HEADER
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
// BANNER TYPE SELECT
// =========================================
const BannerTypeSelect = ({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (val: BannerType) => void;
  error?: string;
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = BANNER_TYPES.filter((t) =>
    t.label.toLowerCase().includes(search.toLowerCase()),
  );

  const selected = BANNER_TYPES.find((t) => t.value === value);

  return (
    <div className="relative">
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        Banner Type <span className="text-red-500">*</span>
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
            <Layers size={15} />
            Select banner type
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
              placeholder="Search types..."
              className="w-full text-sm outline-none placeholder:text-slate-400"
            />
          </div>

          <div className="max-h-64 overflow-y-auto p-2">
            {filtered.length === 0 ? (
              <p className="py-4 text-center text-sm text-slate-400">
                No type found
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
// TOGGLE FIELD
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
const CreateBanner = () => {
  const navigate = useNavigate();
  const [desktopFile, setDesktopFile] = useState<File | null>(null);
  const [desktopPreview, setDesktopPreview] = useState("");
  const [mobileFile, setMobileFile] = useState<File | null>(null);
  const [mobilePreview, setMobilePreview] = useState("");

  const { handleCreateBanner, loading } = useCreateBanner();

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
      title: "",
      subtitle: "",
      description: "",
      bannerType: "",
      redirectUrl: "",
      buttonText: "",
      startFrom: "",
      discountPercentage: "",
      priority: "",
      startDate: "",
      endDate: "",
      isFeatured: false,
      isActive: true,
      seoTitle: "",
      seoDescription: "",
    },
  });

  const watchedName = watch("name");
  const watchedTitle = watch("title");
  const watchedSubtitle = watch("subtitle");
  const watchedDescription = watch("description");
  const watchedBannerType = watch("bannerType");
  const watchedIsActive = watch("isActive");
  const watchedIsFeatured = watch("isFeatured");
  const watchedStartFrom = watch("startFrom");
  const watchedDiscount = watch("discountPercentage");
  const watchedSeoTitle = watch("seoTitle");
  const watchedSeoDescription = watch("seoDescription");

  // =========================================
  // DESKTOP IMAGE UPLOAD
  // =========================================
  const handleDesktopUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (selected.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setDesktopFile(selected);
    setDesktopPreview(URL.createObjectURL(selected));
  };

  const removeDesktop = () => {
    setDesktopFile(null);
    setDesktopPreview("");
  };

  // =========================================
  // MOBILE IMAGE UPLOAD
  // =========================================
  const handleMobileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (selected.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setMobileFile(selected);
    setMobilePreview(URL.createObjectURL(selected));
  };

  const removeMobile = () => {
    setMobileFile(null);
    setMobilePreview("");
  };

  // =========================================
  // AUTO-FILL SEO
  // =========================================
  const autoFillSeo = () => {
    if (watchedName && !watchedSeoTitle) {
      setValue("seoTitle", `${watchedName} | ${watchedTitle || "Banner"}`);
    }
    if (watchedDescription && !watchedSeoDescription) {
      setValue("seoDescription", watchedDescription.slice(0, 160));
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

  // =========================================
  // SUBMIT
  // =========================================
  const onSubmit = async (data: FormValues) => {
    if (!desktopFile) {
      toast.error("Please upload a desktop banner image");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", data.name.trim());
      formData.append("title", data.title.trim());
      formData.append("bannerType", data.bannerType);
      formData.append("isActive", String(data.isActive));
      formData.append("isFeatured", String(data.isFeatured));
      formData.append("desktopImage", desktopFile);

      if (mobileFile) formData.append("mobileImage", mobileFile);

      if (data.subtitle.trim())
        formData.append("subtitle", data.subtitle.trim());
      if (data.description.trim())
        formData.append("description", data.description.trim());
      if (data.redirectUrl.trim())
        formData.append("redirectUrl", data.redirectUrl.trim());
      if (data.buttonText.trim())
        formData.append("buttonText", data.buttonText.trim());
      if (data.startFrom.trim())
        formData.append("startFrom", data.startFrom.trim());
      if (data.discountPercentage)
        formData.append("discountPercentage", data.discountPercentage);
      if (data.priority) formData.append("priority", data.priority);
      if (data.startDate) formData.append("startDate", data.startDate);
      if (data.endDate) formData.append("endDate", data.endDate);
      if (data.seoTitle.trim())
        formData.append("seoTitle", data.seoTitle.trim());
      if (data.seoDescription.trim())
        formData.append("seoDescription", data.seoDescription.trim());

      await handleCreateBanner(formData);

      toast.success("Banner created successfully! 🎉");
      navigate("/dashboard/banners");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create banner");
    }
  };

  return (
    <div className="min-h-screen">
      <Header
        title="Create Banner"
        description="Add a new banner for promotions and homepage sections"
        actionLabel="Back"
        actionIcon={ArrowLeft}
        onAction={() => navigate("/dashboard/banners")}
        refreshIcon={FiRefreshCw}
        isRefreshiingShow={false}
      />

      <div className="mx-auto py-8">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-8 xl:grid-cols-12">
            {/* ================= LEFT SECTION ================= */}
            <div className="space-y-8 xl:col-span-8">
              {/* ================= BANNER DETAILS ================= */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className={cardStyle}
              >
                <SectionHeader
                  icon={Sparkles}
                  title="Banner Details"
                  subtitle="Core identity and content of the banner"
                />

                <div className="space-y-5">
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div>
                      <FormField
                        label="Banner Name"
                        icon={LayoutTemplate}
                        placeholder="e.g. Summer Sale Hero"
                        {...register("name", {
                          required: "Banner name is required",
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

                    <FormField
                      label="Banner Title"
                      icon={Tag}
                      placeholder="e.g. Up to 50% Off Everything"
                      {...register("title", {
                        required: "Banner title is required",
                        minLength: {
                          value: 2,
                          message: "Title must be at least 2 characters",
                        },
                        maxLength: {
                          value: 200,
                          message: "Title cannot exceed 200 characters",
                        },
                      })}
                      error={errors.title?.message}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <FormField
                      label="Subtitle"
                      icon={AlignLeft}
                      placeholder="e.g. Limited time offer"
                      {...register("subtitle", {
                        maxLength: {
                          value: 300,
                          message: "Subtitle cannot exceed 300 characters",
                        },
                      })}
                      error={errors.subtitle?.message}
                    />

                    <Controller
                      name="bannerType"
                      control={control}
                      rules={{ required: "Banner type is required" }}
                      render={({ field }) => (
                        <BannerTypeSelect
                          value={field.value}
                          onChange={field.onChange}
                          error={errors.bannerType?.message}
                        />
                      )}
                    />
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
                      placeholder="Brief description of this banner's purpose or campaign..."
                      rows={3}
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
                </div>
              </motion.div>

              {/* ================= OFFER DETAILS ================= */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 }}
                className={cardStyle}
              >
                <SectionHeader
                  icon={Percent}
                  title="Offer & CTA"
                  subtitle="Discount info, CTA button, and redirect link"
                />

                <div className="space-y-5">
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <FormField
                      label="Starting From"
                      icon={Tag}
                      placeholder="e.g. Starting from ₹299"
                      {...register("startFrom")}
                    />

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">
                        Discount %{" "}
                        <span className="text-slate-400">(optional)</span>
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                          <Percent size={15} className="text-slate-400" />
                        </div>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          {...register("discountPercentage", {
                            min: { value: 0, message: "Minimum is 0" },
                            max: { value: 100, message: "Maximum is 100" },
                          })}
                          placeholder="e.g. 25"
                          className={`w-full rounded-2xl border px-4 py-3.5 pl-10 text-sm text-slate-800 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all ${
                            errors.discountPercentage
                              ? "border-red-300 bg-red-50"
                              : "border-slate-200 bg-white"
                          }`}
                        />
                      </div>
                      {errors.discountPercentage && (
                        <p className="mt-1.5 text-xs text-red-500">
                          {errors.discountPercentage.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <FormField
                      label="Button Text"
                      icon={Tag}
                      placeholder="e.g. Shop Now"
                      {...register("buttonText", {
                        maxLength: {
                          value: 50,
                          message: "Button text cannot exceed 50 characters",
                        },
                      })}
                      error={errors.buttonText?.message}
                    />

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">
                        Redirect URL{" "}
                        <span className="text-slate-400">(optional)</span>
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                          <Link size={15} className="text-slate-400" />
                        </div>
                        <input
                          {...register("redirectUrl", {
                            pattern: {
                              value: /^(https?:\/\/.+|\/.*)/,
                              message:
                                "Enter a valid URL or path (e.g. /products or https://...)",
                            },
                          })}
                          placeholder="/products/sale"
                          className={`w-full rounded-2xl border px-4 py-3.5 pl-10 text-sm text-slate-800 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all ${
                            errors.redirectUrl
                              ? "border-red-300 bg-red-50"
                              : "border-slate-200 bg-white"
                          }`}
                        />
                      </div>
                      {errors.redirectUrl && (
                        <p className="mt-1.5 text-xs text-red-500">
                          {errors.redirectUrl.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* ================= SCHEDULE & PRIORITY ================= */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={cardStyle}
              >
                <SectionHeader
                  icon={Calendar}
                  title="Schedule & Priority"
                  subtitle="Set display dates and ordering priority"
                />

                <div className="space-y-5">
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <FormField
                      label="Start Date"
                      type="date"
                      icon={Calendar}
                      {...register("startDate")}
                    />

                    <FormField
                      label="End Date"
                      type="date"
                      icon={Calendar}
                      {...register("endDate")}
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Priority{" "}
                      <span className="text-slate-400">(optional)</span>
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                        <ListOrdered size={15} className="text-slate-400" />
                      </div>
                      <input
                        type="number"
                        min={0}
                        {...register("priority", {
                          min: {
                            value: 0,
                            message: "Priority must be 0 or greater",
                          },
                        })}
                        placeholder="e.g. 1 (higher = shown first)"
                        className={`w-full rounded-2xl border px-4 py-3.5 pl-10 text-sm text-slate-800 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all ${
                          errors.priority
                            ? "border-red-300 bg-red-50"
                            : "border-slate-200 bg-white"
                        }`}
                      />
                    </div>
                    {errors.priority && (
                      <p className="mt-1.5 text-xs text-red-500">
                        {errors.priority.message}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* ================= DESKTOP IMAGE ================= */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 }}
                className={cardStyle}
              >
                <SectionHeader
                  icon={ImageIcon}
                  title="Desktop Image"
                  subtitle="Upload desktop banner image (max 5MB)"
                />

                {desktopPreview ? (
                  <div className="relative overflow-hidden rounded-2xl border border-slate-200">
                    <img
                      src={desktopPreview}
                      alt="desktop preview"
                      className="h-72 w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                    {desktopFile && (
                      <div className="absolute bottom-3 left-3 rounded-xl bg-black/60 px-3 py-1.5 backdrop-blur">
                        <p className="text-xs font-medium text-white">
                          {desktopFile.name}
                        </p>
                        <p className="text-[10px] text-white/70">
                          {(desktopFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    )}

                    <div className="absolute right-3 top-3 flex gap-2">
                      <label
                        title="Change image"
                        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl bg-white/90 shadow-sm transition-all hover:bg-white"
                      >
                        <RotateCcw size={15} className="text-slate-700" />
                        <input
                          type="file"
                          name="desktopImage"
                          hidden
                          accept="image/*"
                          onChange={handleDesktopUpload}
                        />
                      </label>
                      <button
                        type="button"
                        title="Remove image"
                        onClick={removeDesktop}
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
                      Upload desktop image
                    </p>
                    <p className="text-xs text-slate-400">
                      PNG, JPG, WEBP — max 5MB
                    </p>
                    <input
                      type="file"
                      name="desktopImage"
                      hidden
                      accept="image/*"
                      onChange={handleDesktopUpload}
                    />
                  </label>
                )}
              </motion.div>

              {/* ================= MOBILE IMAGE ================= */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.14 }}
                className={cardStyle}
              >
                <SectionHeader
                  icon={ImageIcon}
                  title="Mobile Image"
                  subtitle="Upload mobile-optimized banner (optional, max 5MB)"
                />

                {mobilePreview ? (
                  <div className="relative overflow-hidden rounded-2xl border border-slate-200">
                    <img
                      src={mobilePreview}
                      alt="mobile preview"
                      className="h-56 w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                    {mobileFile && (
                      <div className="absolute bottom-3 left-3 rounded-xl bg-black/60 px-3 py-1.5 backdrop-blur">
                        <p className="text-xs font-medium text-white">
                          {mobileFile.name}
                        </p>
                        <p className="text-[10px] text-white/70">
                          {(mobileFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    )}

                    <div className="absolute right-3 top-3 flex gap-2">
                      <label
                        title="Change image"
                        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl bg-white/90 shadow-sm transition-all hover:bg-white"
                      >
                        <RotateCcw size={15} className="text-slate-700" />
                        <input
                          type="file"
                          name="mobileImage"
                          hidden
                          accept="image/*"
                          onChange={handleMobileUpload}
                        />
                      </label>
                      <button
                        type="button"
                        title="Remove image"
                        onClick={removeMobile}
                        className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/90 shadow-sm transition-all hover:bg-red-500"
                      >
                        <X size={15} className="text-white" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 transition-all hover:border-emerald-500 hover:bg-emerald-50/30">
                    <div className="rounded-2xl bg-emerald-50 p-3">
                      <ImagePlus className="text-emerald-600" size={22} />
                    </div>
                    <p className="mt-2 text-sm font-medium text-slate-600">
                      Upload mobile image
                    </p>
                    <p className="text-xs text-slate-400">
                      PNG, JPG, WEBP — max 5MB
                    </p>
                    <input
                      type="file"
                      name="mobileImage"
                      hidden
                      accept="image/*"
                      onChange={handleMobileUpload}
                    />
                  </label>
                )}
              </motion.div>

              {/* ================= SEO ================= */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.16 }}
                className={cardStyle}
              >
                <div className="mb-6 flex items-center justify-between">
                  <SectionHeader
                    icon={Globe}
                    title="SEO Settings"
                    subtitle="Improve discoverability of this banner page"
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
                      placeholder="e.g. Summer Sale 2025 | Your Store"
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
                          yourstore.com/banners/{slugPreview || "slug"}
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

              {/* ================= BANNER SETTINGS ================= */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={cardStyle}
              >
                <SectionHeader
                  icon={Layers}
                  title="Banner Settings"
                  subtitle="Control visibility and featured status"
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
                            ? "Banner is visible across the website"
                            : "Banner is hidden from all users"
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
                            ? "Highlighted in featured banner sections"
                            : "Not shown in featured sections"
                        }
                        value={field.value}
                        onChange={field.onChange}
                        activeColor="blue"
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
                        How this banner will appear
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
                      {desktopPreview ? (
                        <>
                          <img
                            src={desktopPreview}
                            alt="banner preview"
                            className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent" />

                          {watchedBannerType && (
                            <div className="absolute left-3 top-3">
                              <span className="rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
                                {
                                  BANNER_TYPES.find(
                                    (t) => t.value === watchedBannerType,
                                  )?.emoji
                                }{" "}
                                {
                                  BANNER_TYPES.find(
                                    (t) => t.value === watchedBannerType,
                                  )?.label
                                }
                              </span>
                            </div>
                          )}

                          {watchedIsFeatured && (
                            <div className="absolute right-3 top-3">
                              <span className="flex items-center gap-1 rounded-full bg-blue-500/90 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
                                <ShieldCheck size={11} />
                                Featured
                              </span>
                            </div>
                          )}

                          {watchedDiscount && (
                            <div className="absolute bottom-3 right-3">
                              <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">
                                {watchedDiscount}% OFF
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
                      <h3 className="text-xl font-bold tracking-tight text-slate-900">
                        {watchedTitle || (
                          <span className="text-slate-400">Banner Title</span>
                        )}
                      </h3>
                      {watchedSubtitle && (
                        <p className="mt-1 text-sm text-slate-500">
                          {watchedSubtitle}
                        </p>
                      )}
                      {slugPreview && (
                        <p className="mt-1 font-mono text-xs text-slate-400">
                          /{slugPreview}
                        </p>
                      )}
                      {watchedStartFrom && (
                        <p className="mt-2 text-sm font-semibold text-emerald-600">
                          {watchedStartFrom}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-3.5">
                        <p className="text-xs text-slate-500">Status</p>
                        <p
                          className={`mt-1 text-base font-bold ${watchedIsActive ? "text-emerald-600" : "text-red-500"}`}
                        >
                          {watchedIsActive ? "Active" : "Inactive"}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5">
                        <p className="text-xs text-slate-500">Type</p>
                        <p className="mt-1 text-base font-bold capitalize text-slate-900">
                          {watchedBannerType ? (
                            BANNER_TYPES.find(
                              (t) => t.value === watchedBannerType,
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
                          className={`mt-1 text-base font-bold ${watchedIsFeatured ? "text-blue-600" : "text-slate-400"}`}
                        >
                          {watchedIsFeatured ? "Yes" : "No"}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5">
                        <p className="text-xs text-slate-500">Mobile Image</p>
                        <p
                          className={`mt-1 text-base font-bold ${mobileFile ? "text-emerald-600" : "text-slate-400"}`}
                        >
                          {mobileFile ? "Uploaded" : "None"}
                        </p>
                      </div>
                    </div>

                    {watchedTitle && (
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 ring-1 ring-blue-100">
                          Banner Ready
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
                        {desktopFile && (
                          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-600 ring-1 ring-amber-100">
                            Image Set
                          </span>
                        )}
                        {watchedIsFeatured && (
                          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 ring-1 ring-blue-100">
                            Featured
                          </span>
                        )}
                        {watchedDiscount && (
                          <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600 ring-1 ring-red-100">
                            {watchedDiscount}% Off
                          </span>
                        )}
                        {mobileFile && (
                          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600 ring-1 ring-indigo-100">
                            Mobile Ready
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="border-t border-slate-100 bg-slate-50 px-6 py-5">
                    <SaveButton
                      loading={loading}
                      icon={<Save size={18} />}
                      label="Create Banner"
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

export default CreateBanner;
