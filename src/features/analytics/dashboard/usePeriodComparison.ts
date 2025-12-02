// Period comparison hook

"use client";

import { usePeriodComparison as usePeriodComparisonQuery } from "@/features/analytics/analytics.service";
import { useAnalyticsRange } from "@/components/Pages/Analytics/AnalyticsDashboardShell";

export interface PeriodComparisonViewData {
  thisMonth: { total: number; affirm: number; normal: number };
  lastMonth: { total: number; affirm: number; normal: number };
  thisWeek: { total: number; affirm: number; normal: number };
  lastWeek: { total: number; affirm: number; normal: number };
  last30Days: { total: number; affirm: number; normal: number };
  prior30Days: { total: number; affirm: number; normal: number };
  // dailyTrend: { date: string; total: number; affirm: number; normal: number }[];
};

export const usePeriodComparisonSection = (): {
  data: PeriodComparisonViewData | null;
  isLoading: boolean;
  error: unknown;
} => {
  const { range } = useAnalyticsRange();
  const { to } = range; // anchor comparisons on the "to" date

  const { data, isLoading, error } = usePeriodComparisonQuery(to);

  if (!data) {
    return { data: null, isLoading, error };
  }

  const mapTotals = (t: {
    grandTotalCents: number;
    affirmTotalCents: number;
    normalTotalCents: number;
  }) => ({
    total: t.grandTotalCents,
    affirm: t.affirmTotalCents,
    normal: t.normalTotalCents,
  });

  const view: PeriodComparisonViewData = {
    thisMonth: mapTotals(data.month.current),
    lastMonth: mapTotals(data.month.previous),
    thisWeek: mapTotals(data.week.current),
    lastWeek: mapTotals(data.week.previous),
    last30Days: mapTotals(data.days30.current),
    prior30Days: mapTotals(data.days30.previous),
    // dailyTrend: [], // you can fill this later from a /daily call if needed
  };

  return { data: view, isLoading, error };
};