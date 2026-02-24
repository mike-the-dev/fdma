import { useMutation, useQueryClient } from "@tanstack/react-query";

import apiClient from "@/utils/apiClient";
import { handleRequest } from "@/services/api";

import {
  CreateRefundRequest,
  CreateRefundResponse,
} from "./_shared/refund.types";

// ============================================================================
// Client-side API Call Functions
// ============================================================================
export const processRefund = async (
  payload: CreateRefundRequest
): Promise<CreateRefundResponse> => {
  return handleRequest(
    apiClient.post<CreateRefundResponse>("/api/user/refunds/trigger-flow", payload)
  );
};

// ============================================================================
// TanStack Query Hooks
// ============================================================================
export const useProcessRefund = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateRefundRequest) => processRefund(payload),
    onSuccess: async (_, payload) => {
      await queryClient.invalidateQueries({
        queryKey: ["refunds"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["refunds", payload.accountId],
      });
    },
  });
};
