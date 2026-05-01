import { api } from "@/lib/config";

// ================= TYPES =================
export type Brand = {
  _id: string;
  name: string;
  images: { url: string; public_id: string }[];
  isActive: boolean;
  isDeleted?: boolean;
};

type CreateBrandPayload = {
  name: string;
  images: File[];
  isActive: boolean;
};

type UpdateBrandPayload = Partial<CreateBrandPayload>;

type GetAllBrandsParams = {
  page?: number;
  limit?: number;
  search?: string;
};

type GetAllBrandsResponse = {
  success: boolean;
  message: string;
  brands: Brand[];
  total: number;
  page: number;
  pages: number;
};

// ================= BRAND SERVICES =================
export const brandService = {
  // ================= GET ALL =================
  getAllBrands: async (
    params: GetAllBrandsParams = {},
  ): Promise<GetAllBrandsResponse> => {
    const { page = 1, limit = 10, search = "" } = params;
    const { data } = await api.get("/brands", {
      params: { page, limit, search },
    });

    return data;
  },

  // ================= GET BY ID =================
  getBrandById: async (id: string) => {
    const { data } = await api.get(`/brands/${id}`);
    return data;
  },

  // ================= CREATE =================
  createBrand: async (payload: FormData) => {
    const { data } = await api.post("/brands", payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  },

  // ================= UPDATE =================
  updateBrand: async (id: string, payload: UpdateBrandPayload) => {
    const { data } = await api.patch(`/brands/${id}`, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  },

  // ================= SINGLE DELETE =================
  deleteBrand: async (id: string) => {
    const { data } = await api.delete(`/brands/${id}`);
    return data;
  },

  // ================= BULK DELETE =================
  bulkDeleteBrands: async (ids: string[]) => {
    const { data } = await api.patch("/brands/bulk/delete", { ids });
    return data;
  },

  // ================= BULK RESTORE =================
  bulkRestoreBrands: async (ids: string[]) => {
    const { data } = await api.patch("/brands/bulk/restore", { ids });
    return data;
  },

  // ================= BULK PERMANENT DELETE =================
  bulkPermanentDeleteBrands: async (ids: string[]) => {
    const { data } = await api.delete("/brands/bulk/permanent", {
      data: { ids },
    });
    return data;
  },
};
