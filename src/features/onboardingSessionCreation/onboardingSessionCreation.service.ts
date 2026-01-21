import { useMutation } from "@tanstack/react-query";

import axiosInstance from "@/utils/axiosInterceptor";
import { handleRequest } from "@/services/api";

import {
  CreateOnboardingSessionRequest,
  CreateOnboardingSessionResponse,
} from "./_shared/onboardingSessionCreation.types";

// ============================================================================
// Client-side API Call Functions
// ============================================================================
export const postCreateOnboardingSession = async (
  payload: CreateOnboardingSessionRequest
): Promise<CreateOnboardingSessionResponse> => {
  return handleRequest(
    axiosInstance.post("/user/onboarding/session", payload)
  );
};

// ============================================================================
// TanStack Query Mutation Hook
// ============================================================================
export const useCreateOnboardingSession = () => {
  return useMutation({
    mutationFn: (payload: CreateOnboardingSessionRequest) =>
      postCreateOnboardingSession(payload),
  });
};
