import { useQuery } from "@tanstack/react-query";

import axiosInstance from "@/utils/axiosInterceptor";
import { handleRequest } from "@/services/api";

import { StripeRedirectSessionDto } from "./_shared/stripeRedirectSessions.types";

// ============================================================================
// Client-side API Call Functions
// ============================================================================
export const fetchStripeRedirectSessions = async (): Promise<
  StripeRedirectSessionDto[]
> => {
  return handleRequest(axiosInstance.get("/user/stripe/redirect-sessions"));
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
