import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";

import { Header } from "@/components/dashbaord/Header";
import { FormField } from "@/components/form/FormInput";

import { FiRefreshCw } from "react-icons/fi";

import {
  ArrowLeft,
  Save,
  Sparkles,
  FolderTree,
  Image as ImageIcon,
  Layers,
  ImagePlus,
  Camera,
  Trash2,
} from "lucide-react";

import { toast } from "sonner";

import { useCategories } from "@/hooks/categories/useCategories";
import { useUpdateCategory } from "@/hooks/categories/useCategoryActions";

import { SaveButton } from "@/components/common/Action";

// ================= TYPES =================
type FormValues = {
  name: string;
  categoryType: string;
  isActive: boolean;
  image: string;
};

// ================= STYLE =================
const cardStyle =
  "rounded-3xl border border-slate-200 bg-white p-7 shadow-sm hover:shadow-md transition-all duration-300";

// ================= COMPONENT =================
const EditCategory = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [file, setFile] = useState<File | null>(null);

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
      isActive: true,
      image: "",
    },
  });

  // ================= FETCH CATEGORY =================
  useEffect(() => {
    if (id) {
      getCategoryById(id);
    }
  }, [id]);

  // ================= PREFILL =================
  useEffect(() => {
    if (selectedCategory) {
      reset({
        name: selectedCategory.name || "",
        categoryType: selectedCategory.categoryType || "",
        isActive: selectedCategory.isActive ?? true,
        image:
          typeof selectedCategory.image === "string"
            ? selectedCategory.image
            : selectedCategory.image?.url || "",
      });
    }
  }, [selectedCategory, reset]);

  // ================= IMAGE UPLOAD =================
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];

    if (!selected) return;

    setFile(selected);

    setValue("image", URL.createObjectURL(selected));
  };

  // ================= REMOVE IMAGE =================
  const handleRemoveImage = () => {
    setFile(null);
    setValue("image", "");
  };

  // ================= SUBMIT =================
  const onSubmit = async (data: FormValues) => {
    if (!id) return;

    const toastId = toast.loading("Updating category...");

    try {
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("categoryType", data.categoryType);
      formData.append("isActive", String(data.isActive));

      if (file) {
        formData.append("image", file);
      }

      await handleUpdateCategory(id, formData);

      toast.success("Category updated successfully", {
        id: toastId,
      });

      navigate("/dashboard/categories");
    } catch (error: any) {
      toast.error(error?.message || "Failed to update category", {
        id: toastId,
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-sm">
      {/* ================= HEADER ================= */}
      <Header
        title="Edit Category"
        description="Update your category information"
        actionLabel="Back"
        actionIcon={ArrowLeft}
        onAction={() => navigate("/dashboard/categories")}
        refreshIcon={FiRefreshCw}
        isRefreshiingShow={false}
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-12">
          {/* ================= LEFT ================= */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 xl:col-span-8"
          >
            {/* ================= DETAILS ================= */}
            <div className={cardStyle}>
              <div className="mb-5 flex items-center gap-2">
                <div className="rounded-xl bg-emerald-50 p-2">
                  <Sparkles className="text-emerald-600" size={18} />
                </div>
                <h2 className="text-lg font-semibold">Category Details</h2>
              </div>
              <div className="space-y-5">
                <FormField
                  label="Category Name"
                  icon={FolderTree}
                  {...register("name", {
                    required: "Category name is required",
                  })}
                  error={errors.name?.message}
                />

                <FormField
                  label="Category Type"
                  icon={FolderTree}
                  {...register("categoryType", {
                    required: "Category type is required",
                  })}
                  error={errors.categoryType?.message}
                />
              </div>
            </div>

            {/* ================= CATEGORY IMAGE ================= */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className={cardStyle}
            >
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-emerald-50 p-2">
                  <ImageIcon className="text-emerald-600" size={18} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Category Image</h2>
                  <p className="text-sm text-slate-500">
                    Upload high-quality category image
                  </p>
                </div>
              </div>
              {watch("image") ? (
                <div className="relative overflow-hidden rounded-2xl border border-slate-200">
                  <img
                    src={watch("image")}
                    alt="preview"
                    className="h-72 w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 transition-all duration-300 hover:bg-black/30" />
                  <div className="absolute right-4 top-4 flex items-center gap-2">
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white/90 px-4 py-2 text-sm font-medium text-slate-700 shadow-lg backdrop-blur hover:bg-white">
                      <Camera size={16} />
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white shadow-lg hover:bg-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <label className="flex min-h-[280px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 transition-all hover:border-emerald-500 hover:bg-emerald-50/30">
                  <div className="rounded-2xl bg-emerald-50 p-4">
                    <ImagePlus className="text-emerald-600" size={28} />
                  </div>

                  <p className="mt-3 text-sm font-semibold text-slate-700">
                    Upload Image
                  </p>
                  <p className="text-xs text-slate-400">
                    PNG, JPG, WEBP supported
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

            {/* ================= STATUS ================= */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className={cardStyle}
            >
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-50 shadow-sm">
                  <Layers className="text-emerald-600" size={18} />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Category Visibility
                  </h2>

                  <p className="text-sm text-slate-500">
                    Control whether this category is visible to customers
                  </p>
                </div>
              </div>

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
                        {field.value ? "Active Category" : "Inactive Category"}
                      </span>

                      <span className="text-xs opacity-70">
                        {field.value
                          ? "Category will be visible across products"
                          : "Category will remain hidden from listings"}
                      </span>
                    </div>

                    <div
                      className={`relative h-7 w-12 rounded-full p-1 transition-all ${
                        field.value ? "bg-emerald-500" : "bg-red-500"
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
          </motion.div>

          {/* ================= RIGHT SIDEBAR ================= */}
          <div className="xl:col-span-4">
            <div className="sticky top-6">
              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-100">
                {/* HEADER */}
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      Live Preview
                    </h2>

                    <p className="text-xs text-slate-500">
                      Real-time category representation
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
                      watch("isActive")
                        ? "bg-emerald-50 text-emerald-600 ring-emerald-100"
                        : "bg-red-50 text-red-600 ring-red-100"
                    }`}
                  >
                    {watch("isActive") ? "Active" : "Inactive"}
                  </span>
                </div>

                {/* IMAGE */}
                <div className="p-6 pb-0">
                  <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                    {watch("image") ? (
                      <>
                        <img
                          src={watch("image")}
                          alt="preview"
                          className="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                        <div className="absolute left-4 top-4">
                          <span className="rounded-full bg-black/70 px-3 py-1 text-[11px] font-medium text-white backdrop-blur">
                            Category Image
                          </span>
                        </div>

                        <div className="absolute bottom-4 right-4 rounded-full bg-white/20 px-3 py-1 text-[10px] text-white backdrop-blur">
                          Hover to zoom
                        </div>
                      </>
                    ) : (
                      <div className="flex h-72 flex-col items-center justify-center gap-3 text-slate-400">
                        <div className="rounded-2xl bg-slate-100 p-4">
                          <ImageIcon size={40} />
                        </div>

                        <p className="text-sm">No image uploaded</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* CONTENT */}
                <div className="space-y-6 p-6">
                  <div>
                    <h3 className="text-2xl font-bold tracking-tight text-slate-900 capitalize">
                      {watch("name") || "Category Name"}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      This preview shows how your category will appear in
                      product listings.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-4">
                      <p className="text-xs text-slate-500">Status</p>

                      <p
                        className={`mt-1 text-xl font-bold ${
                          watch("isActive")
                            ? "text-emerald-600"
                            : "text-red-500"
                        }`}
                      >
                        {watch("isActive") ? "Active" : "Inactive"}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs text-slate-500">Type</p>

                      <p className="mt-1 text-lg font-bold text-slate-900 capitalize">
                        {watch("categoryType") || "Not set"}
                      </p>
                    </div>
                  </div>

                  {/* BADGES */}
                  {watch("name") && (
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 ring-1 ring-blue-100">
                        Category Ready
                      </span>

                      {watch("isActive") && (
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600 ring-1 ring-emerald-100">
                          Visible
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* FOOTER */}
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
  );
};

export default EditCategory;
