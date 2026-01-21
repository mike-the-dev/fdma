export type OnboardingSessionCreationFormData = {
  customerName: string;
  companyName: string;
  email: string;
};

export type OnboardingSessionCreationValidators = {
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

export type CreateOnboardingSessionRequest = {
  customerName: string;
  companyName: string;
  email: string;
};

export type CreateOnboardingSessionResponse = {
  sessionId: string;
  onboardingUrl: string;
  expiresAt: string;
};
