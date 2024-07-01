export type Account = {
  PK: string;
  SK: string;
  name: string;
  currency: string;
  take: number;
  totalPayoutAmount: number;
  instantPayoutEnabled: boolean;
  stripeID: string;
  ecwidAppSecretKey: string;
  ecwidPublicKey: string;
  ecwidSecretKey: string;
  "GSI1-PK": string;
};

export type AccountInputForm = {
  name: string;
  currency: string;
  take: number;
};

export type AccountUpdateInputForm = {
  PK: string;
  SK: string;
  name: string;
  currency: string;
  take: number;
  instantPayoutEnabled: boolean;
  stripeID: string;
  ecwidAppSecretKey: string;
  ecwidPublicKey: string;
  ecwidSecretKey: string;
  "GSI1-PK": string;
};

export type AccountHttpResponse = {
  accounts: Account[];
};