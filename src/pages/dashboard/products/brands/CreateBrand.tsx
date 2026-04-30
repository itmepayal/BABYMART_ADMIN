// ================= IMPORTS =================
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { toast } from "sonner";

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

// ================= MAIN COMPONENT =================
const CreateBrand = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // ================= FORM SETUP =================
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

  const { fields, append, remove } = useFieldArray({
    control,
    name: "images",
  });

  // ================= SUBMIT HANDLER =================
  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    const id = toast.loading("Creating brand...");

    try {
      console.log("Brand Data:", data);

      // TODO: API CALL HERE
      // await brandService.createBrand(data)

      toast.success("Brand created successfully", { id });
      navigate("/dashboard/brands");
    } catch (err: any) {
      toast.error(err?.message || "Failed to create brand", { id });
    } finally {
      setLoading(false);
    }
  };

  // ================= IMAGE UPLOAD HANDLER =================
  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);

    setValue(`images.${index}.url`, preview);
  };

  // ================= UI =================
  return (
    <div className="min-h-screen bg-slate-50 text-sm">
      {/* ===== HEADER ===== */}
      <Header
        title="Create Brand"
        description="Build a strong identity for your product ecosystem"
        actionLabel="Back"
        actionIcon={ArrowLeft}
        onAction={() => navigate("/dashboard/brands")}
        refreshIcon={FiRefreshCw}
        isRefreshiingShow={false}
      />

      {/* ===== FORM ===== */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-12">
          {/* ================= LEFT SECTION ================= */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="xl:col-span-8 space-y-6"
          >
            {/* ===== BRAND INFO ===== */}
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

              <p className="mt-2 text-xs text-slate-500 flex items-center gap-1">
                <Eye size={12} />
                Visible across product listings
              </p>
            </div>

            {/* ===== BRAND IMAGES ===== */}
            <div className={cardStyle}>
              {/* HEADER */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold flex items-center gap-2">
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

              {/* IMAGE LIST */}
              <div className="space-y-5">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5"
                  >
                    {/* IMAGE HEADER */}
                    <div className="flex items-center justify-between mb-3">
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

                    {/* IMAGE PREVIEW / UPLOAD */}
                    {watch(`images.${index}.url`) ? (
                      <img
                        src={watch(`images.${index}.url`)}
                        className="h-28 w-28 rounded-xl object-cover border"
                      />
                    ) : (
                      <label className="flex flex-col items-center justify-center border-2 border-dashed py-6 cursor-pointer">
                        <Upload size={18} />
                        <span className="text-xs mt-2">Upload image</span>

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

            {/* ===== STATUS SECTION ===== */}
            <div className={cardStyle}>
              <h2 className="mb-5 text-lg font-semibold flex items-center gap-2">
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
                    className={`flex h-14 w-full items-center justify-between rounded-2xl px-5 border ${
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
                        className={`h-4 w-4 bg-white rounded-full ${
                          field.value ? "ml-auto" : ""
                        }`}
                      />
                    </div>
                  </button>
                )}
              />
            </div>
          </motion.div>

          {/* ================= RIGHT SECTION ================= */}
          <motion.div
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            className="xl:col-span-4"
          >
            <div className="sticky top-6 rounded-3xl border bg-white p-6">
              {/* PREVIEW */}
              <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white p-6 rounded-2xl text-center">
                <h3 className="text-xl font-bold">
                  {watch("name") || "Brand Preview"}
                </h3>
              </div>

              {/* STATS */}
              <div className="mt-6 space-y-3 text-sm">
                <div className="bg-slate-50 p-3 rounded-xl">
                  Images: {fields.length}
                </div>

                <div className="bg-slate-50 p-3 rounded-xl">
                  Status: {watch("isActive") ? "Active" : "Inactive"}
                </div>
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={loading}
                className="mt-6 w-full bg-emerald-600 text-white py-3 rounded-2xl"
              >
                <Save className="inline mr-2" size={16} />
                {loading ? "Creating..." : "Create Brand"}
              </button>
            </div>
          </motion.div>
        </div>
      </form>
    </div>
  );
};

export default CreateBrand;
