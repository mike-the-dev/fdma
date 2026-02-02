import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import axiosInstance from "@/utils/axiosInterceptor";
import { handleRequest } from "@/services/api";

import {
  CreateOnboardingSessionRequest,
  CreateOnboardingSessionResponse,
  OnboardingSessionListItem,
  RefreshOnboardingSessionRequest,
  RefreshOnboardingSessionResponseDto,
  UpdateOnboardingSessionEmailRequest,
  UpdateOnboardingSessionEmailResponseDto,
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

export const postRefreshOnboardingSession = async (
  payload: RefreshOnboardingSessionRequest
): Promise<RefreshOnboardingSessionResponseDto> => {
  return handleRequest(
    axiosInstance.post("/user/onboarding/session/refresh", payload)
  );
};

export const postUpdateOnboardingSessionEmail = async (
  payload: UpdateOnboardingSessionEmailRequest
): Promise<UpdateOnboardingSessionEmailResponseDto> => {
  return handleRequest(
    axiosInstance.post("/user/onboarding/session/email", payload)
  );
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

export const useRefreshOnboardingSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RefreshOnboardingSessionRequest) =>
      postRefreshOnboardingSession(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["onboardingSessions"],
      });
    },
  });
};

export const useUpdateOnboardingSessionEmail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateOnboardingSessionEmailRequest) =>
      postUpdateOnboardingSessionEmail(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["onboardingSessions"],
      });
    },
  });
};
