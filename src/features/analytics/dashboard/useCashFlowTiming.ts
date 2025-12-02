"use client";

import { useCashFlowTiming as useCashFlowTimingQuery } from "@/features/analytics/analytics.service";
import { useAnalyticsRange } from "@/components/Pages/Analytics/AnalyticsDashboardShell";
import type { CashFlowTimingResponse } from "@/features/analytics/_shared/analytics.schema";

export interface CashFlowTimingViewSummary {
  count: number;
  avgDays: number | null;
  medianDays: number | null;
  minDays: number | null;
  maxDays: number | null;
};

export interface CashFlowTimingViewData {
  overall: CashFlowTimingViewSummary;
  affirm: CashFlowTimingViewSummary;
  normal: CashFlowTimingViewSummary;
  distribution: Array<{
    label: string;
    minDays: number;
    maxDays: number | null;
    count: number;
  }>;
};

export const useCashFlowTimingSection = (): {
  data: CashFlowTimingViewData | null;
  isLoading: boolean;
  error: unknown;
} => {
  const { range } = useAnalyticsRange();
  const { from, to } = range;

  const { data, isLoading, error } = useCashFlowTimingQuery(from, to);

  if (!data) {
    return { data: null, isLoading, error };
  };

  const mapSummary = (s: CashFlowTimingResponse["overall"]): CashFlowTimingViewSummary => ({
    count: s.count,
    avgDays: s.avgDays,
    medianDays: s.medianDays,
    minDays: s.minDays,
    maxDays: s.maxDays,
  });

  const view: CashFlowTimingViewData = {
    overall: mapSummary(data.overall),
    affirm: mapSummary(data.affirm),
    normal: mapSummary(data.normal),
    distribution: data.distribution.map((b) => ({
      label: b.label,
      minDays: b.minDays,
      maxDays: b.maxDays,
      count: b.count,
    })),
  };

  return {
    data: view,
    isLoading: isLoading,
    error: error,
  };
};