import { z } from "zod";

// =========================================
// OBJECT ID VALIDATOR
// =========================================
const objectId = z
  .string()
  .min(1, "Product is required")
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid product selected");

// =========================================
// ORDER ITEM SCHEMA
// =========================================
export const orderItemSchema = z.object({
  productId: objectId,

  quantity: z.coerce
    .number({
      error: "Quantity is required",
    })
    .min(1, "Quantity must be at least 1")
    .max(100, "Quantity cannot exceed 100"),
});

// =========================================
// SHIPPING ADDRESS SCHEMA
// =========================================
export const shippingAddressSchema = z.object({
  street: z
    .string()
    .trim()
    .min(2, "Street is required")
    .max(200, "Street is too long"),

  city: z
    .string()
    .trim()
    .min(2, "City is required")
    .max(100, "City name is too long"),

  state: z
    .string()
    .trim()
    .min(2, "State is required")
    .max(100, "State name is too long"),

  country: z
    .string()
    .trim()
    .min(2, "Country is required")
    .max(100, "Country name is too long"),

  postalCode: z
    .string()
    .trim()
    .min(4, "Postal code is required")
    .max(12, "Invalid postal code"),

  phone: z
    .string()
    .trim()
    .regex(/^[0-9]{10,15}$/, "Invalid phone number")
    .optional()
    .or(z.literal("")),
});

// =========================================
// PAYMENT METHOD ENUM
// =========================================
// export const paymentMethodSchema = z.enum(["cod", "stripe", "razorpay"], {
//   required_error: "Payment method is required",
// });

// =========================================
// CREATE ORDER SCHEMA
// =========================================
export const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1, "At least one product is required"),

  shippingAddress: shippingAddressSchema,

  paymentMethod: z.string(),
});

// =========================================
// UPDATE ORDER SCHEMA
// =========================================
export const updateOrderSchema = z.object({
  status: z
    .enum(["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"])
    .optional(),

  paymentStatus: z.enum(["PENDING", "PAID", "FAILED", "REFUNDED"]).optional(),

  paymentIntentId: z.string().optional(),

  razorpayOrderId: z.string().optional(),
});

// =========================================
// TYPES
// =========================================
export type OrderItemDTO = z.infer<typeof orderItemSchema>;

export type ShippingAddressDTO = z.infer<typeof shippingAddressSchema>;

export type CreateOrderDTO = z.infer<typeof createOrderSchema>;

export type UpdateOrderDTO = z.infer<typeof updateOrderSchema>;
