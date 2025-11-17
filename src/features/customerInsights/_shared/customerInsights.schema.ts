// API contract for submission
export interface AccountAnalyticsTargets {
  avgSpentDollars: number;
  subscriptionRatePercent: number;   // 0–100
  repeatRatePercent: number;         // 0–100
  retentionRatePercent: number;      // 0–100
}

// Minimal account shape for listing/selecting
export type FeatureAccount = {
  id: string;
  name: string;
};

// UI Form shape
export type CustomerInsightsFormData = {
  accountId: string;
  avgSpentDollars: string;           // keep as string for input handling
  subscriptionRatePercent: string;   // keep as string for input handling
  repeatRatePercent: string;         // keep as string for input handling
  retentionRatePercent: string;      // keep as string for input handling
};

// Validators type for TanStack Form
export type CustomerInsightsValidators = {
  accountId: { onChange: ({ value }: { value: string }) => string | undefined };
  avgSpentDollars: { onChange: ({ value }: { value: string }) => string | undefined };
  subscriptionRatePercent: { onChange: ({ value }: { value: string }) => string | undefined };
  repeatRatePercent: { onChange: ({ value }: { value: string }) => string | undefined };
  retentionRatePercent: { onChange: ({ value }: { value: string }) => string | undefined };
};


