import { api } from "@/lib/config";

// ================= TYPES =================
type CreateBrandPayload = {
  name: string;
  images: File[];
  isActive: boolean;
};

type UpdateBrandPayload = Partial<CreateBrandPayload>;

type GetAllBrandsResponse = {
  data: any;
  total: number;
  page: number;
  pages: number;
};

// ================= BRAND SERVICES =================
export const brandService = {
  // ================= GET ALL BRANDS =================
  getAllBrands: async (): Promise<GetAllBrandsResponse> => {
    const { data } = await api.get("/brands");
    return data;
  },

  // ================= GET BRAND BY ID =================
  getBrandById: async (id: string): Promise<any> => {
    const { data } = await api.get(`/brands/${id}`);
    return data;
  },

  // ================= CREATE BRAND =================
  createBrand: async (payload: CreateBrandPayload): Promise<any> => {
    const { data } = await api.post("/brands", payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return data;
  },

  // ================= UPDATE BRAND =================
  updateBrand: async (
    id: string,
    payload: UpdateBrandPayload,
  ): Promise<any> => {
    const { data } = await api.patch(`/brands/${id}`, payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return data;
  },

  // ================= DELETE BRAND =================
  deleteBrand: async (id: string) => {
    const { data } = await api.delete(`/brands/${id}`);
    return data;
  },

  // ================= RESTORE BRAND =================
  restoreBrand: async (id: string) => {
    const { data } = await api.patch(`/brands/restore/${id}`);
    return data;
  },

  // ================= PERMANENT DELETE =================
  permanentDeleteBrand: async (id: string) => {
    const { data } = await api.delete(`/brands/permanent/${id}`);
    return data;
  },
};
