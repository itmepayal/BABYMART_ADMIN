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
} from "lucide-react";

import { toast } from "sonner";
import { useCreateCategory } from "@/hooks/categories/useCategoryActions";

type FormValues = {
  name: string;
  categoryType: string;
  image: string;
  isActive: boolean;
};

const cardStyle =
  "rounded-3xl border border-slate-200 bg-white p-7 shadow-sm hover:shadow-lg transition-all duration-300";

const CreateCategory = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);

  const { handleCreateCategory, loading } = useCreateCategory();

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
      categoryType: "",
      image: "",
      isActive: true,
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setValue("image", URL.createObjectURL(selected));
  };

  const onSubmit = async (data: FormValues) => {
    if (!file) {
      toast.error("Please upload category image");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("categoryType", data.categoryType);
      formData.append("isActive", String(data.isActive));
      formData.append("image", file);

      await handleCreateCategory(formData);

      toast.success("Category created successfully");
      navigate("/dashboard/categories");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create category");
    }
  };

  return (
    <div className="min-h-screen">
      {/* ================= HEADER ================= */}
      <Header
        title="Create Category"
        description="Add a new category to your catalog"
        actionLabel="Back"
        actionIcon={ArrowLeft}
        onAction={() => navigate("/dashboard/categories")}
        refreshIcon={FiRefreshCw}
        isRefreshiingShow={false}
      />
      {/* ================= FORM ================= */}
      <div className="mx-auto py-8">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-8 xl:grid-cols-12">
            {/* ================= LEFT SECTION ================= */}
            <div className="space-y-8 xl:col-span-8">
              {/* ================= CATEGORY DETAILS ================= */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className={cardStyle}
              >
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-xl bg-emerald-50 p-2">
                    <Sparkles className="text-emerald-600" size={18} />
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold">Category Details</h2>
                    <p className="text-sm text-slate-500">
                      Create category identity
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  <FormField
                    label="Category Name"
                    icon={Tag}
                    placeholder="Enter category name"
                    {...register("name", {
                      required: "Category name is required",
                    })}
                    error={errors.name?.message}
                  />

                  <FormField
                    label="Category Type"
                    icon={FolderTree}
                    placeholder="Enter category type"
                    {...register("categoryType", {
                      required: "Category type is required",
                    })}
                    error={errors.categoryType?.message}
                  />
                </div>
              </motion.div>

              {/* ================= CATEOGRY IMAGE ================= */}
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
                  <div className="relative overflow-hidden rounded-2xl border">
                    <img
                      src={watch("image")}
                      alt="preview"
                      className="h-72 w-full object-cover"
                    />
                  </div>
                ) : (
                  <label className="flex min-h-[280px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 hover:border-emerald-500">
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
                      Control whether this brand is visible to customers
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
                          {field.value
                            ? "Active Category"
                            : "Inactive Category"}
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
                        Real-time brand representation
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

                  <div className="p-6 pb-0">
                    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                      {watch("image") ? (
                        <>
                          <img
                            src={watch("image")}
                            alt="brand preview"
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
                  <div className="space-y-6 p-6">
                    <div>
                      <h3 className="text-2xl font-bold tracking-tight text-slate-900 capitalize">
                        {watch("name") || "Category Name"}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        This preview shows how your category will appear in your
                        product listings and filtering system.
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
                  </div>
                  <div className="border-t border-slate-100 bg-slate-50 px-6 py-5">
                    <SaveButton
                      loading={loading}
                      icon={<Save size={18} />}
                      label="Create Category"
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

export default CreateCategory;
