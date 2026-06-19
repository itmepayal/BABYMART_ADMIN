import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
} from "lucide-react";

import { toast } from "sonner";
import { useCategories } from "@/hooks/categories/useCategories";
import { useUpdateCategory } from "@/hooks/categories/useCategoryActions";
import { api } from "@/lib/config";

type CategoryType =
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
  categoryType: CategoryType | "";
  description: string;
  image: string;
  parentCategory: string;
  isActive: boolean;
  seoTitle: string;
  seoDescription: string;
};

interface ICategory {
  _id: string;
  name: string;
  slug: string;
  image: { url: string; public_id: string };
  categoryType: CategoryType;
  isActive: boolean;
}

const CATEGORY_TYPES: { value: CategoryType; label: string; emoji: string }[] =
  [
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

const CategoryTypeSelect = ({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (val: CategoryType) => void;
  error?: string;
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = CATEGORY_TYPES.filter((t) =>
    t.label.toLowerCase().includes(search.toLowerCase()),
  );

  const selected = CATEGORY_TYPES.find((t) => t.value === value);

  return (
    <div className="relative">
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        Category Type <span className="text-red-500">*</span>
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
            Select category type
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

const ParentCategorySelect = ({
  value,
  onChange,
  categories,
  loading,
  currentId,
  error,
}: {
  value: string;
  onChange: (val: string) => void;
  categories: ICategory[];
  loading: boolean;
  currentId?: string;
  error?: string;
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const eligible = categories.filter((c) => c._id !== currentId);
  const filtered = eligible.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  const selected = categories.find((c) => c._id === value);

  return (
    <div className="relative">
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        Parent Category <span className="text-slate-400">(optional)</span>
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
            <img
              src={selected.image.url}
              alt={selected.name}
              className="h-5 w-5 rounded-full object-cover ring-1 ring-slate-200"
            />
            <span>{selected.name}</span>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-500">
              {
                CATEGORY_TYPES.find((t) => t.value === selected.categoryType)
                  ?.emoji
              }{" "}
              {selected.categoryType}
            </span>
          </span>
        ) : (
          <span className="flex items-center gap-2 text-sm text-slate-400">
            <FolderTree size={15} />
            None (Top-level category)
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
            {loading ? (
              <div className="flex items-center justify-center gap-2 py-6 text-slate-400">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
                <span className="text-sm">Loading categories...</span>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    onChange("");
                    setOpen(false);
                    setSearch("");
                  }}
                  className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                    !value
                      ? "bg-emerald-50 font-semibold text-emerald-700"
                      : "text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-100 text-xs">
                    —
                  </span>
                  <span>None (Top-level)</span>
                  {!value && (
                    <span className="ml-auto text-emerald-500">✓</span>
                  )}
                </button>

                {filtered.length > 0 && (
                  <div className="my-1.5 border-t border-slate-100" />
                )}

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
                      <img
                        src={cat.image.url}
                        alt={cat.name}
                        className="h-6 w-6 rounded-lg object-cover ring-1 ring-slate-200"
                      />
                      <span className="flex-1 truncate">{cat.name}</span>
                      <span className="shrink-0 text-[10px] text-slate-400">
                        {
                          CATEGORY_TYPES.find(
                            (t) => t.value === cat.categoryType,
                          )?.emoji
                        }{" "}
                        {cat.categoryType}
                      </span>
                      {value === cat._id && (
                        <span className="ml-1 text-emerald-500">✓</span>
                      )}
                    </button>
                  ))
                )}
              </>
            )}
          </div>
        </div>
      )}

      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
};

const CharCount = ({ current, max }: { current: number; max: number }) => (
  <span
    className={`text-xs ${current > max * 0.9 ? "text-amber-500" : "text-slate-400"}`}
  >
    {current}/{max}
  </span>
);

