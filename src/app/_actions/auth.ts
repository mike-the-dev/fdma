"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Server action to set authentication cookies and redirect.
 * This ensures cookies are set server-side before navigation.
 *
 * @param accessToken - The access token to store
 * @param refreshToken - The refresh token to store
 * @param redirectPath - The path to redirect to after setting cookies
 */
export async function setAuthCookiesAndRedirect(
  accessToken: string,
  refreshToken: string,
  redirectPath: string
) {
  const cookieStore = await cookies();

  // Set access token cookie (15 minutes = 900 seconds)
  cookieStore.set("instapaytient_access_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 900, // 15 minutes
    path: "/",
  });

  // Set refresh token cookie (7 days = 604800 seconds)
  cookieStore.set("instapaytient_refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 604800, // 7 days
    path: "/",
  });

  // Redirect to the specified path
  redirect(redirectPath);
}

/**
 * Server action to set authentication cookies WITHOUT redirect.
 * Use this when you want to display UI (e.g., success + countdown) before navigating.
 */
export async function setAuthCookies(
  accessToken: string,
  refreshToken: string
) {
  const cookieStore = await cookies();

  // Set access token cookie (15 minutes = 900 seconds)
  cookieStore.set("instapaytient_access_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 900, // 15 minutes
    path: "/",
  });

  // Set refresh token cookie (7 days = 604800 seconds)
  cookieStore.set("instapaytient_refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 604800, // 7 days
    path: "/",
  });
}

/**
 * Server action to clear authentication cookies and redirect to login.
 * This ensures cookies are cleared server-side before navigation.
 *
 * @param redirectPath - The path to redirect to after clearing cookies (defaults to /login)
 */
export async function clearAuthAndRedirect(redirectPath: string = "/login") {
  const cookieStore = await cookies();

  // Clear access token cookie
  cookieStore.delete("instapaytient_access_token");

  // Clear refresh token cookie
  cookieStore.delete("instapaytient_refresh_token");

  // Redirect to the specified path
  redirect(redirectPath);
}
