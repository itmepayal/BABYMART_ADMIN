import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";

import { Header } from "@/components/dashbaord/Header";
import { FormField } from "@/components/form/FormInput";

import { FiRefreshCw } from "react-icons/fi";
import {
  ArrowLeft,
  Upload,
  Save,
  Sparkles,
  ToggleLeft,
  Eye,
  FolderTree,
  Image as ImageIcon,
} from "lucide-react";

import { toast } from "sonner";
import { useCreateCategory } from "@/hooks/categories/useCategoryActions";

// ================= TYPES =================
type FormValues = {
  name: string;
  categoryType: string;
  isActive: boolean;
  image: string;
};

// ================= STYLES =================
const cardStyle =
  "rounded-3xl border border-slate-200 bg-white p-7 shadow-sm hover:shadow-md transition-all duration-300";

// ================= COMPONENT =================
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
      isActive: true,
      image: "",
    },
  });

  // ================= IMAGE UPLOAD =================
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setValue("image", URL.createObjectURL(selected));
  };

  // ================= SUBMIT =================
  const onSubmit = async (data: FormValues) => {
    if (!file) {
      toast.error("Please upload category image");
      return;
    }

    const toastId = toast.loading("Creating category...");

    try {
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("categoryType", data.categoryType);
      formData.append("isActive", String(data.isActive));
      formData.append("image", file);

      await handleCreateCategory(formData);

      toast.success("Category created successfully", {
        id: toastId,
      });

      navigate("/dashboard/categories");
    } catch (error: any) {
      toast.error(error?.message || "Failed to create category", {
        id: toastId,
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-sm">
      <Header
        title="Create Category"
        description="Organize products with professional categories"
        actionLabel="Back"
        actionIcon={ArrowLeft}
        onAction={() => navigate("/dashboard/categories")}
        refreshIcon={FiRefreshCw}
        isRefreshiingShow={false}
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-12">
          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 xl:col-span-8"
          >
            {/* BASIC INFO */}
            <div className={cardStyle}>
              <div className="mb-5 flex items-center gap-2">
                <Sparkles className="text-emerald-500" size={18} />
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

              <p className="mt-3 flex items-center gap-1 text-xs text-slate-500">
                <Eye size={12} />
                Visible in product filtering
              </p>
            </div>

            {/* IMAGE */}
            <div className={cardStyle}>
              <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold">
                <ImageIcon size={18} className="text-emerald-500" />
                Category Image
              </h2>

              {watch("image") ? (
                <img
                  src={watch("image")}
                  alt="preview"
                  className="h-36 w-36 rounded-2xl border object-cover"
                />
              ) : (
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 py-10">
                  <Upload size={20} />
                  <span className="mt-2 text-xs">Upload category image</span>

                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              )}
            </div>

            {/* STATUS */}
            <div className={cardStyle}>
              <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold">
                <ToggleLeft size={18} />
                Visibility Control
              </h2>

              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <button
                    type="button"
                    onClick={() => field.onChange(!field.value)}
                    className={`flex h-14 w-full items-center justify-between rounded-2xl border px-5 ${
                      field.value
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-red-50 text-red-600"
                    }`}
                  >
                    <span>
                      {field.value ? "Active Category" : "Inactive Category"}
                    </span>

                    <div
                      className={`h-6 w-11 rounded-full p-1 ${
                        field.value ? "bg-emerald-500" : "bg-red-500"
                      }`}
                    >
                      <div
                        className={`h-4 w-4 rounded-full bg-white ${
                          field.value ? "ml-auto" : ""
                        }`}
                      />
                    </div>
                  </button>
                )}
              />
            </div>
          </motion.div>

          {/* RIGHT */}
          <motion.div
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            className="xl:col-span-4"
          >
            <div className="sticky top-6 rounded-3xl border bg-white p-6">
              <div className="rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 p-6 text-center text-white">
                <h3 className="text-xl font-bold">
                  {watch("name") || "Category Preview"}
                </h3>
              </div>

              <div className="mt-6 space-y-3 text-sm">
                <div className="rounded-xl bg-slate-50 p-3">
                  Type: {watch("categoryType") || "Not selected"}
                </div>

                <div className="rounded-xl bg-slate-50 p-3">
                  Status: {watch("isActive") ? "Active" : "Inactive"}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-6 w-full rounded-2xl bg-emerald-600 py-3 text-white"
              >
                <Save className="mr-2 inline" size={16} />
                {loading ? "Creating..." : "Create Category"}
              </button>
            </div>
          </motion.div>
        </div>
      </form>
    </div>
  );
};

export default CreateCategory;
