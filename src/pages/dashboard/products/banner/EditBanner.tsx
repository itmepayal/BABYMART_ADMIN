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
  Image as ImageIcon,
  Layers,
  ImagePlus,
  Camera,
  Trash2,
  Calendar,
  LayoutTemplate,
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
  "rounded-3xl border border-slate-200 bg-white p-7 shadow-sm hover:shadow-md transition-all duration-300";

const EditBanner = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

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

  // ================= FETCH BANNER =================
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

  // ================= IMAGE UPLOAD =================
  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleRemoveImage = () => {
    setFile(null);
    setPreview("");
  };

  // ================= SUBMIT =================
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

      toast.success("Banner updated successfully", {
        id: toastId,
      });

      navigate("/dashboard/banners");
    } catch (error: any) {
      toast.error(error?.message || "Failed to update banner", {
        id: toastId,
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-sm">
      {/* HEADER */}
      <Header
        title="Edit Banner"
        description="Update banner information"
        actionLabel="Back"
        actionIcon={ArrowLeft}
        onAction={() => navigate("/dashboard/banners")}
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
                <div className="rounded-xl bg-emerald-50 p-2">
                  <Sparkles className="text-emerald-600" size={18} />
                </div>
                <h2 className="text-lg font-semibold">Banner Details</h2>
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <FormField
                    label="Banner Name"
                    icon={LayoutTemplate}
                    placeholder="Enter banner name"
                    {...register("name", {
                      required: "Banner name is required",
                    })}
                    error={errors.name?.message}
                  />

                  <FormField
                    label="Banner Title"
                    icon={Layers}
                    placeholder="Enter banner title"
                    {...register("title", {
                      required: "Banner title is required",
                    })}
                    error={errors.title?.message}
                  />
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <FormField
                    label="Start From"
                    type="date"
                    icon={Calendar}
                    {...register("startFrom", {
                      required: "Start date is required",
                    })}
                    error={errors.startFrom?.message}
                  />

                  <FormField
                    label="Banner Type"
                    icon={Layers}
                    placeholder="Enter banner type"
                    {...register("bannerType")}
                  />
                </div>
              </div>
            </div>

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
                  <h2 className="text-lg font-semibold">Banner Image</h2>
                  <p className="text-sm text-slate-500">
                    Upload high-quality banner image
                  </p>
                </div>
              </div>

              {preview ? (
                <div className="relative overflow-hidden rounded-2xl border border-slate-200">
                  <img
                    src={preview}
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
                        onChange={handleImage}
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
                    onChange={handleImage}
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
                    Banner Visibility
                  </h2>
                  <p className="text-sm text-slate-500">
                    Control whether this banner is visible
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
                        {field.value ? "Active Banner" : "Inactive Banner"}
                      </span>

                      <span className="text-xs opacity-70">
                        {field.value
                          ? "Banner visible across website"
                          : "Banner hidden from users"}
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

          {/* RIGHT SIDEBAR */}
          <div className="xl:col-span-4">
            <div className="sticky top-6">
              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-100">
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      Live Preview
                    </h2>
                    <p className="text-xs text-slate-500">
                      Real-time banner representation
                    </p>
                  </div>
                </div>

                <div className="p-6 pb-0">
                  <div className="overflow-hidden rounded-2xl border border-slate-200">
                    {preview ? (
                      <img
                        src={preview}
                        alt="preview"
                        className="h-72 w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-72 items-center justify-center text-slate-400">
                        <ImageIcon size={40} />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-6 p-6">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">
                      {watch("title") || "Banner Title"}
                    </h3>

                    <p className="mt-2 text-sm text-slate-500">
                      Preview of how your banner will appear.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                      <p className="text-xs text-slate-500">Status</p>
                      <p className="mt-1 text-xl font-bold text-emerald-600">
                        {watch("isActive") ? "Active" : "Inactive"}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs text-slate-500">Type</p>
                      <p className="mt-1 text-lg font-bold text-slate-900">
                        {watch("bannerType")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 bg-slate-50 px-6 py-5">
                  <SaveButton
                    loading={loading}
                    icon={<Save size={18} />}
                    label="Update Banner"
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

export default EditBanner;
