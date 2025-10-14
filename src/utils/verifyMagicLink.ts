import apiClient from "./apiClient";

interface VerifyMagicLinkData {
  token: string;
}

interface VerifyMagicLinkResponse {
  success: boolean;
  message?: string;
  authorization?: {
    tokens: {
      access: string;
      refresh: string;
    };
    user: {
      id: string;
      userId?: string;
      role: string;
      [key: string]: any;
    };
  };
}

/**
 * Verifies a magic link token with the NestJS backend
 * Calls the backend directly using the configured apiClient
 * No authentication required for this endpoint
 */

const verifyMagicLink = async (
  data: VerifyMagicLinkData
): Promise<VerifyMagicLinkResponse> => {
  try {
    // Call NestJS backend directly - no authentication needed for magic link verification
    const response = await apiClient.post(
      "/api/verifyMagicLinkSuperAdmin",
      data
    );

    return response.data;
  } catch (error: any) {
    console.error("Error verifying magic link:", error);

    // Handle axios error response
    if (error.response?.data) {
      throw new Error(
        error.response.data.message || "Failed to verify magic link"
      );
    }

    // Handle network or other errors
    throw new Error(error.message || "Failed to verify magic link");
  }
};

export default verifyMagicLink;
