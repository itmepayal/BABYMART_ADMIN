import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { useBanners } from "@/hooks/banner/useBanner";

// ================= TYPES =================
type FormValues = {
  name: string;
  title: string;
  startFrom: string;
  bannerType: string;
  isActive: boolean;
};

const cardStyle =
  "rounded-3xl border border-slate-200/70 bg-white p-7 shadow-sm hover:shadow-lg transition-all duration-300";

const sectionTitle =
  "flex items-center gap-2 text-sm font-semibold text-slate-700 uppercase tracking-wide";

const EditBanner = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  const { selectedBanner, getBannerById, updateBanner, loading } = useBanners();

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

  useEffect(() => {
    if (!id) return;

    (async () => {
      const res = await getBannerById(id);
      const banner = (res as any)?.data || selectedBanner;
      if (!banner) return;

      reset({
        name: banner.name || "",
        title: banner.title || "",
        startFrom: banner.startFrom
          ? new Date(banner.startFrom).toISOString().split("T")[0]
          : "",
        bannerType: banner.bannerType || "home",
        isActive: banner.isActive ?? true,
      });

      setPreview(banner.image?.url || "");
    })();
  }, [id]);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const onSubmit = async (data: FormValues) => {
    if (!id) return;

    const toastId = toast.loading("Updating banner...");

    try {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, String(value));
      });

      if (file) formData.append("image", file);

      await updateBanner(id, formData);

      toast.success("Banner updated successfully", { id: toastId });
      navigate("/dashboard/banners");
    } catch (err: any) {
      toast.error(err?.message || "Update failed", { id: toastId });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-sm">
      {/* HEADER */}
      <Header
        title="Edit Banner"
        description="Update campaign banner with real-time preview"
        actionLabel="Back"
        actionIcon={ArrowLeft}
        onAction={() => navigate("/dashboard/banners")}
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-8 grid grid-cols-1 gap-8 xl:grid-cols-12">
          {/* ================= LEFT ================= */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="xl:col-span-8 space-y-8"
          >
            {/* BASIC INFO */}
            <div className={cardStyle}>
              <h2 className={sectionTitle}>
                <Sparkles size={16} className="text-emerald-500" />
                Banner Details
              </h2>

              <div className="mt-5 grid gap-5">
                <FormField
                  label="Banner Name"
                  icon={ImageIcon}
                  {...register("name", { required: true })}
                  error={errors.name?.message}
                />

                <FormField
                  label="Title"
                  icon={Layers}
                  {...register("title", { required: true })}
                  error={errors.title?.message}
                />

                <FormField
                  label="Start Date"
                  type="date"
                  icon={Calendar}
                  {...register("startFrom", { required: true })}
                />

                <FormField
                  label="Banner Type"
                  icon={Layers}
                  {...register("bannerType")}
                />
              </div>
            </div>

            {/* IMAGE */}
            <div className={cardStyle}>
              <h2 className={sectionTitle}>
                <Upload size={16} className="text-emerald-500" />
                Banner Media
              </h2>

              <div className="mt-5">
                {preview ? (
                  <div className="group relative overflow-hidden rounded-2xl border">
                    <img
                      src={preview}
                      className="h-52 w-full object-cover transition group-hover:scale-[1.02]"
                    />

                    {/* overlay */}
                    <label className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/0 text-white opacity-0 transition group-hover:bg-black/40 group-hover:opacity-100">
                      <div className="rounded-xl bg-white/10 px-4 py-2 backdrop-blur">
                        Change Image
                      </div>
                      <input type="file" hidden onChange={handleImage} />
                    </label>
                  </div>
                ) : (
                  <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 py-12 hover:bg-slate-100">
                    <Upload className="text-slate-500" />
                    <span className="mt-2 text-xs text-slate-500">
                      Click to upload banner image
                    </span>
                    <input type="file" hidden onChange={handleImage} />
                  </label>
                )}
              </div>
            </div>

            {/* STATUS */}
            <div className={cardStyle}>
              <h2 className={sectionTitle}>
                <ToggleLeft size={16} className="text-emerald-500" />
                Visibility
              </h2>

              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <button
                    type="button"
                    onClick={() => field.onChange(!field.value)}
                    className={`mt-5 flex w-full items-center justify-between rounded-2xl border px-6 py-5 transition ${
                      field.value
                        ? "border-emerald-200 bg-emerald-50"
                        : "border-red-200 bg-red-50"
                    }`}
                  >
                    <span className="font-medium">
                      {field.value ? "Active Banner" : "Inactive Banner"}
                    </span>

                    <div
                      className={`relative h-6 w-12 rounded-full transition ${
                        field.value ? "bg-emerald-500" : "bg-red-500"
                      }`}
                    >
                      <div
                        className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${
                          field.value ? "right-1" : "left-1"
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
            <div className="sticky top-6 space-y-6">
              {/* LIVE PREVIEW */}
              <div className="rounded-3xl bg-gradient-to-br from-emerald-500 to-cyan-500 p-8 text-white shadow-lg">
                <p className="text-xs opacity-80">LIVE PREVIEW</p>
                <h3 className="mt-2 text-2xl font-bold leading-snug">
                  {watch("title") || "Banner Title Preview"}
                </h3>
              </div>

              {/* INFO CARD */}
              <div className={cardStyle}>
                <h3 className="mb-4 text-sm font-semibold text-slate-600">
                  Summary
                </h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between rounded-xl bg-slate-50 p-3">
                    <span>Name</span>
                    <span>{watch("name") || "-"}</span>
                  </div>

                  <div className="flex justify-between rounded-xl bg-slate-50 p-3">
                    <span>Type</span>
                    <span>{watch("bannerType")}</span>
                  </div>

                  <div className="flex justify-between rounded-xl bg-slate-50 p-3">
                    <span>Status</span>
                    <span
                      className={
                        watch("isActive") ? "text-emerald-600" : "text-red-500"
                      }
                    >
                      {watch("isActive") ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3 font-medium text-white hover:bg-emerald-700"
                >
                  <Save size={16} />
                  {loading ? "Updating..." : "Update Banner"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </form>
    </div>
  );
};

export default EditBanner;
