import { api } from "@/lib/config";

// =========================================
// IMAGE
// =========================================

export interface BrandImage {
  url: string;
  public_id: string;
}

// =========================================
// CATEGORY
// =========================================

export type BrandCategory =
  | "baby-care"
  | "diapers"
  | "feeding"
  | "clothing"
  | "toys"
  | "health"
  | "bath"
  | "strollers"
  | "maternity"
  | "nursery"
  | "school"
  | "accessories";

// =========================================
// BRAND
// =========================================

export interface Brand {
  _id: string;

  name: string;

  slug: string;

  description?: string;

  logo: BrandImage;

  banners?: BrandImage[];

  website?: string;

  category: BrandCategory;

  isFeatured: boolean;

  sortOrder: number;

  isVerified: boolean;

  isActive: boolean;

  isDeleted: boolean;

  deletedAt?: string | null;

  seoTitle?: string;

  seoDescription?: string;

  createdAt: string;

  updatedAt: string;
}

// =========================================
// CREATE BRAND
// =========================================

export interface CreateBrandPayload {
  name: string;
  description?: string;
  website?: string;
  category: BrandCategory;
  isFeatured?: boolean;
  isVerified?: boolean;
  isActive?: boolean;
  sortOrder?: number;
  seoTitle?: string;
  seoDescription?: string;
  logo: File;
  banners?: File[];
}

// =========================================
// UPDATE BRAND
// =========================================

export type UpdateBrandPayload = Partial<CreateBrandPayload>;

// =========================================
// GET ALL PARAMS
// =========================================

export interface GetAllBrandsParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: BrandCategory;
  isActive?: boolean;
  isFeatured?: boolean;
  isVerified?: boolean;
}

// =========================================
// GET ALL RESPONSE
// =========================================

export interface GetAllBrandsResponse {
  success: boolean;
  message: string;

  brands: Brand[];

  total: number;

  page: number;

  pages: number;

  limit: number;
}

// =========================================
// BRAND SERVICE
// =========================================

export const brandService = {
  // =====================================
  // GET ALL
  // =====================================

  async getAllBrands(
    params: GetAllBrandsParams = {},
  ): Promise<GetAllBrandsResponse> {
    const { data } = await api.get("/brands/admin", {
      params,
    });

    return data;
  },

  // =====================================
  // GET BY ID
  // =====================================

  async getBrandById(id: string) {
    const { data } = await api.get(`/brands/${id}`);

    return data;
  },

  // =====================================
  // CREATE
  // =====================================

  async createBrand(payload: CreateBrandPayload) {
    const formData = new FormData();

    formData.append("name", payload.name);

    formData.append("category", payload.category);

    if (payload.description) {
      formData.append("description", payload.description);
    }

    if (payload.website) {
      formData.append("website", payload.website);
    }

    if (payload.seoTitle) {
      formData.append("seoTitle", payload.seoTitle);
    }

    if (payload.seoDescription) {
      formData.append("seoDescription", payload.seoDescription);
    }

    if (payload.sortOrder !== undefined) {
      formData.append("sortOrder", String(payload.sortOrder));
    }

    formData.append("isFeatured", String(payload.isFeatured ?? false));

    formData.append("isVerified", String(payload.isVerified ?? false));

    formData.append("isActive", String(payload.isActive ?? true));

    formData.append("logo", payload.logo);

    payload.banners?.forEach((banner) => {
      formData.append("banners", banner);
    });

    const { data } = await api.post("/brands", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  },

  // =====================================
  // UPDATE
  // =====================================

  async updateBrand(id: string, formData: FormData) {
    const { data } = await api.patch(`/brands/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  },

  // =====================================
  // DELETE
  // =====================================

  async deleteBrand(id: string) {
    const { data } = await api.delete(`/brands/${id}`);

    return data;
  },

  // =====================================
  // BULK DELETE
  // =====================================

  async bulkDeleteBrands(ids: string[]) {
    const { data } = await api.patch("/brands/bulk/delete", {
      ids,
    });

    return data;
  },

  // =====================================
  // BULK RESTORE
  // =====================================

  async bulkRestoreBrands(ids: string[]) {
    const { data } = await api.patch("/brands/bulk/restore", {
      ids,
    });

    return data;
  },

  // =====================================
  // BULK PERMANENT DELETE
  // =====================================

  async bulkPermanentDeleteBrands(ids: string[]) {
    const { data } = await api.delete("/brands/bulk/permanent", {
      data: { ids },
    });

    return data;
  },
};
