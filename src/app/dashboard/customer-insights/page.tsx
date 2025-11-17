import type { Metadata } from "next";

import { cookies } from "next/headers";
import { HydrationBoundary } from "@tanstack/react-query";
import { Spacer } from "@heroui/spacer";

import CustomerInsights from "@/components/Pages/CustomerInsights";
import { CustomerInsightDetail } from "@/components/Pages/CustomerInsights/CustomerInsightDetail";
import { prefetchAccounts } from "@/features/customerInsights/customerInsights.service";

export const metadata: Metadata = {
  title: "Customer Insights",
  description: "Insights and analytics for customers",
};

// Force server-rendering (no caching) typical for dynamic dashboards
export default async function CustomerInsightsPage() {
  const cookieStore = await cookies();
  const dehydratedAccountsState = await prefetchAccounts(cookieStore);

  return (
    <div style={{ maxWidth: "1300px", margin: "0 auto", padding: "0 16px" }}>
      <main className="p-6">
        <HydrationBoundary state={dehydratedAccountsState}>
          <CustomerInsights />
          <Spacer y={20} />
          <CustomerInsightDetail />
        </HydrationBoundary>
      </main>
    </div>
  );
}
