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
};

export type AccountInstapaytientHttpResponse = {
  accounts: AccountInstapaytient[];
};
