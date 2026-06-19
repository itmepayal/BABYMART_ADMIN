import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Category name is required")
    .max(100, "Maximum 100 characters"),

  description: z.string().max(1000).optional(),
  categoryType: z.enum([
    "baby-care",
    "diapers",
    "feeding",
    "clothing",
    "toys",
    "health",
    "bath",
    "strollers",
    "maternity",
    "nursery",
    "school",
    "accessories",
  ]),
  parentCategory: z.string().optional().nullable(),
  isFeatured: z.boolean().default(false),
  sortOrder: z.number().min(0).default(0),
  isActive: z.boolean().default(true),
  seoTitle: z.string().max(70).optional(),
  seoDescription: z.string().max(160).optional(),
});

export type CreateCategoryFormData = z.infer<typeof categorySchema>;
export const updateCategorySchema = categorySchema.partial();
export type UpdateCategoryFormData = z.infer<typeof updateCategorySchema>;
