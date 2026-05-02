import { useState, useEffect } from "react";
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
  Upload,
  Plus,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { useUpdateProduct } from "@/hooks/product/useProductActions";
import { useCategories } from "@/hooks/categories/useCategories";
import { useBrands } from "@/hooks/brand/useBrands";
import { SaveButton } from "@/components/common/Action";
import { useProducts } from "@/hooks/product/useProducts";

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

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [files, setFiles] = useState<File[]>([]);

  const { handleUpdateProduct, loading } = useUpdateProduct();
  const { getProductById } = useProducts();
  const { categories } = useCategories();
  const { brands } = useBrands();

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
      description: "",
      price: 0,
      stock: 0,
      category: "",
      brand: "",
      discountPercentage: 0,
      images: [defaultImage],
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "images",
  });

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await getProductById(id);
        console.log(res.data.name);

        setValue("name", res.data.name);
        setValue("description", res.data.description || "");
        setValue("price", res.data.price);
        setValue("stock", res.data.stock);
        setValue("category", res.data.category?._id || res.data.category);
        setValue("brand", res.data.brand?._id || res.data.brand);
        setValue("discountPercentage", res.data.discountPercentage || 0);

        if (res.data.images?.length) {
          replace(res.data.images.map((img: any) => ({ url: img.url })));
          setFiles(new Array(res.data.images.length).fill(null));
        } else {
          replace([defaultImage]);
        }
      } catch (err) {
        toast.error("Failed to load product");
      }
    };

    fetchProduct();
  }, [id, setValue, replace]);

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
    const hasExistingImages = data.images.some((img) => img.url);

    if (!files.filter(Boolean).length && !hasExistingImages) {
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
      const ProductId = id as string;
      await handleUpdateProduct(ProductId, formData);
      toast.success("Product updated successfully");
      navigate("/dashboard/products");
    } catch (err: any) {
      toast.error(err?.message || "Failed to update product");
    }
  };

  return (
    <div className="min-h-screen">
      <Header
        title="Edit Product"
        description="Update product information, pricing, and media"
        actionLabel="Back"
        actionIcon={ArrowLeft}
        onAction={() => navigate("/dashboard/products")}
        refreshIcon={FiRefreshCw}
        isRefreshiingShow={false}
      />

      <div className="mx-auto py-8">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-8 xl:grid-cols-12">
            {/* LEFT */}
            <div className="space-y-8 xl:col-span-8">
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
                    <p className="mt-1 text-xs text-slate-400">
                      Enter a clear and searchable product name
                    </p>
                  </div>

                  <div>
                    <FormField
                      label="Price"
                      type="number"
                      icon={IndianRupee}
                      placeholder="0"
                      {...register("price", { valueAsNumber: true })}
                    />
                    <p className="mt-1 text-xs text-slate-400">
                      Product selling price in INR
                    </p>
                  </div>

                  <div>
                    <FormField
                      label="Stock"
                      type="number"
                      icon={Boxes}
                      placeholder="0"
                      {...register("stock", { valueAsNumber: true })}
                    />
                    <p className="mt-1 text-xs text-slate-400">
                      Available inventory quantity
                    </p>
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
                    <p className="mt-1 text-xs text-slate-400">
                      Optional discount percentage
                    </p>
                  </div>

                  <div>
                    <Controller
                      name="category"
                      control={control}
                      render={({ field }) => (
                        <select
                          {...field}
                          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none"
                        >
                          <option value="">Select Category</option>
                          {categories?.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      )}
                    />
                    <p className="mt-1 text-xs text-slate-400">
                      Choose product category
                    </p>
                  </div>

                  <div>
                    <Controller
                      name="brand"
                      control={control}
                      render={({ field }) => (
                        <select
                          {...field}
                          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none"
                        >
                          <option value="">Select Brand</option>
                          {brands?.map((brand) => (
                            <option key={brand._id} value={brand._id}>
                              {brand.name}
                            </option>
                          ))}
                        </select>
                      )}
                    />
                    <p className="mt-1 text-xs text-slate-400">
                      Select associated brand
                    </p>
                  </div>
                </div>

                <div className="mt-5">
                  <textarea
                    {...register("description")}
                    rows={5}
                    placeholder="Write product description..."
                    className="w-full rounded-2xl border border-slate-200 p-4 text-sm outline-none focus:border-emerald-500"
                  />
                  <p className="mt-1 text-xs text-slate-400">
                    Include features, specifications, and benefits
                  </p>
                </div>
              </motion.div>

              {/* IMAGES */}
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

                  <SaveButton
                    onClick={() => append(defaultImage)}
                    label="Add Image"
                    icon={<Upload />}
                  />
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {fields.map((field, index) => {
                    const imageUrl = watch(`images.${index}.url`);
                    const isPrimary = index === 0;

                    return (
                      <div
                        key={field.id}
                        className={`group relative overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
                          isPrimary
                            ? "border-emerald-300 ring-2 ring-emerald-100"
                            : "border-slate-200"
                        }`}
                      >
                        {imageUrl ? (
                          <div className="relative h-56 overflow-hidden">
                            <img
                              src={imageUrl}
                              alt="product"
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />

                            <div className="absolute right-3 top-3 z-50 flex gap-2 opacity-0 transition group-hover:opacity-100">
                              <button
                                type="button"
                                onClick={() => remove(index)}
                                className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/80 backdrop-blur-md shadow-md hover:bg-red-50"
                              >
                                <Trash2 size={16} className="text-red-500" />
                              </button>

                              <label className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl bg-white/80 backdrop-blur-md shadow-md hover:bg-emerald-50">
                                <ImagePlus
                                  size={16}
                                  className="text-emerald-600"
                                />
                                <input
                                  type="file"
                                  className="hidden"
                                  onChange={(e) => handleImageUpload(e, index)}
                                />
                              </label>
                            </div>

                            <div className="absolute left-3 top-3">
                              <span className="rounded-full bg-black/60 px-2 py-1 text-xs text-white">
                                {index + 1}
                              </span>
                            </div>

                            {isPrimary && (
                              <div className="absolute bottom-3 left-3">
                                <span className="rounded-full bg-emerald-600 px-2 py-1 text-xs text-white shadow">
                                  Primary
                                </span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <label className="flex h-56 cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-300 bg-gradient-to-b from-slate-50 to-white transition hover:border-emerald-500 hover:bg-emerald-50/40">
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

                        <div className="px-3 py-2">
                          <div className="flex items-center justify-between text-xs text-slate-500">
                            <span>Image #{index + 1}</span>
                            <span className="font-medium text-emerald-600">
                              {imageUrl ? "Ready" : "Pending"}
                            </span>
                          </div>

                          <p className="mt-1 text-[11px] text-slate-400">
                            Recommended: 1000×1000px, square format
                          </p>
                        </div>
                      </div>
                    );
                  })}

                  <button
                    type="button"
                    onClick={() => append(defaultImage)}
                    className="flex h-56 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white transition hover:border-emerald-500 hover:bg-emerald-50/40"
                  >
                    <div className="rounded-2xl bg-emerald-50 p-4">
                      <Plus className="text-emerald-600" size={28} />
                    </div>

                    <p className="mt-2 text-sm font-semibold text-slate-700">
                      Add Image
                    </p>

                    <p className="text-xs text-slate-400">Expand gallery</p>
                  </button>
                </div>
              </motion.div>
            </div>

            {/* ================= RIGHT SIDEBAR ================= */}
            <div className="xl:col-span-4">
              <div className="sticky top-6 space-y-6">
                <div className="rounded-3xl border border-slate-200/70 bg-white shadow-xl shadow-slate-100/60 backdrop-blur">
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
                  <div className="px-6 pt-6">
                    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                      {watch("images.0.url") ? (
                        <>
                          <img
                            src={watch("images.0.url")}
                            className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                          <div className="absolute left-3 top-3">
                            <span className="rounded-full bg-black/60 px-3 py-1 text-[11px] font-medium text-white backdrop-blur">
                              Primary Image
                            </span>
                          </div>
                          <div className="absolute bottom-3 right-3 text-[10px] text-white/80">
                            Hover to zoom
                          </div>
                        </>
                      ) : (
                        <div className="flex h-64 flex-col items-center justify-center gap-2 text-slate-400">
                          <ImageIcon size={44} />
                          <p className="text-xs">No image uploaded</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-5 px-6 py-6">
                    <div>
                      <h3 className="text-xl font-semibold tracking-tight text-slate-900">
                        {watch("name") || "Product Name"}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                        {watch("description") || "No description added yet"}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-4">
                        <p className="text-[11px] text-slate-500">Price</p>
                        <p className="text-lg font-bold text-emerald-600">
                          ₹ {watch("price") || 0}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-[11px] text-slate-500">Stock</p>
                        <p className="text-lg font-bold text-slate-900">
                          {watch("stock") || 0}
                        </p>
                      </div>
                    </div>
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
                    <div className="pt-2">
                      <SaveButton
                        loading={loading}
                        icon={<Save />}
                        label="Update Product"
                      />
                    </div>
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
