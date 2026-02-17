export type StripeRedirectSessionCreationFormData = {
  stripeId: string;
  customerName: string;
  companyName: string;
  email: string;
  sendEmail: boolean;
};

export type StripeRedirectSessionCreationValidators = {
  stripeId: {
    onChange: ({ value }: { value: string }) => string | undefined;
  };
  customerName: {
    onChange: ({ value }: { value: string }) => string | undefined;
  };
  companyName: {
    onChange: ({ value }: { value: string }) => string | undefined;
  };
  email: {
    onChange: ({ value }: { value: string }) => string | undefined;
  };
};

export type CreateStripeRedirectSessionRequest = {
  stripeId: string;
  customerName: string;
  companyName: string;
  email: string;
  sendEmail?: boolean;
};

export type CreateStripeRedirectSessionResponse = {
  sessionId: string;
  redirectUrl: string;
  expiresAt: string;
};

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
