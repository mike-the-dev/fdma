import { useState, useEffect } from "react";

import { fetchGlobalAnalytics } from "./account.service";
import { mapGlobalAnalytics } from "./analytics.mappers";
import { toAnalyticsError } from "./analytics.errors";

import { GlobalAnalytics } from "./analytics.schema";
import { useAuthContext } from "@/context/AuthContext";

interface UseGlobalAnalyticsReturn {
  analytics: GlobalAnalytics | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useGlobalAnalytics = (): UseGlobalAnalyticsReturn => {
  const { isAuthenticated, isLoading: authLoading } = useAuthContext();
  const [analytics, setAnalytics] = useState<GlobalAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalyticsData = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await fetchGlobalAnalytics();

      setAnalytics(data ? mapGlobalAnalytics(data) : null);
    } catch (err: unknown) {
      const mapped = toAnalyticsError(err);

      // TOKEN_EXPIRED handled by global auth (redirect). No local error UI.
      if (mapped.code === "TOKEN_EXPIRED") return;

      setError(mapped.message);

      if (process.env.NODE_ENV !== "production")
        console.error("[useGlobalAnalytics]", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch analytics when authentication is complete and user is authenticated
    if (!authLoading && isAuthenticated) fetchAnalyticsData();
  }, [authLoading, isAuthenticated]);

  return {
    analytics,
    isLoading,
    error,
    refetch: fetchAnalyticsData,
  };
};

