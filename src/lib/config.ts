import axios, { type AxiosInstance, type AxiosResponse } from "axios";

// ----------------------
// TYPES
// ----------------------
interface AdminApiConfig {
  baseURL: string;
  isProduction: boolean;
}

// ----------------------
// CONFIG
// ----------------------
export const getAdminAPIConfig = (): AdminApiConfig => {
  const apiUrl = import.meta.env.VITE_API_URL;

  if (!apiUrl) {
    throw new Error("API URL is missing in configuration");
  }

  const isProduction =
    import.meta.env.VITE_APP_ENV === "production" ||
    import.meta.env.PROD === true;

  return {
    baseURL: `${apiUrl}/api`,
    isProduction,
  };
};

// ----------------------
// AXIOS INSTANCE
// ----------------------
const createApiInstance = (): AxiosInstance => {
  const { baseURL } = getAdminAPIConfig();

  const instance = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
    timeout: 30000,
  });

  // ----------------------
  // REQUEST INTERCEPTOR
  // ----------------------
  instance.interceptors.request.use(
    (config) => {
      // cookies automatically sent
      return config;
    },
    (error) => Promise.reject(error),
  );

  // ----------------------
  // RESPONSE INTERCEPTOR
  // ----------------------
  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error) => {
      const status = error?.response?.status;

      if (status === 401) {
        console.warn("Unauthorized - session expired");

        localStorage.removeItem("user");
        window.location.href = "/login";
      }

      if (status >= 500) {
        console.error("Server error occurred");
      }

      return Promise.reject(error);
    },
  );

  return instance;
};

// ----------------------
// EXPORT SINGLETON
// ----------------------
export const api = createApiInstance();
