import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { buildSessionExpiredError, handleAuthExpired } from "@/utils/authExpiration";

export const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL as string}/api`;

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
});

// Request interceptor to add auth token and required headers
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get access token from localStorage
    const accessToken = localStorage.getItem("access-token");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // Add x-client-domain header (required by backend)
    if (typeof window !== "undefined") {
      config.headers["x-client-domain"] = window.location.origin;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    // Check if it's an authentication error
    if (error.response?.status === 401) {
      console.warn("Authentication error detected, logging out user");

      handleAuthExpired();

      // Return a specific error that components can handle
      return Promise.reject(buildSessionExpiredError(error));
    }

    // Handle network errors or other issues
    if (!error.response) {
      console.error("Network error or server unavailable:", error.message);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
