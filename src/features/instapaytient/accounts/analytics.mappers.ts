import { GlobalAnalytics } from "./analytics.schema";

export const mapGlobalAnalytics = (analytics: GlobalAnalytics): GlobalAnalytics => {
  // Ensure payoutStats is properly structured
  if (analytics?.payoutStats) {
    return {
      ...analytics,
      payoutStats: {
        accountTotals: analytics.payoutStats.accountTotals || {},
        affirmTotalCents: analytics.payoutStats.affirmTotalCents ?? 0,
        grandTotalCents: analytics.payoutStats.grandTotalCents ?? 0,
        normalTotalCents: analytics.payoutStats.normalTotalCents ?? 0,
      },
    };
  }
  
  return analytics;
};

