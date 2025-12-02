export interface SummaryMetricsResponse {
  totalPayouts: number;
  totalVolumeCents: number;
  totalPercentChange: number;
  affirm: {
    count: number;
    volumeCents: number;
    percentChange: number;
  };
  normal: {
    count: number;
    volumeCents: number;
    percentChange: number;
  };
  activeAccounts: number;
  avgProcessingDays: number;
  lastSyncTime: string;
};

export interface PeriodTotals {
  grandTotalCents: number;
  affirmTotalCents: number;
  normalTotalCents: number;
};

export interface PeriodComparisonBucket {
  current: PeriodTotals;
  previous: PeriodTotals;
  deltas: {
    grandPercent: number | null;
    affirmPercent: number | null;
    normalPercent: number | null;
  };
};

export interface PeriodComparisonResponse {
  asOfDate: string; // "YYYY-MM-DD" (UTC, matches arrival_date-based metrics)
  month: PeriodComparisonBucket;
  week: PeriodComparisonBucket;
  days30: PeriodComparisonBucket;
};

export interface PaymentMethodMixTotals {
  grandTotalCents: number;
  affirmTotalCents: number;
  normalTotalCents: number;
};

export interface PaymentMethodMixCounts {
  grandCount: number;
  affirmCount: number;
  normalCount: number;
};

export interface PaymentMethodMixTrendPoint {
  date: string;
  grandTotalCents: number;
  affirmTotalCents: number;
  normalTotalCents: number;
  grandCount: number;
  affirmCount: number;
  normalCount: number;
  affirmVolumeSharePercent: number | null;
  normalVolumeSharePercent: number | null;
  affirmCountSharePercent: number | null;
  normalCountSharePercent: number | null;
};

export interface PaymentMethodMixResponse {
  from: string;
  to: string;
  totals: PaymentMethodMixTotals;
  counts: PaymentMethodMixCounts;
  shares: {
    affirmVolumeSharePercent: number | null;
    normalVolumeSharePercent: number | null;
    affirmCountSharePercent: number | null;
    normalCountSharePercent: number | null;
  };
  trend: PaymentMethodMixTrendPoint[];
};

export type AccountSizeBucket = "small" | "medium" | "large";

export interface AccountSizeDistributionBucket {
  size: AccountSizeBucket;
  accountCount: number;
  grandTotalCents: number;
};

export interface AccountSizeDistributionResponse {
  from: string;
  to: string;
  totalActiveAccounts: number;
  buckets: AccountSizeDistributionBucket[];
};

export interface MerchantAccountPayoutMetrics {
  stripeAccountId: string;
  accountName?: string; // optional for now - can be joined from getAllAccounts later
  grandTotalCents: number;
  affirmTotalCents: number;
  normalTotalCents: number;
  payoutCount: number;
  avgPayoutCents: number;
  affirmVolumeSharePercent: number | null;
};

export interface MerchantAccountsLeaderboardResponse {
  from: string;
  to: string;
  totalActiveAccounts: number;
  topAccounts: MerchantAccountPayoutMetrics[];
};

export interface VolumeStabilityTrendPoint {
  date: string;
  grandTotalCents: number;
  grandCount: number;
};

export type VolumeVolatilityLabel = "very_stable" | "stable" | "volatile" | "highly_volatile";
export interface VolumeStabilityStats {
  averageDailyGrandTotalCents: number;
  maxDailyGrandTotalCents: number;
  minDailyGrandTotalCents: number;
  daysWithPayouts: number;
  totalDays: number;
  standardDeviationGrandTotalCents: number | null;
  coefficientOfVariation: number | null;
  volatilityLabel: VolumeVolatilityLabel;
};

export interface VolumeStabilityResponse {
  from: string;
  to: string;
  stats: VolumeStabilityStats;
  trend: VolumeStabilityTrendPoint[];
};

export interface CashFlowTimingSummary {
  count: number;
  avgDays: number | null;
  medianDays: number | null;
  minDays: number | null;
  maxDays: number | null;
};

export interface CashFlowTimingDistributionBucket {
  label: string;        // e.g. "1_day", "2_days", "3_days", "4_plus"
  minDays: number;
  maxDays: number | null; // null for open-ended (e.g. 4+)
  count: number;
};

export interface CashFlowTimingResponse {
  from: string;
  to: string;
  overall: CashFlowTimingSummary;
  affirm: CashFlowTimingSummary;
  normal: CashFlowTimingSummary;
  distribution: CashFlowTimingDistributionBucket[];
};

export interface OperationalHealthResponse {
  lastRunAt: string | null;
  lastRunDurationMs: number | null;
  lastRunStatus: SyncRunStatus | "unknown";
  accountsProcessed: number;
  totalPayoutsProcessed: number;
  lastSyncedPayoutCreated: number;
  healthScorePercent: number;
};

export type SyncRunStatus = "success" | "failure";