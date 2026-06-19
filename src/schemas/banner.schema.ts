import { z } from "zod";

export const createBannerSchema = z.object({
  name: z.string().min(2, "Name is required").max(100),
  title: z.string().min(2, "Title is required").max(150),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  bannerType: z.enum([
    "home",
    "offer",
    "category",
    "product",
    "flash-sale",
    "seasonal",
  ]),
  redirectUrl: z.string().url().optional().or(z.literal("")),
  buttonText: z.string().optional(),
  startFrom: z.string().optional(),
  discountPercentage: z.number().min(0).max(100).optional(),
  priority: z.number().min(0).default(0),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export type CreateBannerFormData = z.infer<typeof createBannerSchema>;
export const updateBannerSchema = createBannerSchema.partial();
export type UpdateBannerFormData = z.infer<typeof updateBannerSchema>;
