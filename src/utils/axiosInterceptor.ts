import axios from "axios";

/**
 * @author mike-the-dev (Michael Camacho)
 * @editor mike-the-dev (Michael Camacho)
 * @lastUpdated 2024-06-09
 * @name axiosInterceptor
 * @description Axios instance with request interceptor for injecting access token from sessionStorage into Authorization header.
 */

export const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL as string}/api`;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

// Attach access token to all outgoing requests
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken =
      typeof window !== "undefined"
        ? localStorage.getItem("access-token")
        : null;

    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    // Add x-client-domain header (required by backend)
    if (typeof window !== "undefined") {
      config.headers["x-client-domain"] = window.location.origin;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors and refresh token
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Mirror existing apiClient behavior: on 401, clear storage and redirect
    if (error?.response?.status === 401) {
      try {
        if (typeof window !== "undefined") {
          localStorage.removeItem("auth-public-token");
          localStorage.removeItem("access-token");
          localStorage.removeItem("refresh-token");
          localStorage.removeItem("user-id");
          localStorage.removeItem("user-role");
        }
      } catch (_e) {
        // no-op
      }

      return Promise.reject({
        ...error,
        isTokenExpired: true,
        message: "Your session has expired. Please log in again.",
      });
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
