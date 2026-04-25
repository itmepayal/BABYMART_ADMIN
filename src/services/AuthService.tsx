import type { AuthResponse, RegisterCredentials } from "@/types/auth";
import { api } from "@/lib/config";
import type { LoginCredentials } from "@/schemas/auth.schema";

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await api.post("/auth/login", credentials);
    return data;
  },

  register: async (payload: RegisterCredentials): Promise<AuthResponse> => {
    const { data } = await api.post("/auth/register", payload);
    return data;
  },

  logout: async (): Promise<{ success: boolean }> => {
    const { data } = await api.post("/auth/logout");
    return data;
  },

  refreshToken: async (): Promise<{ accessToken: string }> => {
    const { data } = await api.post("/auth/refresh-token");
    return data;
  },
};
