import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";

import { Header } from "@/components/dashbaord/Header";
import { FormField } from "@/components/form/FormInput";

import {
  ArrowLeft,
  Upload,
  Image as ImageIcon,
  Save,
  Sparkles,
  ToggleLeft,
  Calendar,
  Layers,
} from "lucide-react";

import { toast } from "sonner";
import { useCreateBanner } from "@/hooks/banner/useBannerAction";

// ================= TYPES =================
type FormValues = {
  name: string;
  title: string;
  startFrom: string;
  bannerType: string;
  isActive: boolean;
};

// ================= STYLE =================
const cardStyle =
  "rounded-3xl border border-slate-200 bg-white p-7 shadow-sm hover:shadow-md transition";

const CreateBanner = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  const { handleCreateBanner, loading } = useCreateBanner();

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      title: "",
      startFrom: "",
      bannerType: "home",
      isActive: true,
    },
  });

  // ================= IMAGE HANDLER =================
  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  // ================= SUBMIT =================
  const onSubmit = async (data: FormValues) => {
    if (!file) {
      toast.error("Please upload banner image");
      return;
    }

    const toastId = toast.loading("Creating banner...");

    try {
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("title", data.title);
      formData.append("startFrom", data.startFrom);
      formData.append("bannerType", data.bannerType);
      formData.append("isActive", String(data.isActive));
      formData.append("image", file);

      await handleCreateBanner(formData);
      reset();

      toast.success("Banner created successfully", { id: toastId });
      navigate("/dashboard/banners");
    } catch (err: any) {
      toast.error(err?.message || "Failed to create banner", {
        id: toastId,
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-sm">
      {/* ================= HEADER ================= */}
      <Header
        title="Create Banner"
        description="Design promotional banners for your store"
        actionLabel="Back"
        actionIcon={ArrowLeft}
        onAction={() => navigate("/dashboard/banners")}
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-12">
          {/* ================= LEFT ================= */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="xl:col-span-8 space-y-6"
          >
            {/* ================= BASIC INFO ================= */}
            <div className={cardStyle}>
              <div className="mb-5 flex items-center gap-2">
                <Sparkles className="text-emerald-500" size={18} />
                <h2 className="text-lg font-semibold">Banner Details</h2>
              </div>

              <div className="space-y-4">
                <FormField
                  label="Banner Name"
                  icon={ImageIcon}
                  {...register("name", { required: "Required" })}
                  error={errors.name?.message}
                />

                <FormField
                  label="Title"
                  icon={Layers}
                  {...register("title", { required: "Required" })}
                  error={errors.title?.message}
                />

                <FormField
                  label="Start From"
                  type="date"
                  icon={Calendar}
                  {...register("startFrom", { required: "Required" })}
                />

                <FormField
                  label="Banner Type"
                  icon={Layers}
                  {...register("bannerType")}
                />
              </div>
            </div>

            {/* ================= IMAGE ================= */}
            <div className={cardStyle}>
              <h2 className="mb-4 text-lg font-semibold flex items-center gap-2">
                <Upload size={18} className="text-emerald-500" />
                Banner Image
              </h2>

              {preview ? (
                <img
                  src={preview}
                  className="h-40 w-full rounded-2xl object-cover border"
                />
              ) : (
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed py-10">
                  <Upload />
                  <span className="mt-2 text-xs">Upload Banner Image</span>
                  <input type="file" hidden onChange={handleImage} />
                </label>
              )}
            </div>

            {/* ================= STATUS ================= */}
            <div className={cardStyle}>
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <ToggleLeft size={18} />
                Status
              </h2>

              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <button
                    type="button"
                    onClick={() => field.onChange(!field.value)}
                    className={`flex w-full items-center justify-between rounded-2xl border px-5 py-4 ${
                      field.value
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-red-50 text-red-600"
                    }`}
                  >
                    <span>
                      {field.value ? "Active Banner" : "Inactive Banner"}
                    </span>

                    <div
                      className={`h-6 w-11 rounded-full p-1 ${
                        field.value ? "bg-emerald-500" : "bg-red-500"
                      }`}
                    >
                      <div
                        className={`h-4 w-4 rounded-full bg-white transition ${
                          field.value ? "ml-auto" : ""
                        }`}
                      />
                    </div>
                  </button>
                )}
              />
            </div>
          </motion.div>

          {/* ================= RIGHT ================= */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="xl:col-span-4"
          >
            <div className="sticky top-6 rounded-3xl border bg-white p-6">
              {/* PREVIEW */}
              <div className="rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 p-6 text-white text-center">
                <h3 className="text-xl font-bold">
                  {watch("title") || "Banner Preview"}
                </h3>
              </div>

              {/* INFO */}
              <div className="mt-5 space-y-3 text-sm">
                <div className="rounded-xl bg-slate-50 p-3">
                  Name: {watch("name") || "-"}
                </div>

                <div className="rounded-xl bg-slate-50 p-3">
                  Type: {watch("bannerType")}
                </div>

                <div className="rounded-xl bg-slate-50 p-3">
                  Status: {watch("isActive") ? "Active" : "Inactive"}
                </div>
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="mt-6 w-full rounded-2xl bg-emerald-600 py-3 text-white"
              >
                <Save size={16} className="mr-2 inline" />
                {loading ? "Creating..." : "Create Banner"}
              </button>
            </div>
          </motion.div>
        </div>
      </form>
    </div>
  );
};

export default CreateBanner;
