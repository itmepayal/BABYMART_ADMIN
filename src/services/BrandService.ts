import { api } from "@/lib/config";
import type {
  CreateBrandPayload,
  GetAllBrandsParams,
  BrandPaginationData,
  UpdateBrandPayload,
} from "@/types/brand.type";

export const brandService = {
  async getAllBrands(
    params: GetAllBrandsParams = {},
  ): Promise<BrandPaginationData> {
    const { data } = await api.get("/brands/admin", {
      params,
    });
    return data;
  },

  async getBrandById(id: string) {
    const { data } = await api.get(`/brands/${id}`);
    return data;
  },

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

  async updateBrand(id: string, formData: UpdateBrandPayload) {
    const { data } = await api.patch(`/brands/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  },

  async deleteBrand(id: string) {
    const { data } = await api.delete(`/brands/${id}`);
    return data;
  },

  async bulkDeleteBrands(ids: string[]) {
    const { data } = await api.patch("/brands/bulk/delete", {
      ids,
    });
    return data;
  },

  async bulkRestoreBrands(ids: string[]) {
    const { data } = await api.patch("/brands/bulk/restore", {
      ids,
    });
    return data;
  },

  async bulkPermanentDeleteBrands(ids: string[]) {
    const { data } = await api.delete("/brands/bulk/permanent", {
      data: { ids },
    });
    return data;
  },
};
