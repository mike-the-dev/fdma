import type {
  SuperAdminLoginRequest,
  SuperAdminLoginResponse,
} from "@/types/auth";

import apiClient from "./apiClient";

export default () => {
  const login = async (
    emailAddress: string,
    password: string
  ): Promise<SuperAdminLoginResponse> => {
    try {
      const response = await apiClient.post<
        SuperAdminLoginResponse,
        any,
        SuperAdminLoginRequest
      >("/api/loginSuperAdmin", {
        emailAddress,
        password,
      });

      console.log("Super admin login response: ", response.data);

      // Store tokens in localStorage
      if (response.data.authorization?.tokens) {
        localStorage.setItem(
          "access-token",
          response.data.authorization.tokens.access
        );
        localStorage.setItem(
          "refresh-token",
          response.data.authorization.tokens.refresh
        );
      }

      // Store super admin user info
      if (response.data.authorization?.user) {
        localStorage.setItem("user-id", response.data.authorization.user.id);
        localStorage.setItem(
          "user-role",
          response.data.authorization.user.role
        );
        // Store user email if available
        if (response.data.authorization.user.emailAddress) {
          localStorage.setItem(
            "user-email",
            response.data.authorization.user.emailAddress
          );
        }
      }

      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Super admin login failed";

      throw new Error(errorMessage);
    }
  };

  return {
    login,
  };
};
