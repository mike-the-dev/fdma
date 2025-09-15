export type AccountInstapaytient = {
  entity: string;
  _createdAt_: string;
  payout?: {
    name: string;
    total_payout_amount: number;
    take: number;
    currency: string;
    instant_payout_enabled: boolean;
    stripe_id: string;
  };
  company: string;
  'GSI1-SK': string;
  SK: string;
  'GSI1-PK': string;
  PK: string;
  name: string;
  _lastUpdated_: string;
  state: string;
};

export type AccountInstapaytientHttpResponse = {
  accounts: AccountInstapaytient[];
};
