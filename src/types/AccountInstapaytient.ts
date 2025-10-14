export type AccountInstapaytient = {
  PK: string;
  SK: string;
  name: string;
  company: string;
  state: string;
  payout?: {
    name: string;
    total_payout_amount: number;
    take: number;
    currency: string;
    instant_payout_enabled: boolean;
    stripe_id: string;
  };
  "GSI1-PK": string;
  "GSI1-SK": string;
  entity: string;
  _createdAt_: string;
  _lastUpdated_: string;
};

export type AccountInstapaytientHttpResponse = {
  accounts: AccountInstapaytient[];
};
