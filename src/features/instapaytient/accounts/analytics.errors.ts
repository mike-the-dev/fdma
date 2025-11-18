import axios from "axios";

export type AnalyticsErrorCode =
  | "TOKEN_EXPIRED"
  | "NOT_FOUND"
  | "NETWORK"
  | "INVALID"
  | "UNKNOWN";

export type AnalyticsError = {
  code: AnalyticsErrorCode;
  message: string;
};

/**
 * @description Maps raw API or network errors into typed AnalyticsError objects
 * for consistent handling within the Instapaytient analytics feature.
 */
export const toAnalyticsError = (err: unknown): AnalyticsError => {
  // 1. Axios-specific cases
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const dataMessage = err.response?.data?.message || err.message;

    if (status === 401)
      return {
        code: "TOKEN_EXPIRED",
        message: "Session expired. Please sign in again.",
      };

    if (status === 404)
      return { code: "NOT_FOUND", message: "Analytics not found." };

    if (status === 400)
      return { code: "INVALID", message: dataMessage || "Invalid request." };

    return {
      code: "NETWORK",
      message: dataMessage || "Network error. Please try again.",
    };
  }

  // 2. Generic JS errors
  if (err instanceof Error) return { code: "UNKNOWN", message: err.message };

  // 3. Fallback
  return { code: "UNKNOWN", message: "Unexpected error occurred." };
};

