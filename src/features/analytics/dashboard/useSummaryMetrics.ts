"use client";

import { useSummaryMetrics as useSummaryMetricsQuery } from "@/features/analytics/analytics.service";

export interface SummaryMetricsViewData {
  totalPayouts: number;
  totalVolume: number;
  totalPercentChange: number;
  affirm: {
    count: number;
    volume: number;
    percentChange: number;
  };
  normal: {
    count: number;
    volume: number;
    percentChange: number;
  };
  activeAccounts: number;
  avgProcessingDays: number;
  lastSyncTime: string;
};

export const useSummaryMetricsSection = (from: string, to: string): {
  data: SummaryMetricsViewData | null;
  isLoading: boolean;
  error: unknown;
} => {
  const { data, isLoading, error } = useSummaryMetricsQuery(from, to);

  if (!data) {
    return { data: null, isLoading, error };
  }

  const mapped: SummaryMetricsViewData = {
    totalPayouts: data.totalPayouts,
    totalVolume: data.totalVolumeCents,
    totalPercentChange: data.totalPercentChange,
    affirm: {
      count: data.affirm.count,
      volume: data.affirm.volumeCents,
      percentChange: data.affirm.percentChange,
    },
    normal: {
      count: data.normal.count,
      volume: data.normal.volumeCents,
      percentChange: data.normal.percentChange,
    },
    activeAccounts: data.activeAccounts,
    avgProcessingDays: data.avgProcessingDays,
    lastSyncTime: data.lastSyncTime,
  };

  return { data: mapped, isLoading, error };
};