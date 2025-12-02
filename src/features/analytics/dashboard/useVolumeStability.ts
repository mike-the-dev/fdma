"use client";

import { useVolumeStability as useVolumeStabilityQuery } from "@/features/analytics/analytics.service";
import { useAnalyticsRange } from "@/components/Pages/Analytics/AnalyticsDashboardShell";

export interface VolumeStabilityViewData {
  stats: {
    averageDailyGrandTotalCents: number;
    maxDailyGrandTotalCents: number;
    minDailyGrandTotalCents: number;
    daysWithPayouts: number;
    totalDays: number;
    standardDeviationGrandTotalCents: number | null;
    coefficientOfVariation: number | null;
    volatilityLabel: string;
  };
  trend: Array<{
    date: string;
    grandTotalCents: number;
    grandCount: number;
  }>;
};

export const useVolumeStabilitySection = (): {
  data: VolumeStabilityViewData | null;
  isLoading: boolean;
  error: unknown;
} => {
  const { range } = useAnalyticsRange();
  const { from, to } = range;

  const { data, isLoading, error } = useVolumeStabilityQuery(from, to);

  if (!data) {
    return { data: null, isLoading, error };
  };

  const view: VolumeStabilityViewData = {
    stats: {
      averageDailyGrandTotalCents: data.stats.averageDailyGrandTotalCents,
      maxDailyGrandTotalCents: data.stats.maxDailyGrandTotalCents,
      minDailyGrandTotalCents: data.stats.minDailyGrandTotalCents,
      daysWithPayouts: data.stats.daysWithPayouts,
      totalDays: data.stats.totalDays,
      standardDeviationGrandTotalCents: data.stats.standardDeviationGrandTotalCents,
      coefficientOfVariation: data.stats.coefficientOfVariation,
      volatilityLabel: data.stats.volatilityLabel,
    },
    trend: data.trend.map((point) => ({
      date: point.date,
      grandTotalCents: point.grandTotalCents,
      grandCount: point.grandCount,
    })),
  };

  return {
    data: view,
    isLoading: isLoading,
    error: error,
  };
};