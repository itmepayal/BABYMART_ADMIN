import { z } from "zod";

export const brandSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Brand name is required")
    .max(100, "Maximum 100 characters"),
  description: z.string().max(1000).optional(),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
  category: z.enum([
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
  isFeatured: z.boolean().default(false),
  isVerified: z.boolean().default(false),
  isActive: z.boolean().default(true),
  sortOrder: z.number().min(0).default(0),
  seoTitle: z.string().max(70).optional(),
  seoDescription: z.string().max(160).optional(),
});

export type CreateBrandFormData = z.infer<typeof brandSchema>;
export const updateBrandSchema = brandSchema.partial();
export type UpdateBrandFormData = z.infer<typeof updateBrandSchema>;
