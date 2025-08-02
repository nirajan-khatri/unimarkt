// axios.ts
import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

// Cookie utility functions to match auth context
const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null; // Check for SSR
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:8000/api/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    if (typeof window !== "undefined") {
      const token = getCookie("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // Optionally check if body is FormData and log/debug
    if (config.data instanceof FormData) {
      console.log("Sending FormData...");
    }

    return config;
  },
  (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error);
  }
);

// ✅ Response interceptor (unchanged)
axiosInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  (error: AxiosError): Promise<AxiosError> => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized - token may be expired");
      // Clear cookies on 401 errors to force re-authentication
      if (typeof window !== "undefined") {
        document.cookie = "accessToken=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
        document.cookie = "refreshToken=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
        document.cookie = "tokenTimestamp=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
        document.cookie = "userId=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
      }
    }
    return Promise.reject(error);
  }
);
export default axiosInstance;
