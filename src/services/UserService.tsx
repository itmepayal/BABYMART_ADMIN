import { api } from "@/lib/config";
import type { GetAllUsersResponse, GetUsersParams } from "@/types/users";

export const usersServices = {
  // ================= USERS LIST =================
  getAllUsers: async (
    params: GetUsersParams = {},
  ): Promise<GetAllUsersResponse> => {
    const { page = 1, limit = 5, search = "" } = params;

    const { data } = await api.get("/users", {
      params: { page, limit, search },
    });

    return data;
  },

  // ================= GET USER BY ID =================
  getUserById: async (userId: string) => {
    const { data } = await api.get(`/users/${userId}`);
    return data;
  },

  // ================= CREATE USER  =================
  createUser: async (payload: any) => {
    const { data } = await api.post("/users", payload);
    return data;
  },

  // ================= UPDATE USER =================
  updateUser: async (userId: string, payload: any) => {
    const { data } = await api.patch(`/users/${userId}`, payload);
    return data;
  },

  // ================= DELETE USER =================
  deleteUser: async (userId: string) => {
    const { data } = await api.delete(`/users/${userId}`);
    return data;
  },

  // ================= BLOCK / UNBLOCK =================
  toggleBlockUser: async (userId: string) => {
    const { data } = await api.patch(`/users/${userId}/block`);
    return data;
  },

  // ================= CHANGE ROLE =================
  changeUserRole: async (userId: string, role: string) => {
    const { data } = await api.patch(`/users/${userId}/role`, { role });
    return data;
  },

  // ================= RESTORE USER =================
  restoreUser: async (userId: string) => {
    const { data } = await api.patch(`/users/${userId}/restore`);
    return data;
  },

  // ================= PERMANENT DELETE =================
  bulkPermanentDeleteUsers: async (userIds: string[]) => {
    const { data } = await api.patch("/users/bulk/permanent", { userIds });
    return data;
  },

  // ================= BULK ACTIONS =================
  bulkDeleteUsers: async (ids: string[]) => {
    const { data } = await api.patch("/users/bulk/delete", { ids });
    return data;
  },

  bulkRestoreUsers: async (userIds: string[]) => {
    const { data } = await api.patch("/users/bulk/restore", { userIds });
    return data;
  },

  // ================= AVATAR =================
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

  // ================= ME PROFILE =================
  updateMyAccount: async (payload: any) => {
    const { data } = await api.patch("/users/me", payload);
    return data;
  },

  // ================= ADDRESSES =================
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
