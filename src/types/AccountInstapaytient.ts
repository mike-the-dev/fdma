export type AccountAnalyticsTargets = {
  avg_spent_cents: number;
  subscription_rate_percent: number;
  repeat_rate_percent: number;
  retention_rate_percent: number;
};

export type AccountStatus = {
  isActive: boolean;
  code: string;
  message: string;
  updatedAt: string;
};

export type AccountInstapaytient = {
  id: string;
  name: string;
  company: string;
  state: string;
  entity: "ACCOUNT";
  payout?: {
    name: string;
    currency: string;
    stripeId: string;
    take: number;
    totalPayoutAmount: number;
    instantPayoutEnabled: boolean;
  } | null;
  analyticsTargets?: AccountAnalyticsTargets;
  status?: AccountStatus;
};

export type AccountInstapaytientHttpResponse = {
  accounts: AccountInstapaytient[];
};
