import axios from "axios";

export type InstantCheckoutErrorCode = 
  | "VALIDATION_ERROR" 
  | "SLUG_ALREADY_EXISTS" 
  | "NETWORK" 
  | "UNAUTHORIZED" 
  | "UNKNOWN";

export type InstantCheckoutError = {
  code: InstantCheckoutErrorCode;
  message: string;
  field?: string;
};

/**
 * Maps raw API or network errors into typed InstantCheckoutError objects
 * for consistent error handling within the instant checkout feature.
 */
export const toInstantCheckoutError = (err: unknown): InstantCheckoutError => {
  // 1. Axios-specific cases
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const dataMessage = err.response?.data?.message || err.message;
    const field = err.response?.data?.field;

    if (status === 400) {
      const code = err.response?.data?.errorCode === "SLUG_EXISTS" 
        ? "SLUG_ALREADY_EXISTS" 
        : "VALIDATION_ERROR";
      return { 
        code, 
        message: dataMessage || "Invalid form data.", 
        field 
      };
    }

    if (status === 401)
      return { code: "UNAUTHORIZED", message: "Session expired. Please sign in again." };

    if (status === 404)
      return { code: "UNKNOWN", message: "Resource not found." };

    return { code: "NETWORK", message: dataMessage || "Network error. Please try again." };
  }

  // 2. Generic JS errors
  if (err instanceof Error)
    return { code: "UNKNOWN", message: err.message };

  // 3. Fallback
  return { code: "UNKNOWN", message: "Unexpected error occurred." };
};

