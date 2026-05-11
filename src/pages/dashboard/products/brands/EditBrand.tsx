import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm, useFieldArray, Controller } from "react-hook-form";

import { Header } from "@/components/dashbaord/Header";
import { FormField } from "@/components/form/FormInput";
import { SaveButton } from "@/components/common/Action";

import { FiRefreshCw } from "react-icons/fi";
import {
  ArrowLeft,
  Trash2,
  Image as ImageIcon,
  Save,
  Sparkles,
  ImagePlus,
  Layers,
  Plus,
  Tag,
} from "lucide-react";

import { toast } from "sonner";
import { useBrands } from "@/hooks/brand/useBrands";
import { useUpdateBrand } from "@/hooks/brand/useBrandActions";

type ImageType = {
  url: string;
};

type FormValues = {
  name: string;
  images: ImageType[];
  isActive: boolean;
};

const defaultImage = { url: "" };

const cardStyle =
  "rounded-3xl border border-slate-200 bg-white p-7 shadow-sm hover:shadow-lg transition-all duration-300";

const EditBrand = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [files, setFiles] = useState<(File | null)[]>([]);

  const { getBrandById, selectedBrand } = useBrands();
  const { handleUpdateBrand, loading } = useUpdateBrand();

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

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "images",
  });

  // Fetch brand
  useEffect(() => {
    if (id) getBrandById(id);
  }, [id]);

  // Prefill form
  useEffect(() => {
    if (!selectedBrand) return;

    setValue("name", selectedBrand.name);
    setValue("isActive", selectedBrand.isActive);

    if (selectedBrand.images?.length) {
      replace(selectedBrand.images);
      setFiles(new Array(selectedBrand.images.length).fill(null));
    }
  }, [selectedBrand]);

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

  const onSubmit = async (data: FormValues) => {
    if (!id) return;

    try {
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("isActive", String(data.isActive));

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

      toast.success("Brand updated successfully");
      navigate("/dashboard/brands");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update brand");
    }
  };

  return (
    <div className="min-h-screen">
      {/* ================= HEADER ================= */}
      <Header
        title="Edit Brand"
        description="Update your brand details"
        actionLabel="Back"
        actionIcon={ArrowLeft}
        onAction={() => navigate("/dashboard/brands")}
        refreshIcon={FiRefreshCw}
        isRefreshiingShow={false}
      />
      {/* ================= FORM ================= */}
      <div className="mx-auto py-8">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-8 xl:grid-cols-12">
            {/* ================= LEFT SECTION ================= */}
            <div className="space-y-8 xl:col-span-8">
              {/* ================= BRAND DETAILS ================= */}
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
                    <h2 className="text-lg font-semibold">Brand Details</h2>
                    <p className="text-sm text-slate-500">
                      Update your product identity
                    </p>
                  </div>
                </div>

                <FormField
                  label="Brand Name"
                  icon={Tag}
                  placeholder="Enter brand name"
                  {...register("name", {
                    required: "Brand name is required",
                  })}
                  error={errors.name?.message}
                />
              </motion.div>
              {/* ================= BRAND GALLERY ================= */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className={cardStyle}
              >
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="flex p-2 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-50 ring-1 ring-emerald-100 shadow-sm">
                      <ImageIcon className="text-emerald-600" size={18} />
                    </div>

                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">
                        Brand Gallery
                      </h2>
                      <p className="text-sm text-slate-500">
                        Upload high-quality images
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {fields.map((field, index) => {
                    const imageUrl = watch(`images.${index}.url`);
                    const isPrimary = index === 0;

                    return (
                      <div
                        key={field.id}
                        className={`group relative overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                          isPrimary
                            ? "border-emerald-400 ring-2 ring-emerald-100"
                            : "border-slate-200"
                        }`}
                      >
                        {imageUrl ? (
                          <div className="relative">
                            <div className="relative h-56 overflow-hidden">
                              <img
                                src={imageUrl}
                                alt="product"
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />

                              <div className="absolute right-3 top-3 z-50 flex gap-2 opacity-0 transition-all duration-300 group-hover:opacity-100">
                                <button
                                  type="button"
                                  onClick={() => remove(index)}
                                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/90 shadow hover:bg-red-50"
                                >
                                  <Trash2 size={16} className="text-red-500" />
                                </button>

                                <label className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl bg-white/90 shadow hover:bg-emerald-50">
                                  <ImagePlus
                                    size={16}
                                    className="text-emerald-600"
                                  />
                                  <input
                                    type="file"
                                    className="hidden"
                                    onChange={(e) =>
                                      handleImageUpload(e, index)
                                    }
                                  />
                                </label>
                              </div>

                              <div className="absolute left-3 top-3">
                                <span className="rounded-full bg-black/70 px-2.5 py-1 text-xs font-medium text-white">
                                  {index + 1}
                                </span>
                              </div>

                              {isPrimary && (
                                <div className="absolute bottom-3 left-3">
                                  <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-medium text-white shadow">
                                    Primary
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className="border-t bg-slate-50 px-4 py-3">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-slate-500">
                                  Image #{index + 1}
                                </span>
                                <span
                                  className={`font-medium ${
                                    imageUrl
                                      ? "text-emerald-600"
                                      : "text-amber-500"
                                  }`}
                                >
                                  {imageUrl ? "Ready" : "Pending"}
                                </span>
                              </div>

                              <p className="mt-1 text-[11px] text-slate-400">
                                Recommended: 1000×1000px
                              </p>
                            </div>
                          </div>
                        ) : (
                          <label className="flex h-full min-h-[300px] cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-300 bg-gradient-to-b from-slate-50 to-white transition hover:border-emerald-500 hover:bg-emerald-50/40">
                            <div className="rounded-2xl bg-emerald-50 p-4 shadow-sm">
                              <ImagePlus
                                className="text-emerald-600"
                                size={28}
                              />
                            </div>

                            <div className="text-center">
                              <p className="text-sm font-semibold text-slate-700">
                                Upload Image
                              </p>
                              <p className="text-xs text-slate-400">
                                PNG, JPG, WEBP supported
                              </p>
                            </div>

                            <input
                              type="file"
                              className="hidden"
                              onChange={(e) => handleImageUpload(e, index)}
                            />
                          </label>
                        )}
                      </div>
                    );
                  })}

                  <button
                    type="button"
                    onClick={() => append(defaultImage)}
                    className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white transition-all duration-300 hover:border-emerald-500 hover:bg-emerald-50/40 hover:shadow-md"
                  >
                    <div className="rounded-2xl bg-emerald-50 p-4">
                      <Plus className="text-emerald-600" size={28} />
                    </div>

                    <p className="mt-3 text-sm font-semibold text-slate-700">
                      Add Image
                    </p>

                    <p className="text-xs text-slate-400">Expand gallery</p>
                  </button>
                </div>
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
                      Brand Visibility
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
                          {field.value ? "Active Brand" : "Inactive Brand"}
                        </span>
                        <span className="text-xs opacity-70">
                          {field.value
                            ? "Brand will be visible across products"
                            : "Brand will remain hidden from listings"}
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
                      {watch("images.0.url") ? (
                        <>
                          <img
                            src={watch("images.0.url")}
                            alt="brand preview"
                            className="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
                          />

                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                          <div className="absolute left-4 top-4">
                            <span className="rounded-full bg-black/70 px-3 py-1 text-[11px] font-medium text-white backdrop-blur">
                              Primary Logo
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
                        {watch("name") || "Brand Name"}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        This preview shows how your brand will appear inside
                        your product ecosystem.
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
                        <p className="text-xs text-slate-500">Assets</p>
                        <p className="mt-1 text-xl font-bold text-slate-900">
                          {fields.length}
                        </p>
                      </div>
                    </div>

                    {watch("name") && (
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 ring-1 ring-blue-100">
                          Brand Ready
                        </span>

                        {watch("isActive") && (
                          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600 ring-1 ring-emerald-100">
                            Visible
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="border-t border-slate-100 bg-slate-50 px-6 py-5">
                    <SaveButton
                      loading={loading}
                      icon={<Save size={18} />}
                      label="Change Brand"
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

export default EditBrand;
