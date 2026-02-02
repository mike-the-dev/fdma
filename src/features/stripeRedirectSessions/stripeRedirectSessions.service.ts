import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import axiosInstance from "@/utils/axiosInterceptor";
import { handleRequest } from "@/services/api";

import {
  RefreshStripeRedirectSessionRequest,
  RefreshStripeRedirectSessionResponseDto,
  StripeRedirectSessionDto,
} from "./_shared/stripeRedirectSessions.types";

// ============================================================================
// Client-side API Call Functions
// ============================================================================
export const fetchStripeRedirectSessions = async (): Promise<
  StripeRedirectSessionDto[]
> => {
  return handleRequest(axiosInstance.get("/user/stripe/redirect-sessions"));
};

export const postRefreshStripeRedirectSession = async (
  payload: RefreshStripeRedirectSessionRequest
): Promise<RefreshStripeRedirectSessionResponseDto> => {
  return handleRequest(
    axiosInstance.post("/user/stripe/redirect-session/refresh", payload)
  );
};

// ============================================================================
// TanStack Query Hook
// ============================================================================
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
