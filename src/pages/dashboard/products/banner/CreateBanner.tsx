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
  Image as ImageIcon,
  Calendar,
  LayoutTemplate,
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
  "rounded-3xl border border-slate-200 bg-white p-7 shadow-sm hover:shadow-lg transition-all duration-300";

const CreateBanner = () => {
  const navigate = useNavigate();

  const [file, setFile] = useState<File | null>(null);

  const { handleCreateBanner, loading } = useCreateBanner();

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
      title: "",
      startFrom: "",
      bannerType: "home",
      isActive: true,
    },
  });

  // ================= IMAGE HANDLER =================
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setValue("bannerType", watch("bannerType"));
    setValue("name", watch("name"));
    setValue("title", watch("title"));
    setValue("startFrom", watch("startFrom"));

    setPreview(URL.createObjectURL(selected));
  };

  const [preview, setPreview] = useState("");

  // ================= SUBMIT =================
  const onSubmit = async (data: FormValues) => {
    if (!file) {
      toast.error("Please upload banner image");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("title", data.title);
      formData.append("startFrom", data.startFrom);
      formData.append("bannerType", data.bannerType);
      formData.append("isActive", String(data.isActive));
      formData.append("image", file);

      await handleCreateBanner(formData);

      toast.success("Banner created successfully");
      navigate("/dashboard/banners");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create banner");
    }
  };

  return (
    <div className="min-h-screen">
      {/* ================= HEADER ================= */}
      <Header
        title="Create Banner"
        description="Add a new banner for promotions and homepage sections"
        actionLabel="Back"
        actionIcon={ArrowLeft}
        onAction={() => navigate("/dashboard/banners")}
        refreshIcon={FiRefreshCw}
        isRefreshiingShow={false}
      />

      {/* ================= FORM ================= */}
      <div className="mx-auto py-8">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-8 xl:grid-cols-12">
            {/* ================= LEFT ================= */}
            <div className="space-y-8 xl:col-span-8">
              {/* ================= BANNER DETAILS ================= */}
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
                    <h2 className="text-lg font-semibold">Banner Details</h2>
                    <p className="text-sm text-slate-500">
                      Create banner identity and metadata
                    </p>
                  </div>
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
              </motion.div>

              {/* ================= IMAGE ================= */}
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
                      Upload promotional banner image
                    </p>
                  </div>
                </div>

                {preview ? (
                  <div className="relative overflow-hidden rounded-2xl border">
                    <img
                      src={preview}
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
                      Upload Banner
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
                        Real-time banner preview
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
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
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
                        {watch("name") || "Banner Name"}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                        <p className="text-xs text-slate-500">Status</p>
                        <p className="mt-1 font-bold text-emerald-600">
                          {watch("isActive") ? "Active" : "Inactive"}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs text-slate-500">Type</p>
                        <p className="mt-1 font-bold text-slate-900 capitalize">
                          {watch("bannerType")}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 bg-slate-50 px-6 py-5">
                    <SaveButton
                      loading={loading}
                      icon={<Save size={18} />}
                      label="Create Banner"
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

export default CreateBanner;
