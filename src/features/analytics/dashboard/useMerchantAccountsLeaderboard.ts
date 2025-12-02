"use client";

import { useMerchantAccountsLeaderboard as useMerchantAccountsLeaderboardQuery } from "@/features/analytics/analytics.service";
import { useAnalyticsRange } from "@/components/Pages/Analytics/AnalyticsDashboardShell";

export interface MerchantAccountLeaderboardViewData {
  topAccounts: Array<{
    id: string;
    name: string;
    volumeCents: number;
    payoutCount: number;
    avgPayoutSizeCents: number;
  }>;
  totalActiveAccounts: number;
  totalAccounts: number;
};

export const useMerchantAccountsLeaderboardSection = (): {
  data: MerchantAccountLeaderboardViewData | null;
  isLoading: boolean;
  error: unknown;
} => {
  const { range } = useAnalyticsRange();
  const { from, to } = range;

  const { data, isLoading, error } = useMerchantAccountsLeaderboardQuery(from, to, 10);

  if (!data) {
    return { data: null, isLoading, error };
  };

  const view: MerchantAccountLeaderboardViewData = {
    totalActiveAccounts: data.totalActiveAccounts,
    totalAccounts: data.totalActiveAccounts, // no separate total, so mirror active for now
    topAccounts: data.topAccounts.map((account) => ({
      id: account.stripeAccountId,
      name: account.accountName ?? account.stripeAccountId,
      volumeCents: account.grandTotalCents,
      payoutCount: account.payoutCount,
      avgPayoutSizeCents: account.avgPayoutCents,
    }))
  };

  return {
    data: view,
    isLoading: isLoading,
    error: error,
  };
};