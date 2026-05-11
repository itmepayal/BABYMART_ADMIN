import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm, useFieldArray, Controller } from "react-hook-form";

import { Header } from "@/components/dashbaord/Header";
import { FormField } from "@/components/form/FormInput";

import { FiRefreshCw } from "react-icons/fi";
import {
  ArrowLeft,
  Trash2,
  Image as ImageIcon,
  Save,
  Sparkles,
  ImagePlus,
  Tag,
  Boxes,
  Package,
  IndianRupee,
  Image,
  Plus,
} from "lucide-react";

import { toast } from "sonner";
import { useCreateProduct } from "@/hooks/product/useProductActions";
import { useCategories } from "@/hooks/categories/useCategories";
import { useBrands } from "@/hooks/brand/useBrands";
import { SaveButton } from "@/components/common/Action";
import {
  createProductSchema,
  type CreateProductFormData,
} from "@/validations/product.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { SelectField } from "@/components/form/FormSelect";
import TextEditor from "@/components/form/FromTextEditor";

type ImageType = { url: string };

type FormValues = {
  name: string;
  description?: string;
  price: number;
  stock: number;
  category: string;
  brand: string;
  discountPercentage?: number;
  images: ImageType[];
};

const defaultImage = { url: "" };

const cardStyle =
  "rounded-3xl border border-slate-200 bg-white p-7 shadow-sm hover:shadow-lg transition-all duration-300";

export default function CreateProduct() {
  const navigate = useNavigate();
  const [files, setFiles] = useState<File[]>([]);

  const { handleCreateProduct, loading } = useCreateProduct();
  const { categories } = useCategories();
  const { brands } = useBrands();

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateProductFormData>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      stock: 0,
      category: "",
      brand: "",
      discountPercentage: 0,
      images: [{ url: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "images",
  });

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
    if (!files.filter(Boolean).length) {
      toast.error("Please upload at least one product image");
      return;
    }

    try {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (key !== "images") {
          formData.append(key, String(value ?? ""));
        }
      });

      files.forEach((file) => {
        if (file) formData.append("images", file);
      });

      await handleCreateProduct(formData);
      toast.success("Product created successfully");
      navigate("/dashboard/products");
    } catch (err: any) {
      toast.error(err.response.data.message || "Failed to create product");
    }
  };

  return (
    <div className="min-h-screen">
      {/* ================= HEADER ================= */}
      <Header
        title="Create Product"
        description="Add a new product to your catalog"
        actionLabel="Back"
        actionIcon={ArrowLeft}
        onAction={() => navigate("/dashboard/products")}
        refreshIcon={FiRefreshCw}
        isRefreshiingShow={false}
      />
      {/* ================= FORMS ================= */}
      <div className="mx-auto py-8">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-8 xl:grid-cols-12">
            <div className="space-y-8 xl:col-span-8">
              {/* ================= PRODUCT DETAILS ================= */}
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
                    <h2 className="text-lg font-semibold">Product Details</h2>
                    <p className="text-sm text-slate-500">
                      Fill product information carefully
                    </p>
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <FormField
                      label="Product Name"
                      icon={Package}
                      placeholder="Enter product name"
                      {...register("name", { required: "Name is required" })}
                      error={errors.name?.message}
                    />
                  </div>

                  <div>
                    <FormField
                      label="Price"
                      type="number"
                      icon={IndianRupee}
                      placeholder="0"
                      {...register("price", { valueAsNumber: true })}
                    />
                  </div>

                  <div>
                    <FormField
                      label="Stock"
                      type="number"
                      icon={Boxes}
                      placeholder="0"
                      {...register("stock", { valueAsNumber: true })}
                    />
                  </div>

                  <div>
                    <FormField
                      label="Discount %"
                      type="number"
                      icon={Tag}
                      placeholder="0"
                      {...register("discountPercentage", {
                        valueAsNumber: true,
                      })}
                    />
                  </div>

                  <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                      <SelectField
                        {...field}
                        label="Category"
                        icon={Tag}
                        error={errors.category?.message}
                        options={categories.map((cat) => ({
                          label: cat.name,
                          value: cat._id,
                        }))}
                        placeholder="Select category"
                      />
                    )}
                  />

                  <Controller
                    name="brand"
                    control={control}
                    render={({ field }) => (
                      <SelectField
                        {...field}
                        label="Brand"
                        icon={Package}
                        error={errors.brand?.message}
                        options={brands.map((brand) => ({
                          label: brand.name,
                          value: brand._id,
                        }))}
                        placeholder="Select brand"
                      />
                    )}
                  />
                </div>
                <div className="mt-5">
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <TextEditor
                        value={field.value || ""}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>
              </motion.div>
              {/* ================= PRODUCT GALLERY ================= */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className={cardStyle}
              >
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="flex p-2 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-50 ring-1 ring-emerald-100 shadow-sm">
                      <Image className="text-emerald-600" size={18} />
                    </div>

                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">
                        Product Gallery
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
                        Real-time product representation
                      </p>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600 ring-1 ring-emerald-100">
                      Draft
                    </span>
                  </div>
                  <div className="p-6 pb-0">
                    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                      {watch("images.0.url") ? (
                        <>
                          <img
                            src={watch("images.0.url")}
                            alt="product preview"
                            className="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                          <div className="absolute left-4 top-4">
                            <span className="rounded-full bg-black/70 px-3 py-1 text-[11px] font-medium text-white backdrop-blur">
                              Primary Image
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
                      <h3 className="text-2xl font-bold tracking-tight text-slate-900">
                        {watch("name") || "Product Name"}
                      </h3>
                      <div
                        className="mt-2 min-h-[40px] text-sm leading-6 text-slate-500 prose prose-sm max-w-none line-clamp-3"
                        dangerouslySetInnerHTML={{
                          __html:
                            watch("description") ||
                            "<p>No description added yet</p>",
                        }}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-4">
                        <p className="text-xs text-slate-500">Price</p>
                        <p className="mt-1 text-2xl font-bold text-emerald-600">
                          ₹ {watch("price") || 0}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs text-slate-500">Stock</p>
                        <p className="mt-1 text-2xl font-bold text-slate-900">
                          {watch("stock") || 0}
                        </p>
                      </div>
                    </div>
                    {(watch("category") || watch("brand")) && (
                      <div className="flex flex-wrap gap-2">
                        {watch("category") && (
                          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 ring-1 ring-blue-100">
                            Category Selected
                          </span>
                        )}

                        {watch("brand") && (
                          <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-600 ring-1 ring-purple-100">
                            Brand Selected
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="border-t border-slate-100 bg-slate-50 px-6 py-5">
                    <SaveButton
                      loading={loading}
                      icon={<Save size={18} />}
                      label="Create Product"
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
}
