import axios from "axios";

// Generic axios response handler with consistent error normalization
export const handleRequest = async <T>(request: Promise<any>): Promise<T> => {
  try {
    const response = await request;

    return response.data as T;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios Error:", error.response?.data || error.message);

      if (!error.response) {
        throw new Error(
          "Network error: Could not reach the server or CORS rejection."
        );
      }

      const status = error.response.status;
      const serverMessage = (error.response.data as any)?.message;

      if (serverMessage) {
        throw new Error(serverMessage);
      }
      if (status === 400)
        throw new Error("Invalid request. Please check your inputs.");
      if (status === 401) throw new Error("Unauthorized. Please log in again.");
      if (status === 404) throw new Error("Resource not found.");
      if (status === 500)
        throw new Error("Server error. Please try again later.");
    }

    throw new Error(
      (error as Error).message || "An unexpected error occurred."
    );
  }
};

// Pulls account information from localStorage profile
export const getCookieData = (): {
  accountID: string;
  accountCompany: string;
} => {
  const profile =
    typeof window !== "undefined"
      ? localStorage.getItem("instapaytient_profile")
      : null;

  if (!profile) {
    throw new Error("Profile data is missing from localStorage.");
  }

  const parsed = JSON.parse(profile);

  if (!parsed.accountID || !parsed.accountCompany) {
    throw new Error(
      "Account ID or account company is missing from the profile."
    );
  }

  return parsed;
};

// Utility to generate x-client-domain header
export const getClientDomainHeader = (): Record<string, string> => ({
  "x-client-domain":
    process.env.NODE_ENV === "development"
      ? "localhost"
      : typeof window !== "undefined"
        ? window.location.hostname
        : "",
});
