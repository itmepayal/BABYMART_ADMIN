import { create } from "zustand";
import { usersServices } from "@/services/UserService";
import type { GetUsersParams, User } from "@/types/users";

type UsersState = {
  users: User[];
  selectedUser: User | null;

  loading: boolean;
  isFetchingUsers: boolean;
  selectedAddress: null;
  error: string | null;

  total: number;
  page: number;
  pages: number;
  limit: number;
  search: string;

  fetchUsers: (params?: Partial<GetUsersParams>) => Promise<void>;
  getUserById: (userId: string) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  updateUser: (userId: string, payload: any) => Promise<void>;
  changeAvatarUser: (formData: FormData, userId?: string) => Promise<void>;
  createUser: (payload: any) => Promise<void>;
  getSingleAddress: (addressId: string) => Promise<void>;
  bulkDeleteUsers: (ids: string[]) => Promise<void>;
  bulkRestoreUsers: (ids: string[]) => Promise<void>;
  bulkPermanentDeleteUsers: (userId: string[]) => Promise<void>;

  setSearch: (value: string) => void;
  setLimit: (value: number) => void;
  clearUsers: () => void;
};

export const useUsersStore = create<UsersState>((set, get) => ({
  users: [],
  selectedUser: null,
  selectedAddress: null,

  loading: false,
  isFetchingUsers: false,
  error: null,

  total: 0,
  page: 1,
  pages: 1,
  limit: 8,
  search: "",

  // ================= FETCH USERS =================
  fetchUsers: async (params = {}) => {
    try {
      const state = get();
      const isInitialLoad = state.users.length === 0;

      set({
        loading: isInitialLoad,
        isFetchingUsers: !isInitialLoad,
        error: null,
      });

      const query = {
        page: params.page ?? state.page,
        limit: params.limit ?? state.limit,
        search: params.search ?? state.search,
      };

      const res = await usersServices.getAllUsers(query);

      set({
        users: res.data.users,
        total: res.data.total,
        page: res.data.page,
        pages: res.data.pages,
        limit: query.limit,
        search: query.search,
        loading: false,
        isFetchingUsers: false,
      });
    } catch (err: any) {
      set({
        error: err?.response?.data?.message || "Failed to fetch users",
        loading: false,
        isFetchingUsers: false,
      });
    }
  },

  // ================= GET USER BY ID =================
  getUserById: async (userId: string) => {
    try {
      set({ loading: true, error: null });

      const res = await usersServices.getUserById(userId);

      set({
        selectedUser: res.data,
        loading: false,
      });
    } catch (err: any) {
      set({
        error: err?.response?.data?.message || "Failed to fetch user",
        loading: false,
      });
    }
  },

  // ================= DELETE USER =================
  deleteUser: async (userId: string) => {
    const state = get();
    const prevUsers = state.users;
    const prevTotal = state.total;

    set({
      users: prevUsers.filter((u) => u._id !== userId),
      total: prevTotal - 1,
    });

    try {
      await usersServices.deleteUser(userId);
    } catch (err: any) {
      set({
        users: prevUsers,
        total: prevTotal,
        error: err?.response?.data?.message || "Failed to delete user",
      });
    }
  },

  // ================= PERMANENT DELETE =================
  bulkPermanentDeleteUsers: async (userId: string[]) => {
    const state = get();
    const prevUsers = state.users;

    set({
      users: prevUsers.filter((u) => !userId.includes(u._id)),
    });

    try {
      await usersServices.bulkPermanentDeleteUsers(userId);
    } catch (err: any) {
      set({
        users: prevUsers,
        error: err?.response?.data?.message || "Bulk delete failed",
      });
    }
  },
  // ================= BULK DELETE =================
  bulkDeleteUsers: async (ids: string[]) => {
    const state = get();
    const prevUsers = state.users;

    set({
      users: prevUsers.filter((u) => !ids.includes(u._id)),
      total: state.total - ids.length,
    });

    try {
      await usersServices.bulkDeleteUsers(ids);
    } catch (err: any) {
      set({
        users: prevUsers,
        error: err?.response?.data?.message || "Bulk delete failed",
      });
    }
  },

  // ================= BULK RESTORE =================
  bulkRestoreUsers: async (ids: string[]) => {
    try {
      set({ loading: true, error: null });

      await usersServices.bulkRestoreUsers(ids);

      await get().fetchUsers();

      set({ loading: false });
    } catch (err: any) {
      set({
        error: err?.response?.data?.message || "Bulk restore failed",
        loading: false,
      });
    }
  },

  // ================= UPDATE USER =================
  updateUser: async (userId: string, payload: any) => {
    const state = get();

    try {
      set({ loading: true });

      const res = await usersServices.updateUser(userId, payload);
      const updatedUser = res.data;

      set({
        users: state.users.map((u) =>
          u._id === updatedUser._id ? updatedUser : u,
        ),
        selectedUser:
          state.selectedUser?._id === updatedUser._id
            ? updatedUser
            : state.selectedUser,
        loading: false,
      });

      return updatedUser;
    } catch (err: any) {
      set({
        error: err?.response?.data?.message || "Failed to update user",
        loading: false,
      });
      throw err;
    }
  },

  // ================= CREATE USER =================
  createUser: async (payload: any) => {
    try {
      set({ loading: true });

      const res = await usersServices.createUser(payload);
      const newUser = res.data;

      set((state) => ({
        users: [newUser, ...state.users],
        total: state.total + 1,
        loading: false,
      }));

      return newUser;
    } catch (err: any) {
      set({
        error: err?.response?.data?.message || "Failed to create user",
        loading: false,
      });

      throw err;
    }
  },

  // ================= CHANGE AVATAR =================
  changeAvatarUser: async (formData: FormData, userId?: string) => {
    try {
      set({ loading: true });

      const res = await usersServices.changeAvatarUser(formData, userId);
      const updatedUser = res.data;

      set((state) => ({
        users: state.users.map((u) =>
          u._id === updatedUser._id ? updatedUser : u,
        ),
        selectedUser:
          state.selectedUser?._id === updatedUser._id
            ? updatedUser
            : state.selectedUser,
        loading: false,
      }));
    } catch (err: any) {
      set({
        error: err?.response?.data?.message || "Avatar update failed",
        loading: false,
      });
    }
  },

  // ================= SINGLE ADDRESS =================
  getSingleAddress: async (addressId: string) => {
    try {
      set({ loading: true });

      const res = await usersServices.getSingleAddress(addressId);

      set({
        selectedAddress: res.data,
        loading: false,
      });
    } catch (err: any) {
      set({
        error: err?.response?.data?.message || "Failed to fetch address",
        loading: false,
      });
    }
  },

  // ================= HELPERS =================
  setSearch: (value) => set({ search: value, page: 1 }),
  setLimit: (value) => set({ limit: value, page: 1 }),
  clearUsers: () => set({ users: [], selectedUser: null }),
}));
