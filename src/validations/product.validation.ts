import { z } from "zod";

/* =========================================================
    IMAGE SCHEMA
========================================================= */

export const imageSchema = z.object({
  _id: z.string().optional(),

  url: z.string().min(1, "Image is required"),
});

/* =========================================================
    CREATE PRODUCT SCHEMA
========================================================= */
export const createProductSchema = z.object({
  name: z
    .string()
    .min(3, "Product name must be at least 3 characters")
    .max(100, "Product name too long"),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description too long")
    .optional()
    .or(z.literal("")),

  price: z
    .number({
      error: "Price must be a valid number",
    })
    .min(1, "Price must be greater than 0"),

  stock: z
    .number({
      error: "Stock must be a valid number",
    })
    .min(0, "Stock cannot be negative"),

  category: z.string().min(1, "Category is required"),

  brand: z.string().min(1, "Brand is required"),

  discountPercentage: z
    .number()
    .min(0, "Discount cannot be negative")
    .max(100, "Discount cannot exceed 100")
    .optional(),

  images: z.array(imageSchema).min(1, "At least one image is required"),
});

/* =========================================================
    EDIT PRODUCT SCHEMA
========================================================= */
export const editProductSchema = createProductSchema.extend({
  images: z
    .array(
      z.object({
        _id: z.string().optional(),

        url: z.string().min(1, "Image is required"),
      }),
    )
    .min(1, "At least one image is required"),
});

/* =========================================================
    TYPES
========================================================= */
export type CreateProductFormData = z.infer<typeof createProductSchema>;
export type EditProductFormData = z.infer<typeof editProductSchema>;
