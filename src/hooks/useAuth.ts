"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  userId: string | null;
  userRole: string | null;
}

export const useAuth = (redirectTo: string = "/login") => {
  const router = useRouter();
  const hasCheckedAuth = useRef(false);

  // Check localStorage immediately (synchronously) for initial state
  const getInitialAuthState = (): AuthState => {
    if (typeof window === "undefined") {
      return {
        isAuthenticated: false,
        isLoading: true,
        userId: null,
        userRole: null,
      };
    }

    const authToken = localStorage.getItem("auth-public-token");
    const accessToken = localStorage.getItem("access-token");
    const userId = localStorage.getItem("user-id");
    const userRole = localStorage.getItem("user-role");

    // If tokens exist, immediately set as authenticated (no loading state needed)
    if (authToken && accessToken) {
      return {
        isAuthenticated: true,
        isLoading: false,
        userId: userId,
        userRole: userRole,
      };
    }

    // No tokens, will need to redirect (show loading only in this case)
    return {
      isAuthenticated: false,
      isLoading: true,
      userId: null,
      userRole: null,
    };
  };

  const [authState, setAuthState] = useState<AuthState>(getInitialAuthState);

  useEffect(() => {
    // Skip if we've already checked
    if (hasCheckedAuth.current) {
      return;
    }

    const checkAuth = () => {
      try {
        // Check for auth token
        const authToken = localStorage.getItem("auth-public-token");
        const accessToken = localStorage.getItem("access-token");
        const userId = localStorage.getItem("user-id");
        const userRole = localStorage.getItem("user-role");

        // If no tokens, redirect to login
        if (!authToken || !accessToken) {
          console.warn("No authentication tokens found, redirecting to login");
          router.push(redirectTo);
          setAuthState({
            isAuthenticated: false,
            isLoading: false,
            userId: null,
            userRole: null,
          });
          hasCheckedAuth.current = true;

          return;
        }

        // Tokens exist, user is authenticated
        setAuthState({
          isAuthenticated: true,
          isLoading: false,
          userId: userId,
          userRole: userRole,
        });
        hasCheckedAuth.current = true;
      } catch (error) {
        console.error("Error checking authentication:", error);
        router.push(redirectTo);
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          userId: null,
          userRole: null,
        });
        hasCheckedAuth.current = true;
      }
    };

    checkAuth();
  }, [router, redirectTo]);

  return authState;
};

export const logout = () => {
  // Clear all auth-related data from localStorage
  localStorage.removeItem("auth-public-token");
  localStorage.removeItem("access-token");
  localStorage.removeItem("refresh-token");
  localStorage.removeItem("user-id");
  localStorage.removeItem("user-role");
};
