import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

// Global logout function that will be set by the AuthContext
let globalLogout: (() => void) | null = null;

export const setGlobalLogout = (logoutFn: () => void) => {
  globalLogout = logoutFn;
};

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_NESTJS_API_URL,
  timeout: 10000,
  withCredentials: true,
});

// Request interceptor to add auth token and required headers
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get access token from localStorage
    const accessToken = localStorage.getItem('access-token');
    
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    // Add x-client-domain header (required by backend)
    if (typeof window !== 'undefined') {
      config.headers['x-client-domain'] = window.location.origin;
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
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.warn('Authentication error detected, logging out user');
      
      // Clear localStorage tokens
      localStorage.removeItem('auth-public-token');
      localStorage.removeItem('access-token');
      localStorage.removeItem('refresh-token');
      localStorage.removeItem('user-id');
      localStorage.removeItem('user-role');
      
      // Call global logout function if available
      if (globalLogout) {
        globalLogout();
      }
      
      // Return a specific error that components can handle
      return Promise.reject({
        ...error,
        isTokenExpired: true,
        message: 'Your session has expired. Please log in again.'
      });
    }
    
    // Handle network errors or other issues
    if (!error.response) {
      console.error('Network error or server unavailable:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
