/**
 * Utility functions for magic link handling
 */

/**
 * Generates a magic link URL for the frontend
 * @param token - The magic link token
 * @param baseUrl - The base URL of your application (optional, defaults to current origin)
 * @returns The complete magic link URL
 */
export function generateMagicLinkUrl(token: string, baseUrl?: string): string {
  const base =
    baseUrl || (typeof window !== "undefined" ? window.location.origin : "");

  return `${base}/auth/verify-magic-link?token=${encodeURIComponent(token)}`;
}

/**
 * Extracts token from magic link URL
 * @param url - The magic link URL
 * @returns The token if found, null otherwise
 */
export function extractTokenFromMagicLink(url: string): string | null {
  try {
    const urlObj = new URL(url);

    return urlObj.searchParams.get("token");
  } catch (error) {
    console.error("Error parsing magic link URL:", error);

    return null;
  }
}

/**
 * Validates if a URL is a valid magic link URL
 * @param url - The URL to validate
 * @returns True if it's a valid magic link URL
 */
export function isValidMagicLinkUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);

    return (
      urlObj.pathname === "/auth/verify-magic-link" &&
      urlObj.searchParams.has("token")
    );
  } catch (error) {
    return false;
  }
}
