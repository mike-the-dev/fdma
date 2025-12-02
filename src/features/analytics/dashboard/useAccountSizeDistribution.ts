"use client";

import { useAccountSizeDistribution as useAccountSizeDistributionQuery } from "@/features/analytics/analytics.service";
import { useAnalyticsRange } from "@/components/Pages/Analytics/AnalyticsDashboardShell";

export interface AccountSizeDistributionViewData {
  totalActiveAccounts: number;
  buckets: {
    size: "small" | "medium" | "large";
    accountCount: number;
    grandTotalCents: number;
  }[];
};

export const useAccountSizeDistributionSection = (): {
  data: AccountSizeDistributionViewData | null;
  isLoading: boolean;
  error: unknown;
} => {
  const { range } = useAnalyticsRange();
  const { from, to } = range;

  const { data, isLoading, error } = useAccountSizeDistributionQuery(from, to);

  if (!data) {
    return { data: null, isLoading, error };
  }

  const view: AccountSizeDistributionViewData = {
    totalActiveAccounts: data.totalActiveAccounts,
    buckets: data.buckets.map((b) => ({
      size: b.size,
      accountCount: b.accountCount,
      grandTotalCents: b.grandTotalCents,
    })),
  };

  return {
    data: view,
    isLoading: isLoading,
    error: error,
  };
};