import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import apiClient from "@/utils/apiClient";
import { handleRequest } from "@/services/api";

import {
  CreateStripeRedirectSessionRequest,
  CreateStripeRedirectSessionResponse,
  RefreshStripeRedirectSessionRequest,
  RefreshStripeRedirectSessionResponseDto,
  StripeRedirectSessionDto,
  UpdateStripeRedirectSessionEmailRequest,
  UpdateStripeRedirectSessionEmailResponseDto,
} from "./_shared/stripeRedirectSessions.types";

// ============================================================================
// Client-side API Call Functions
// ============================================================================
export const postCreateStripeRedirectSession = async (
  payload: CreateStripeRedirectSessionRequest
): Promise<CreateStripeRedirectSessionResponse> => {
  return handleRequest(
    apiClient.post("/api/user/stripe/redirect-session/admin", payload)
  );
};

export const fetchStripeRedirectSessions = async (): Promise<
  StripeRedirectSessionDto[]
> => {
  return handleRequest(apiClient.get("/api/user/stripe/redirect-sessions"));
};

export const postRefreshStripeRedirectSession = async (
  payload: RefreshStripeRedirectSessionRequest
): Promise<RefreshStripeRedirectSessionResponseDto> => {
  return handleRequest(
    apiClient.post("/api/user/stripe/redirect-session/refresh", payload)
  );
};

export const postUpdateStripeRedirectSessionEmail = async (
  payload: UpdateStripeRedirectSessionEmailRequest
): Promise<UpdateStripeRedirectSessionEmailResponseDto> => {
  return handleRequest(
    apiClient.post("/api/user/stripe/redirect-session/email", payload)
  );
};

// ============================================================================
// TanStack Query Hook
// ============================================================================
export const useCreateStripeRedirectSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateStripeRedirectSessionRequest) =>
      postCreateStripeRedirectSession(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["stripeRedirectSessions"],
      });
    },
  });
};

export const useStripeRedirectSessions = () => {
  return useQuery<StripeRedirectSessionDto[], Error>({
    queryKey: ["stripeRedirectSessions"],
    queryFn: () => fetchStripeRedirectSessions(),
  });
};

export const useRefreshStripeRedirectSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RefreshStripeRedirectSessionRequest) =>
      postRefreshStripeRedirectSession(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["stripeRedirectSessions"],
      });
    },
  });
};

export const useUpdateStripeRedirectSessionEmail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateStripeRedirectSessionEmailRequest) =>
      postUpdateStripeRedirectSessionEmail(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["stripeRedirectSessions"],
      });
    },
  });
};
