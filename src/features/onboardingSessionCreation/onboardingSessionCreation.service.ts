import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateOnboardingSessionRequest) =>
      postCreateOnboardingSession(payload),
    onSuccess: async () => {
      // Refresh sessions list after creating a new one.
      await queryClient.invalidateQueries({
        queryKey: ["onboardingSessions"],
      });
    },
  });
};

export const useOnboardingSessions = () => {
  return useQuery<OnboardingSessionListItem[], Error>({
    queryKey: ["onboardingSessions"],
    queryFn: () => fetchOnboardingSessions(),
  });
};
