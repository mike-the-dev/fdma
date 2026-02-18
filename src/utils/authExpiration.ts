import type { AxiosError } from "axios";

let authExpiredHandler: (() => void) | null = null;

export const setAuthExpiredHandler = (handler: () => void): void => {
  authExpiredHandler = handler;
};

export const clearAuthStorage = (): void => {
  if (typeof window === "undefined") return;

  localStorage.removeItem("auth-public-token");
  localStorage.removeItem("access-token");
  localStorage.removeItem("refresh-token");
  localStorage.removeItem("user-id");
  localStorage.removeItem("user-role");
};

export const buildSessionExpiredError = (error: AxiosError) => {
  return {
    ...error,
    isTokenExpired: true,
    message: "Your session has expired. Please log in again.",
  };
};

export const handleAuthExpired = (): void => {
  clearAuthStorage();

  if (authExpiredHandler) {
    authExpiredHandler();
  }
};
