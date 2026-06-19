import { api } from "@/lib/config";
import type {
  GetAllUsersResponse,
  GetSellersResponse,
  GetUsersParams,
} from "@/types/user.type";

export const usersServices = {
  getAllUsers: async (
    params: GetUsersParams = {},
  ): Promise<GetAllUsersResponse> => {
    const { page = 1, limit = 5, search = "" } = params;

    const { data } = await api.get("/users", {
      params: { page, limit, search },
    });

    return data;
  },

  getAllSellers: async (
    params: GetUsersParams = {},
  ): Promise<GetSellersResponse> => {
    const { page = 1, limit = 10, search = "" } = params;

    const { data } = await api.get("/users/sellers", {
      params: {
        page,
        limit,
        search,
      },
    });

    return data;
  },

  getUserById: async (userId: string) => {
    const { data } = await api.get(`/users/${userId}`);
    return data;
  },

  createUser: async (payload: any) => {
    const { data } = await api.post("/users", payload);
    return data;
  },

  updateUser: async (userId: string, payload: any) => {
    const { data } = await api.patch(`/users/${userId}`, payload);
    return data;
  },

  deleteUser: async (userId: string) => {
    const { data } = await api.delete(`/users/${userId}`);
    return data;
  },

  toggleBlockUser: async (userId: string) => {
    const { data } = await api.patch(`/users/${userId}/block`);
    return data;
  },

  changeUserRole: async (userId: string, role: string) => {
    const { data } = await api.patch(`/users/${userId}/role`, { role });
    return data;
  },

  restoreUser: async (userId: string) => {
    const { data } = await api.patch(`/users/${userId}/restore`);
    return data;
  },

  bulkPermanentDeleteUsers: async (userIds: string[]) => {
    const { data } = await api.patch("/users/bulk/permanent", { userIds });
    return data;
  },

  bulkDeleteUsers: async (ids: string[]) => {
    const { data } = await api.patch("/users/bulk/delete", { ids });
    return data;
  },

  bulkRestoreUsers: async (userIds: string[]) => {
    const { data } = await api.patch("/users/bulk/restore", { userIds });
    return data;
  },

  changeAvatarUser: async (formData: FormData, userId?: string) => {
    const endpoint = userId ? `/users/avatar/${userId}` : `/users/me/avatar`;

    const { data } = await api.post(endpoint, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return data;
  },

  deleteAvatar: async () => {
    const { data } = await api.delete("/users/me/avatar");
    return data;
  },

  updateMyAccount: async (payload: any) => {
    const { data } = await api.patch("/users/me", payload);
    return data;
  },

  getMyAddresses: async () => {
    const { data } = await api.get("/users/me/addresses");
    return data;
  },

  addAddress: async (payload: any) => {
    const { data } = await api.post("/users/me/addresses", payload);
    return data;
  },

  getSingleAddress: async (addressId: string) => {
    const { data } = await api.get(`/users/me/addresses/${addressId}`);
    return data;
  },

  updateAddress: async (addressId: string, payload: any) => {
    const { data } = await api.patch(
      `/users/me/addresses/${addressId}`,
      payload,
    );
    return data;
  },

  setDefaultAddress: async (addressId: string) => {
    const { data } = await api.patch(
      `/users/me/addresses/${addressId}/default`,
    );
    return data;
  },

  deleteAddress: async (addressId: string) => {
    const { data } = await api.delete(`/users/me/addresses/${addressId}`);
    return data;
  },
};
