"use client";

import "../globals.css";
import { useAuthContext } from "@/context/AuthContext";

interface DashboardLayout {
  children: React.ReactNode;
}

export default function DashboardLayout(
  props: DashboardLayout
): React.ReactElement {
  const { isAuthenticated, isLoading } = useAuthContext();

  // If not authenticated AND not loading, AuthProvider will handle redirect
  // This prevents the dashboard from disappearing during page transitions
  if (!isAuthenticated && !isLoading) {
    return <></>;
  }

  // User is authenticated or loading, render dashboard
  return <>{props.children}</>;
}
