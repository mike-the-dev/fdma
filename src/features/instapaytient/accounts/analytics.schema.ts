export type PayoutStats = {
  accountTotals?: Record<string, unknown>;
  affirmTotalCents?: number;
  grandTotalCents?: number;
  normalTotalCents?: number;
};

export type GlobalAnalytics = {
  id?: string;
  entity?: string;
  payoutStats?: PayoutStats;
  createdAt?: string;
  lastUpdated?: string;
  [key: string]: unknown;
};

