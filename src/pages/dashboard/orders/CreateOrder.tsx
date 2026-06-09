import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Header } from "@/components/dashbaord/Header";
import { FormField } from "@/components/form/FormInput";
import { SelectField } from "@/components/form/FormSelect";
import { SaveButton } from "@/components/common/Action";

import { useProducts } from "@/hooks/product/useProducts";
import { useCreateOrder } from "@/hooks/orders/useOrderAction";

import {
  createOrderSchema,
  type CreateOrderDTO,
} from "@/validations/order.validation";

import { toast } from "sonner";

import { FiRefreshCw } from "react-icons/fi";

import {
  ArrowLeft,
  Plus,
  Trash2,
  ShoppingCart,
  Package,
  MapPin,
  CreditCard,
  Save,
  IndianRupee,
} from "lucide-react";

// =========================================
// TYPES
// =========================================
type FormValues = CreateOrderDTO;

// =========================================
// STYLES
// =========================================
const cardStyle =
  "rounded-3xl border border-slate-200 bg-white p-7 shadow-sm hover:shadow-lg transition-all duration-300";

// =========================================
// COMPONENT
// =========================================
const CreateOrder = () => {
  const navigate = useNavigate();

  // =========================================
  // HOOKS
  // =========================================
  const { products = [] } = useProducts();

  const { handleCreateOrder, loading } = useCreateOrder();

  // =========================================
  // FORM
  // =========================================
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(createOrderSchema as any),
    defaultValues: {
      items: [
        {
          productId: "",
          quantity: 1,
        },
      ],

      shippingAddress: {
        street: "",
        city: "",
        state: "",
        country: "India",
        postalCode: "",
        phone: "",
      },

      paymentMethod: "cod",
    },
  });

  // =========================================
  // FIELD ARRAY
  // =========================================
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  // =========================================
  // WATCHERS
  // =========================================
  const items = watch("items");

  // =========================================
  // TOTAL
  // =========================================
  const totalAmount = useMemo(() => {
    return items.reduce((acc, item) => {
      const product = products.find((p: any) => p._id === item.productId);

      if (!product) return acc;

      return acc + product.price * item.quantity;
    }, 0);
  }, [items, products]);

  // =========================================
  // SUBMIT
  // =========================================
  const onSubmit = async (data: FormValues) => {
    try {
      await handleCreateOrder(data as any);
      toast.success("Order created successfully");
      navigate("/dashboard/orders");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to create order");
    }
  };

  return (
    <div className="min-h-screen">
      {/* ========================================= */}
      {/* HEADER */}
      {/* ========================================= */}
      <Header
        title="Create Order"
        description="Create a new customer order"
        actionLabel="Back"
        actionIcon={ArrowLeft}
        onAction={() => navigate("/dashboard/orders")}
        refreshIcon={FiRefreshCw}
        isRefreshiingShow={false}
      />

      {/* ========================================= */}
      {/* FORM */}
      {/* ========================================= */}
      <div className="mx-auto py-8">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-8 xl:grid-cols-12">
            {/* ========================================= */}
            {/* LEFT */}
            {/* ========================================= */}
            <div className="space-y-8 xl:col-span-8">
              {/* ========================================= */}
              {/* ORDER ITEMS */}
              {/* ========================================= */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className={cardStyle}
              >
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-xl bg-emerald-50 p-2">
                    <ShoppingCart className="text-emerald-600" size={18} />
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold">Order Items</h2>

                    <p className="text-sm text-slate-500">
                      Add products to the order
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  {fields.map((field, index) => {
                    const selectedProduct = products.find(
                      (p: any) => p._id === watch(`items.${index}.productId`),
                    );

                    return (
                      <div
                        key={field.id}
                        className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
                      >
                        {/* TOP */}
                        <div className="grid gap-5 p-5 md:grid-cols-2">
                          {/* PRODUCT */}
                          <Controller
                            control={control}
                            name={`items.${index}.productId`}
                            render={({ field }) => (
                              <SelectField
                                {...field}
                                label="Product"
                                icon={Package}
                                placeholder="Select product"
                                error={
                                  errors.items?.[index]?.productId?.message
                                }
                                options={products.map((product: any) => ({
                                  label: `${product.name} - ₹${product.price}`,
                                  value: product._id,
                                }))}
                              />
                            )}
                          />

                          {/* QUANTITY */}
                          <FormField
                            label="Quantity"
                            type="number"
                            icon={Package}
                            placeholder="1"
                            {...register(`items.${index}.quantity`, {
                              valueAsNumber: true,
                            })}
                            error={errors.items?.[index]?.quantity?.message}
                          />
                        </div>

                        {/* PRODUCT PREVIEW */}
                        {selectedProduct && (
                          <div className="border-t border-slate-100 bg-slate-50 p-5">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                              {/* IMAGE */}
                              <div className="relative h-28 w-28 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                                <img
                                  src={
                                    selectedProduct?.images?.[0]?.url ||
                                    "/placeholder.png"
                                  }
                                  alt={selectedProduct.name}
                                  className="h-full w-full object-cover transition duration-500 hover:scale-105"
                                />

                                <div className="absolute left-2 top-2 rounded-full bg-black/70 px-2 py-1 text-[10px] font-medium text-white">
                                  Preview
                                </div>
                              </div>

                              {/* INFO */}
                              <div className="flex-1">
                                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                  <div>
                                    <h3 className="text-lg font-semibold text-slate-900">
                                      {selectedProduct.name}
                                    </h3>

                                    <p className="mt-1 text-sm text-slate-500 line-clamp-2">
                                      {selectedProduct.description ||
                                        "No description available"}
                                    </p>

                                    <div className="mt-3 flex flex-wrap gap-2">
                                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600">
                                        ₹{selectedProduct.price} each
                                      </span>

                                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                                        Stock: {selectedProduct.stock || 0}
                                      </span>
                                    </div>
                                  </div>

                                  {/* PRICE */}
                                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-4 text-center">
                                    <p className="text-xs uppercase tracking-wide text-slate-500">
                                      Subtotal
                                    </p>

                                    <p className="mt-1 text-2xl font-bold text-emerald-600">
                                      ₹
                                      {selectedProduct.price *
                                        (watch(`items.${index}.quantity`) || 1)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* REMOVE */}
                        {fields.length > 1 && (
                          <div className="border-t border-slate-100 bg-white px-5 py-4">
                            <div className="flex justify-end">
                              <button
                                type="button"
                                onClick={() => remove(index)}
                                className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
                              >
                                <Trash2 size={16} />
                                Remove Product
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* ADD ITEM */}
                  <button
                    type="button"
                    onClick={() =>
                      append({
                        productId: "",
                        quantity: 1,
                      })
                    }
                    className="flex w-full items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-slate-300 bg-white py-6 text-sm font-semibold text-slate-600 transition-all duration-300 hover:border-emerald-500 hover:bg-emerald-50"
                  >
                    <Plus size={18} />
                    Add Another Product
                  </button>
                </div>
              </motion.div>

              {/* ========================================= */}
              {/* SHIPPING ADDRESS */}
              {/* ========================================= */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className={cardStyle}
              >
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-xl bg-blue-50 p-2">
                    <MapPin className="text-blue-600" size={18} />
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold">Shipping Address</h2>

                    <p className="text-sm text-slate-500">
                      Enter delivery information
                    </p>
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <FormField
                    label="Street"
                    placeholder="Street address"
                    {...register("shippingAddress.street")}
                    error={errors.shippingAddress?.street?.message}
                  />

                  <FormField
                    label="City"
                    placeholder="City"
                    {...register("shippingAddress.city")}
                    error={errors.shippingAddress?.city?.message}
                  />

                  <FormField
                    label="State"
                    placeholder="State"
                    {...register("shippingAddress.state")}
                    error={errors.shippingAddress?.state?.message}
                  />

                  <FormField
                    label="Country"
                    placeholder="Country"
                    {...register("shippingAddress.country")}
                    error={errors.shippingAddress?.country?.message}
                  />

                  <FormField
                    label="Postal Code"
                    placeholder="Postal code"
                    {...register("shippingAddress.postalCode")}
                    error={errors.shippingAddress?.postalCode?.message}
                  />

                  <FormField
                    label="Phone"
                    placeholder="Phone number"
                    {...register("shippingAddress.phone")}
                    error={errors.shippingAddress?.phone?.message}
                  />
                </div>
              </motion.div>

              {/* ========================================= */}
              {/* PAYMENT */}
              {/* ========================================= */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className={cardStyle}
              >
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-xl bg-purple-50 p-2">
                    <CreditCard className="text-purple-600" size={18} />
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold">Payment Method</h2>

                    <p className="text-sm text-slate-500">
                      Select payment option
                    </p>
                  </div>
                </div>

                <Controller
                  control={control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <SelectField
                      {...field}
                      label="Payment Method"
                      icon={CreditCard}
                      placeholder="Select payment method"
                      options={[
                        {
                          label: "Cash On Delivery",
                          value: "cod",
                        },
                        {
                          label: "Stripe",
                          value: "stripe",
                        },
                        {
                          label: "Razorpay",
                          value: "razorpay",
                        },
                      ]}
                    />
                  )}
                />
              </motion.div>
            </div>

            {/* ========================================= */}
            {/* RIGHT SIDEBAR */}
            {/* ========================================= */}
            <div className="xl:col-span-4">
              <div className="sticky top-6">
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-100">
                  {/* HEADER */}
                  <div className="border-b border-slate-100 px-6 py-5">
                    <h2 className="text-lg font-semibold text-slate-900">
                      Order Summary
                    </h2>

                    <p className="text-xs text-slate-500">Live order preview</p>
                  </div>

                  {/* CONTENT */}
                  <div className="space-y-5 p-6">
                    {/* ITEMS */}
                    <div className="space-y-3">
                      {items.map((item, index) => {
                        const product = products.find(
                          (p: any) => p._id === item.productId,
                        );

                        if (!product) return null;

                        return (
                          <div
                            key={index}
                            className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4"
                          >
                            <div>
                              <p className="text-sm font-medium text-slate-900">
                                {product.name}
                              </p>

                              <p className="text-xs text-slate-500">
                                Qty: {item.quantity}
                              </p>
                            </div>

                            <p className="font-semibold text-emerald-600">
                              ₹{product.price * item.quantity}
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    {/* TOTAL */}
                    <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
                          <IndianRupee size={16} />
                          Total Amount
                        </span>

                        <span className="text-2xl font-bold text-emerald-600">
                          ₹{totalAmount}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* FOOTER */}
                  <div className="border-t border-slate-100 bg-slate-50 px-6 py-5">
                    <SaveButton
                      loading={loading}
                      icon={<Save size={18} />}
                      label="Create Order"
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

export default CreateOrder;
