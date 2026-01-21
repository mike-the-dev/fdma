import { useMutation, useQuery } from "@tanstack/react-query";

import axiosInstance from "@/utils/axiosInterceptor";
import { handleRequest } from "@/services/api";

import {
  CreateOnboardingSessionRequest,
  CreateOnboardingSessionResponse,
  OnboardingSessionListItem,
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

export const fetchOnboardingSessions = async (): Promise<
  OnboardingSessionListItem[]
> => {
  return handleRequest(axiosInstance.get("/user/onboarding/sessions"));
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

export const useOnboardingSessions = () => {
  return useQuery<OnboardingSessionListItem[], Error>({
    queryKey: ["onboardingSessions"],
    queryFn: () => fetchOnboardingSessions(),
  });
};
