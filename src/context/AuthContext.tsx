"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useRef,
} from "react";
import { useRouter, usePathname } from "next/navigation";

import { setGlobalLogout } from "@/utils/apiClient";
import {
  getLocalStorageItem,
  removeLocalStorageItem,
} from "@/hooks/useLocalStorage";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  userId: string | null;
  userRole: string | null;
  logout: () => void;
  recheckAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const hasCheckedAuth = useRef(false);
  const lastPathname = useRef<string | null>(null);

  // Always start with a consistent state for SSR/hydration
  const [authState, setAuthState] = useState<{
    isAuthenticated: boolean;
    isLoading: boolean;
    userId: string | null;
    userRole: string | null;
  }>({
    isAuthenticated: false,
    isLoading: true,
    userId: null,
    userRole: null,
  });

  // Function to check auth status
  const checkAuth = () => {
    // Check if we should bypass auth in development
    const bypassAuth =
      process.env.NODE_ENV === "development" &&
      process.env.NEXT_PUBLIC_BYPASS_AUTH === "true";

    if (bypassAuth) {
      // Set mock authenticated state for development
      setAuthState({
        isAuthenticated: true,
        isLoading: false,
        userId: "dev-user-123",
        userRole: "admin",
      });

      // Handle redirects for bypassed auth
      const isDashboardRoute = pathname.startsWith("/dashboard");
      const isLoginRoute = pathname === "/login";
      const isRootRoute = pathname === "/";

      if (isDashboardRoute || isLoginRoute || isRootRoute) {
        router.push("/dashboard/instapaytient");
      }

      return;
    };

    // Check auth status only on client - using safe localStorage utilities
    const authToken = getLocalStorageItem("auth-public-token");
    const accessToken = getLocalStorageItem("access-token");
    const userId = getLocalStorageItem("user-id");
    const userRole = getLocalStorageItem("user-role");

    const isAuth = !!(authToken && accessToken);

    setAuthState({
      isAuthenticated: isAuth,
      isLoading: false,
      userId: isAuth ? userId : null,
      userRole: isAuth ? userRole : null,
    });

    // Handle redirects based on pathname
    const isDashboardRoute = pathname.startsWith("/dashboard");
    const isLoginRoute = pathname === "/login";
    const isRootRoute = pathname === "/";

    if (!isAuth && isDashboardRoute) {
      // Not authenticated, trying to access dashboard
      router.push("/login");
    } else if (isAuth && (isLoginRoute || isRootRoute)) {
      // Authenticated, on login or root page
      router.push("/dashboard/instapaytient");
    }
  };

  // Single effect that handles both mounting and auth checking
  useEffect(() => {
    // Mark as mounted
    setIsMounted(true);

    // Check if pathname has changed (indicating a navigation)
    const pathnameChanged = lastPathname.current !== pathname;

    lastPathname.current = pathname;

    // If pathname changed, reset the auth check flag to re-check auth
    if (pathnameChanged) {
      hasCheckedAuth.current = false;
    }

    // Only check auth once per pathname, or if not checked yet
    if (hasCheckedAuth.current && !pathnameChanged) {
      return;
    }

    hasCheckedAuth.current = true;
    checkAuth();
  }, [pathname]); // Add pathname as dependency

  const recheckAuth = () => {
    hasCheckedAuth.current = false;
    checkAuth();
  };

  const logout = () => {
    // Use safe localStorage utilities
    removeLocalStorageItem("auth-public-token");
    removeLocalStorageItem("access-token");
    removeLocalStorageItem("refresh-token");
    removeLocalStorageItem("user-id");
    removeLocalStorageItem("user-role");
    removeLocalStorageItem("user-email");

    setAuthState({
      isAuthenticated: false,
      isLoading: false,
      userId: null,
      userRole: null,
    });

    router.push("/login");
  };

  // Set the global logout function for axios interceptor
  useEffect(() => {
    setGlobalLogout(logout);
  }, []);

  // Always render children to prevent blank pages
  // The loading state is handled by individual components
  // Only render children after mounting to prevent hydration mismatch
  return (
    <AuthContext.Provider value={{ ...authState, logout, recheckAuth }}>
      {isMounted ? children : <></>}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }

  return context;
};
