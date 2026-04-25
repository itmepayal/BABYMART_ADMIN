import { useState } from "react";
import { useAuthStore } from "../store/auth/useAuthStore";
import type { LoginCredentials } from "@/schemas/auth.schema";

export const useLogin = () => {
  const login = useAuthStore((state) => state.login);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      setError(null);
      await login(credentials);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleLogin, loading, error };
};
