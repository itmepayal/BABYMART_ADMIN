import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm, useFieldArray, Controller } from "react-hook-form";

import { Header } from "@/components/dashbaord/Header";
import { FormField } from "@/components/form/FormInput";

import { FiRefreshCw } from "react-icons/fi";
import {
  ArrowLeft,
  Upload,
  Trash2,
  Image as ImageIcon,
  Save,
  Sparkles,
  ToggleLeft,
  Eye,
  ImagePlus,
  Layers,
} from "lucide-react";

import { toast } from "sonner";
import { useBrands } from "@/hooks/brand/useBrands";
import { useUpdateBrand } from "@/hooks/brand/useBrandActions";

// ================= TYPES =================
type ImageType = {
  url: string;
};

type FormValues = {
  name: string;
  images: ImageType[];
  isActive: boolean;
};

// ================= CONSTANTS =================
const defaultImage = { url: "" };

const cardStyle =
  "rounded-3xl border border-slate-200 bg-white p-7 shadow-sm hover:shadow-md transition-all duration-300";

// ================= COMPONENT =================
const EditBrand = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [files, setFiles] = useState<(File | null)[]>([]);

  // ================= STORE HOOKS =================
  const { getBrandById, selectedBrand } = useBrands();
  const { handleUpdateBrand, loading } = useUpdateBrand();

  // ================= FORM =================
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
      images: [defaultImage],
      isActive: true,
    },
  });

  // ================= FIELD ARRAY =================
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "images",
  });

  // ================= FETCH BRAND =================
  useEffect(() => {
    if (!id) return;
    getBrandById(id);
  }, [id, getBrandById]);

  // ================= PREFILL FORM =================
  useEffect(() => {
    if (!selectedBrand) return;

    setValue("name", selectedBrand.name);
    setValue("isActive", selectedBrand.isActive);

    if (selectedBrand.images?.length) {
      replace(selectedBrand.images);
      setFiles(new Array(selectedBrand.images.length).fill(null));
    }
  }, [selectedBrand, setValue, replace]);

  // ================= IMAGE UPLOAD =================
  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);

    setValue(`images.${index}.url`, preview);

    setFiles((prev) => {
      const updated = [...prev];
      updated[index] = file;
      return updated;
    });
  };

  // ================= SUBMIT =================
  const onSubmit = async (data: FormValues) => {
    if (!id) return toast.error("Brand ID missing");

    const toastId = toast.loading("Updating brand...");

    try {
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("isActive", data.isActive.toString());

      const existingImages: string[] = [];

      data.images.forEach((img, index) => {
        if (files[index]) {
          formData.append("images", files[index] as File);
        } else if (img.url) {
          existingImages.push(img.url);
        }
      });

      formData.append("existingImages", JSON.stringify(existingImages));

      await handleUpdateBrand(id, formData);

      toast.success("Brand updated successfully", { id: toastId });
      navigate("/dashboard/brands");
    } catch (error: any) {
      toast.error(error?.message || "Failed to update brand", {
        id: toastId,
      });
    }
  };

  console.log(selectedBrand);

  return (
    <div className="min-h-screen bg-slate-50 text-sm">
      <Header
        title="Edit Brand"
        description="Update your brand details and manage visibility"
        actionLabel="Back"
        actionIcon={ArrowLeft}
        onAction={() => navigate("/dashboard/brands")}
        refreshIcon={FiRefreshCw}
        isRefreshiingShow={false}
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-12">
          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="xl:col-span-8 space-y-6"
          >
            {/* BRAND DETAILS */}
            <div className={cardStyle}>
              <div className="mb-5 flex items-center gap-2">
                <Sparkles className="text-emerald-500" size={18} />
                <h2 className="text-lg font-semibold">Brand Identity</h2>
              </div>

              <FormField
                label="Brand Name"
                icon={ImageIcon}
                {...register("name", {
                  required: "Brand name is required",
                })}
                error={errors.name?.message}
              />

              <p className="mt-2 flex items-center gap-1 text-xs text-slate-500">
                <Eye size={12} />
                Visible across product listings
              </p>
            </div>

            {/* IMAGES */}
            <div className={cardStyle}>
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="flex items-center gap-2 text-lg font-semibold">
                    <Layers size={18} className="text-emerald-500" />
                    Brand Assets
                  </h2>
                  <p className="text-xs text-slate-500">
                    Upload logos or brand visuals
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => append(defaultImage)}
                  className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-white"
                >
                  <ImagePlus size={16} />
                  Add Image
                </button>
              </div>

              <div className="space-y-5">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-semibold">
                        IMAGE {index + 1}
                      </span>

                      {fields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="text-red-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>

                    {watch(`images.${index}.url`) ? (
                      <img
                        src={watch(`images.${index}.url`)}
                        alt="brand"
                        className="h-28 w-28 rounded-xl border object-cover"
                      />
                    ) : (
                      <label className="flex cursor-pointer flex-col items-center justify-center border-2 border-dashed py-6">
                        <Upload size={18} />
                        <span className="mt-2 text-xs">Upload image</span>

                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, index)}
                        />
                      </label>
                    )}
                  </div>
                ))}
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
                      {field.value ? "Active Brand" : "Inactive Brand"}
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
                  {watch("name") || "Brand Preview"}
                </h3>
              </div>

              <div className="mt-6 space-y-3 text-sm">
                <div className="rounded-xl bg-slate-50 p-3">
                  Images: {fields.length}
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
                {loading ? "Updating..." : "Update Brand"}
              </button>
            </div>
          </motion.div>
        </div>
      </form>
    </div>
  );
};

export default EditBrand;
