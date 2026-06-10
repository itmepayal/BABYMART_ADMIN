import { z } from "zod";

/* =========================================================
   IMAGE SCHEMA
========================================================= */

export const imageSchema = z.object({
  _id: z.string().optional(),
  public_id: z.string().optional(),
  url: z.string().min(1, "Image is required"),
});

/* =========================================================
   CREATE PRODUCT SCHEMA
========================================================= */

export const createProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Product name must be at least 2 characters")
    .max(200, "Product name cannot exceed 200 characters"),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters"),
  shortDescription: z
    .string()
    .trim()
    .max(300, "Short description cannot exceed 300 characters")
    .or(z.literal("")),
  category: z.string().min(1, "Category is required"),
  brand: z.string().min(1, "Brand is required"),
  sellerId: z.string(),
  price: z.number().min(0, "Price cannot be negative"),
  discountPercentage: z
    .number()
    .min(0, "Discount cannot be negative")
    .max(100, "Discount cannot exceed 100"),
  tags: z.array(z.string()),
  isFeatured: z.boolean(),
  isActive: z.boolean(),
  images: z.array(imageSchema).min(1, "At least one image is required"),
});

/* =========================================================
   EDIT PRODUCT SCHEMA
========================================================= */

export const editProductSchema = createProductSchema.partial().extend({
  images: z
    .array(imageSchema)
    .min(1, "At least one image is required")
    .optional(),
});

/* =========================================================
   TYPES
========================================================= */

export type CreateProductFormData = z.infer<typeof createProductSchema>;
export type EditProductFormData = z.infer<typeof editProductSchema>;
