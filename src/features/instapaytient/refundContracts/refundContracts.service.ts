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

  return handleRequest<ListRefundContractsResponse>(
    apiClient.get<ListRefundContractsResponse>(
      `/api/admin/refunds/contracts?accountId=${encodeURIComponent(payload.accountId)}`
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
  return useQuery<RefundContractDto[], Error>({
    queryKey: ["refundContracts", "admin", accountId],
    queryFn: () =>
      fetchAdminRefundContracts({ accountId: accountId as string }),
    enabled: !!accountId,
  });
};

export const useUserRefundContracts = () => {
  return useQuery<RefundContractDto[], Error>({
    queryKey: ["refundContracts", "user"],
    queryFn: () => fetchUserRefundContracts(),
  });
};
