import { useState } from "react";
import { useAuthStore } from "../store/auth/useAuthStore";

export const useLogout = () => {
  const logout = useAuthStore((state) => state.logout);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleLogout = async () => {
    try {
      setLoading(true);
      setError(null);
      await logout();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Logout failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleLogout, loading, error };
};
