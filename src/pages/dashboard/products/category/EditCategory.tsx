import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  Trash2,
} from "lucide-react";

import { toast } from "sonner";
import { useCategories } from "@/hooks/categories/useCategories";
import { useUpdateCategory } from "@/hooks/categories/useCategoryActions";

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

      const res = await handleUpdateCategory(id, formData);
      console.log(res);

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
          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 xl:col-span-8"
          >
            {/* DETAILS */}
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
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="flex items-center gap-2 text-lg font-semibold">
                    <ImageIcon size={18} className="text-emerald-500" />
                    Category Asset
                  </h2>
                  <p className="text-xs text-slate-500">
                    Upload category thumbnail or cover image
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-semibold">
                      CATEGORY IMAGE
                    </span>

                    {watch("image") && (
                      <button
                        type="button"
                        onClick={() => {
                          setValue("image", "");
                          setFile(null);
                        }}
                        className="text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                  {watch("image") ? (
                    <div className="space-y-4">
                      <img
                        src={watch("image")}
                        alt="category"
                        className="h-28 w-28 rounded-xl border object-cover"
                      />

                      <label className="group inline-flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 hover:shadow-md">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 transition-colors duration-300 group-hover:bg-emerald-200">
                          <Upload size={16} />
                        </div>

                        <div className="flex flex-col leading-tight">
                          <span>Change Image</span>
                          <span className="text-xs font-normal text-slate-500 group-hover:text-emerald-600">
                            JPG, PNG or WebP
                          </span>
                        </div>

                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                      </label>
                    </div>
                  ) : (
                    <label className="flex cursor-pointer flex-col items-center justify-center border-2 border-dashed py-6">
                      <Upload size={18} />
                      <span className="mt-2 text-xs">Upload image</span>

                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </label>
                  )}
                </div>
              </div>
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
                {loading ? "Updating..." : "Update Category"}
              </button>
            </div>
          </motion.div>
        </div>
      </form>
    </div>
  );
};

export default EditCategory;
