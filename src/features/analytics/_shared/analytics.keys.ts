// Analytics query keys

export const analyticsKeys = {
  summaryMetrics: (from: string, to: string) => ["analytics", "summary-metrics", from, to] as const,
  paymentMethodMix: (from: string, to: string) => ["analytics", "payment-methods", from, to] as const,
  periodComparison: (to: string) => ["analytics", "period-comparison", to] as const,
  merchantLeaderboard: (from: string, to: string) => ["analytics", "accounts", "leaderboard", from, to] as const,
  accountSizeDistribution: (from: string, to: string) => ["analytics", "accounts", "distribution", from, to] as const,
  volumeStability: (from: string, to: string) => ["analytics", "volume-stability", from, to] as const,
  cashFlowTiming: (from: string, to: string) => ["analytics", "cash-flow-timing", from, to] as const,
  operationalHealth: () => ["analytics", "operational-health"] as const,
};