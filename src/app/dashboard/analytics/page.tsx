import type { Metadata } from "next";
import { cookies } from "next/headers";
import { HydrationBoundary } from "@tanstack/react-query";
import { AnalyticsDashboardShell } from "@/components/Pages/Analytics/AnalyticsDashboardShell";
import { prefetchSummaryMetrics } from "@/features/analytics/analytics.service";

export const metadata: Metadata = {
  title: "Analytics",
  description: "Analytics dashboard",
};

export default async function AnalyticsPage() {
  const cookieStore = await cookies();

  // ---- Local date helpers ----
  const toLocalDateString = (date: Date): string => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const monthStr = month < 10 ? `0${month}` : `${month}`;
    const dayStr = day < 10 ? `0${day}` : `${day}`;

    return `${year}-${monthStr}-${dayStr}`;
  };

  // ---- Compute default range in LOCAL TIME ----
  const now = new Date();
  now.setHours(0, 0, 0, 0);     // Normalize to start of local day

  const defaultTo = toLocalDateString(now);

  const fromDate = new Date(now);
  fromDate.setDate(now.getDate() - 29);
  fromDate.setHours(0, 0, 0, 0);

  const defaultFrom = toLocalDateString(fromDate);

  // ---- Prefetch summary data for hydration ----
  const dehydratedState = await prefetchSummaryMetrics(
    cookieStore,
    defaultFrom,
    defaultTo,
  );

  return (
    <div className="max-w-[1525px] mx-auto px-4 pt-8">
      <HydrationBoundary state={dehydratedState}>
        <AnalyticsDashboardShell
          initialFrom={defaultFrom}
          initialTo={defaultTo}
        />
      </HydrationBoundary>
    </div>
  );
};