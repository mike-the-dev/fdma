export type StripeRedirectSessionDto = {
  sessionId: string;
  customerName: string;
  companyName: string;
  email: string;
  stripeId: string;
  status: string;
  createdAt: string;
  expiresAt: string;
};

export type RefreshStripeRedirectSessionRequest = {
  sessionId: string;
};

export type RefreshStripeRedirectSessionResponseDto = {
  redirectUrl: string;
  expiresAt: string;
};

export type UpdateStripeRedirectSessionEmailRequest = {
  sessionId: string;
  email: string;
};

export type UpdateStripeRedirectSessionEmailResponseDto = {
  sessionId: string;
  email: string;
};