const EditCategory = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [file, setFile] = useState<File | null>(null);
  const [allCategories, setAllCategories] = useState<ICategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  const { selectedCategory, getCategoryById, loading } = useCategories();
  const { handleUpdateCategory } = useUpdateCategory();

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      categoryType: "",
      description: "",
      image: "",
      parentCategory: "",
      isActive: true,
      seoTitle: "",
      seoDescription: "",
    },
  });

  useEffect(() => {
    const fetchCategories = async () => {
      setCategoriesLoading(true);
      try {
        const res = await api.get("/categories");
        setAllCategories(res.data.categories ?? res.data);
      } catch {
        toast.error("Failed to load categories");
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (id) getCategoryById(id);
  }, [id]);

  useEffect(() => {
    if (selectedCategory) {
      reset({
        name: selectedCategory.name || "",
        categoryType: (selectedCategory.categoryType as CategoryType) || "",
        description: selectedCategory.description || "",
        image:
          typeof selectedCategory.image === "string"
            ? selectedCategory.image
            : selectedCategory.image?.url || "",
        parentCategory: selectedCategory.parentCategory || "",
        isActive: selectedCategory.isActive ?? true,
        seoTitle: selectedCategory.seoTitle || "",
        seoDescription: selectedCategory.seoDescription || "",
      });
    }
  }, [selectedCategory, reset]);

  const watchedName = watch("name");
  const watchedDescription = watch("description");
  const watchedSeoTitle = watch("seoTitle");
  const watchedSeoDescription = watch("seoDescription");
  const watchedImage = watch("image");
  const watchedIsActive = watch("isActive");
  const watchedCategoryType = watch("categoryType");
  const watchedParentCategory = watch("parentCategory");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (selected.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setFile(selected);
    setValue("image", URL.createObjectURL(selected));
  };

  const removeImage = () => {
    setFile(null);
    setValue("image", "");
  };

  const autoFillSeo = () => {
    if (watchedName && !watchedSeoTitle) {
      setValue("seoTitle", `${watchedName} | Baby Store`);
    }
    if (watchedDescription && !watchedSeoDescription) {
      setValue("seoDescription", watchedDescription.slice(0, 160));
    }
  };

  const onSubmit = async (data: FormValues) => {
    if (!id) return;

    const toastId = toast.loading("Updating category...");

    try {
      const formData = new FormData();
      formData.append("name", data.name.trim());
      formData.append("categoryType", data.categoryType);
      formData.append("isActive", String(data.isActive));

      if (file) formData.append("image", file);

      if (data.description.trim()) {
        formData.append("description", data.description.trim());
      }
      if (data.parentCategory) {
        formData.append("parentCategory", data.parentCategory);
      }
      if (data.seoTitle.trim()) {
        formData.append("seoTitle", data.seoTitle.trim());
      }
      if (data.seoDescription.trim()) {
        formData.append("seoDescription", data.seoDescription.trim());
      }

      await handleUpdateCategory(id, formData);

      toast.success("Category updated successfully! ✅", { id: toastId });
      navigate("/dashboard/categories");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update category", {
        id: toastId,
      });
    }
  };

  const slugPreview = watchedName
    ? watchedName
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "")
    : null;

  const selectedParentName = allCategories.find(
    (c) => c._id === watchedParentCategory,
  )?.name;

  return (
    <div className="min-h-screen">
      <Header
        title="Edit Category"
        description="Update category details in your product catalog"
        actionLabel="Back"
        actionIcon={ArrowLeft}
        onAction={() => navigate("/dashboard/categories")}
        refreshIcon={FiRefreshCw}
        isRefreshiingShow={false}
      />

      <div className="mx-auto py-8">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-8 xl:grid-cols-12">
            <div className="space-y-8 xl:col-span-8">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className={cardStyle}
              >
                <SectionHeader
                  icon={Sparkles}
                  title="Category Details"
                  subtitle="Basic information about the category"
                />

                <div className="space-y-5">
                  <div>
                    <FormField
                      label="Category Name"
                      icon={Tag}
                      placeholder="e.g. Premium Baby Care"
                      {...register("name", {
                        required: "Category name is required",
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
                    name="categoryType"
                    control={control}
                    rules={{ required: "Category type is required" }}
                    render={({ field }) => (
                      <CategoryTypeSelect
                        value={field.value}
                        onChange={field.onChange}
                        error={errors.categoryType?.message}
                      />
                    )}
                  />

                  <Controller
                    name="parentCategory"
                    control={control}
                    render={({ field }) => (
                      <ParentCategorySelect
                        value={field.value}
                        onChange={field.onChange}
                        categories={allCategories}
                        loading={categoriesLoading}
                        currentId={id}
                        error={errors.parentCategory?.message}
                      />
                    )}
                  />

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
                      placeholder="Describe what products this category contains..."
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
                  title="Category Image"
                  subtitle="Upload a high-quality image (max 5MB)"
                />

                {watchedImage ? (
                  <div className="relative overflow-hidden rounded-2xl border border-slate-200">
                    <img
                      src={watchedImage}
                      alt="preview"
                      className="h-72 w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                    {file && (
                      <div className="absolute bottom-3 left-3 rounded-xl bg-black/60 px-3 py-1.5 backdrop-blur">
                        <p className="text-xs font-medium text-white">
                          {file.name}
                        </p>
                        <p className="text-[10px] text-white/70">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
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
                          hidden
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                      </label>
                      <button
                        type="button"
                        title="Remove image"
                        onClick={removeImage}
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
                      Click to upload image
                    </p>
                    <p className="text-xs text-slate-400">
                      PNG, JPG, WEBP — max 5MB
                    </p>
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleImageUpload}
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
                    subtitle="Help customers find this category via search"
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
                      placeholder="e.g. Baby Care Products | Your Store Name"
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
                          yourstore.com/categories/{slugPreview || "slug"}
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
                  title="Category Visibility"
                  subtitle="Control whether this category is visible to customers"
                />

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
                          : "border-red-200 bg-red-50 text-red-600"
                      }`}
                    >
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-semibold">
                          {field.value ? "Active" : "Inactive"}
                        </span>
                        <span className="text-xs opacity-70">
                          {field.value
                            ? "Visible in product listings and filters"
                            : "Hidden from all product listings"}
                        </span>
                      </div>

                      <div
                        className={`relative h-7 w-12 rounded-full p-1 transition-all ${
                          field.value ? "bg-emerald-500" : "bg-red-400"
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
              </motion.div>
            </div>

            <div className="xl:col-span-4">
              <div className="sticky top-6">
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-100">
                  <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">
                        Live Preview
                      </h2>
                      <p className="text-xs text-slate-500">
                        How this category will appear
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
                      {watchedImage ? (
                        <>
                          <img
                            src={watchedImage}
                            alt="category preview"
                            className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                          {watchedCategoryType && (
                            <div className="absolute left-3 top-3">
                              <span className="rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
                                {
                                  CATEGORY_TYPES.find(
                                    (t) => t.value === watchedCategoryType,
                                  )?.emoji
                                }{" "}
                                {
                                  CATEGORY_TYPES.find(
                                    (t) => t.value === watchedCategoryType,
                                  )?.label
                                }
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
                          <span className="text-slate-400">Category Name</span>
                        )}
                      </h3>
                      {slugPreview && (
                        <p className="mt-1 font-mono text-xs text-slate-400">
                          /{slugPreview}
                        </p>
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
                        <p className="text-xs text-slate-500">Type</p>
                        <p className="mt-1 text-base font-bold capitalize text-slate-900">
                          {watchedCategoryType ? (
                            CATEGORY_TYPES.find(
                              (t) => t.value === watchedCategoryType,
                            )?.label
                          ) : (
                            <span className="font-normal text-slate-400">
                              Not set
                            </span>
                          )}
                        </p>
                      </div>

                      <div className="col-span-2 rounded-2xl border border-slate-200 bg-slate-50 p-3.5">
                        <p className="text-xs text-slate-500">
                          Parent Category
                        </p>
                        <p className="mt-1 truncate text-sm font-bold text-slate-900">
                          {selectedParentName ? (
                            <span className="flex items-center gap-1.5">
                              <img
                                src={
                                  allCategories.find(
                                    (c) => c._id === watchedParentCategory,
                                  )?.image.url
                                }
                                className="h-4 w-4 rounded-full object-cover"
                              />
                              {selectedParentName}
                            </span>
                          ) : (
                            <span className="font-normal text-slate-400">
                              Top-level (no parent)
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    {watchedName && (
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 ring-1 ring-blue-100">
                          Category Ready
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
                        {file && (
                          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-600 ring-1 ring-amber-100">
                            Image Updated
                          </span>
                        )}
                        {watchedParentCategory && (
                          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600 ring-1 ring-indigo-100">
                            Sub-category
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="border-t border-slate-100 bg-slate-50 px-6 py-5">
                    <SaveButton
                      loading={loading}
                      icon={<Save size={18} />}
                      label="Update Category"
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

export default EditCategory;
