import { useQuery } from "@tanstack/react-query";

import apiClient from "@/utils/apiClient";
import { handleRequest } from "@/services/api";

import {
  ListAdminRefundContractsQuery,
  ListRefundContractsResponse,
  RefundContractDto,
} from "./_shared/refundContracts.types";
import { listAdminRefundContractsQuerySchema } from "./_shared/refundContracts.schema";

// ============================================================================
// Client-side API Call Functions
// ============================================================================
export const fetchAdminRefundContracts = async (
  query: ListAdminRefundContractsQuery
): Promise<RefundContractDto[]> => {
  const payload = listAdminRefundContractsQuerySchema.parse(query);
  const normalizedAccountId = payload.accountId.startsWith("A#")
    ? payload.accountId
    : `A#${payload.accountId}`;

  return handleRequest<ListRefundContractsResponse>(
    apiClient.get<ListRefundContractsResponse>(
      `/api/admin/refunds/contracts?accountId=${encodeURIComponent(normalizedAccountId)}`
    )
  );
};

export const fetchUserRefundContracts = async (): Promise<RefundContractDto[]> => {
  return handleRequest<ListRefundContractsResponse>(
    apiClient.get<ListRefundContractsResponse>("/api/user/refunds/contracts")
  );
};

// ============================================================================
// TanStack Query Hooks
// ============================================================================
export const useAdminRefundContracts = (accountId?: string) => {
  const normalizedAccountId = accountId
    ? accountId.startsWith("A#")
      ? accountId
      : `A#${accountId}`
    : undefined;

  return useQuery<RefundContractDto[], Error>({
    queryKey: ["refundContracts", "admin", normalizedAccountId],
    queryFn: () =>
      fetchAdminRefundContracts({ accountId: normalizedAccountId as string }),
    enabled: !!normalizedAccountId,
  });
};

export const useUserRefundContracts = () => {
  return useQuery<RefundContractDto[], Error>({
    queryKey: ["refundContracts", "user"],
    queryFn: () => fetchUserRefundContracts(),
  });
};
