import { useState } from "react";
import { useAuthStore } from "../store/auth/useAuthStore";
import type { RegisterCredentials } from "@/types/auth";

export const useRegister = () => {
  const register = useAuthStore((state) => state.register);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleRegister = async (credentials: RegisterCredentials) => {
    try {
      setLoading(true);
      setError(null);
      await register(credentials);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Register failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleRegister, loading, error };
};
