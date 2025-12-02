"use client";

import { useOperationalHealth as useOperationalHealthQuery } from "@/features/analytics/analytics.service";

export interface OperationalHealthViewData {
  lastRunAt: string | null;
  lastRunDurationMs: number | null;
  lastRunStatus: "success" | "failure" | "unknown";
  accountsProcessed: number;
  totalPayoutsProcessed: number;
  lastSyncedPayoutCreated: number;
  healthScorePercent: number;
}

export const useOperationalHealthSection = (): {
  data: OperationalHealthViewData | null;
  isLoading: boolean;
  error: unknown;
} => {
  const { data, isLoading, error } = useOperationalHealthQuery();

  if (!data) {
    return { data: null, isLoading, error };
  };

  const view: OperationalHealthViewData = {
    lastRunAt: data.lastRunAt,
    lastRunDurationMs: data.lastRunDurationMs,
    lastRunStatus: data.lastRunStatus,
    accountsProcessed: data.accountsProcessed,
    totalPayoutsProcessed: data.totalPayoutsProcessed,
    lastSyncedPayoutCreated: data.lastSyncedPayoutCreated,
    healthScorePercent: data.healthScorePercent,
  };

  return {
    data: view,
    isLoading: isLoading,
    error: error,
  };
};