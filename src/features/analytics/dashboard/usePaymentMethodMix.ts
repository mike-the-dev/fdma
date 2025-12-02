"use client";

import { usePaymentMethodMix as usePaymentMethodMixQuery } from "@/features/analytics/analytics.service";
import { useAnalyticsRange } from "@/components/Pages/Analytics/AnalyticsDashboardShell";

export interface PaymentMethodMixViewData {
  volume: {
    affirm: number; // cents
    normal: number; // cents
  };
  count: {
    affirm: number;
    normal: number;
  };
  trend: Array<{
    date: string;
    affirmShare: number; // 0–1
    normalShare: number; // 0–1
  }>;
}

export const usePaymentMethodMixSection = (): {
  data: PaymentMethodMixViewData | null;
  isLoading: boolean;
  error: unknown;
} => {
  const { range } = useAnalyticsRange();
  const { from, to } = range;

  const { data, isLoading, error } = usePaymentMethodMixQuery(from, to);

  if (!data) {
    return { data: null, isLoading, error };
  }

  const volume = {
    affirm: data.totals.affirmTotalCents,
    normal: data.totals.normalTotalCents,
  };

  const count = {
    affirm: data.counts.affirmCount,
    normal: data.counts.normalCount,
  };

  // Convert per-day percentage shares (0–100) to 0–1 ratios for the area chart
  const trend = data.trend.map((point) => {
    const affirmShare =
      point.affirmVolumeSharePercent != null ? point.affirmVolumeSharePercent / 100 : 0;
    const normalShare =
      point.normalVolumeSharePercent != null ? point.normalVolumeSharePercent / 100 : 0;

    return {
      date: point.date,
      affirmShare,
      normalShare,
    };
  });

  const view: PaymentMethodMixViewData = {
    volume: volume,
    count: count,
    trend: trend,
  };

  return {
    data: view,
    isLoading: isLoading,
    error: error,
  };
};