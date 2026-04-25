import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUser, RegisterCredentials } from "@/types/auth";
import { authService } from "@/services/AuthService";
import type { LoginCredentials } from "@/schemas/auth.schema";

type AuthState = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isAdmin: false,

      login: async (credentials) => {
        try {
          set({ isLoading: true });
          const data = await authService.login(credentials);
          const isAdmin = data.data.user.role === "admin";
          set({
            user: data.data.user,
            isAuthenticated: true,
            isAdmin,
            isLoading: false,
          });
        } catch (err) {
          set({
            isLoading: false,
            isAuthenticated: false,
            isAdmin: false,
          });
          throw err;
        }
      },

      register: async (credentials) => {
        try {
          set({ isLoading: true });
          const data = await authService.register(credentials);
          const isAdmin = data.data.user?.role === "admin";
          set({
            user: data.data.user,
            isAuthenticated: true,
            isAdmin,
            isLoading: false,
          });
        } catch (err) {
          set({ isLoading: false });
          throw err;
        }
      },

      logout: async () => {
        try {
          await authService.logout();
        } finally {
          set({
            user: null,
            isAuthenticated: false,
            isAdmin: false,
          });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isAdmin: state.isAdmin,
      }),
    },
  ),
);
