/**
 * Utility function to simulate token expiration for testing purposes
 * This should only be used in development/testing environments
 */

export const simulateTokenExpiration = () => {
  if (process.env.NODE_ENV === "development") {
    console.warn("Simulating token expiration for testing...");

    // Clear the access token to simulate expiration
    localStorage.removeItem("access-token");

    // You can trigger a test API call here if needed
    // For example, you could make a call to a protected endpoint
    // that would trigger the 401/403 response and automatic logout
  }
};

/**
 * Function to manually trigger logout (useful for testing)
 */
export const triggerManualLogout = () => {
  console.warn("Manually triggering logout...");

  // Clear all auth tokens
  localStorage.removeItem("auth-public-token");
  localStorage.removeItem("access-token");
  localStorage.removeItem("refresh-token");
  localStorage.removeItem("user-id");
  localStorage.removeItem("user-role");

  // Reload the page to trigger redirect to login
  window.location.href = "/login";
};
