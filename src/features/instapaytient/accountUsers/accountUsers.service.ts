import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import apiClient from "@/utils/apiClient";
import { handleRequest } from "@/services/api";

import {
  AccountUserListItem,
  CreateAccountUserRequest,
  CreateAccountUserResponse,
  DeleteAccountUserQuery,
  DeleteAccountUserResponse,
  ListAccountUsersQuery,
  ListAccountUsersResponse,
} from "./_shared/accountUsers.types";
import {
  deleteAccountUserQuerySchema,
  listAccountUsersQuerySchema,
} from "./_shared/accountUsers.schema";

// ============================================================================
// Client-side API Call Functions
// ============================================================================
export const createAccountUser = async (
  payload: CreateAccountUserRequest
): Promise<CreateAccountUserResponse> => {
  return handleRequest<CreateAccountUserResponse>(
    apiClient.post<CreateAccountUserResponse>("/api/createUser", payload)
  );
};

export const fetchAccountUsers = async (
  query: ListAccountUsersQuery
): Promise<AccountUserListItem[]> => {
  const payload = listAccountUsersQuerySchema.parse(query);

  return handleRequest<ListAccountUsersResponse>(
    apiClient.get<ListAccountUsersResponse>(
      `/api/user/account/users?accountId=${encodeURIComponent(payload.accountId)}`
    )
  );
};

export const deleteAccountUser = async (
  query: DeleteAccountUserQuery
): Promise<DeleteAccountUserResponse> => {
  const normalizedAccountId = query.accountId.startsWith("A#")
    ? query.accountId
    : `A#${query.accountId}`;
  const payload = deleteAccountUserQuerySchema.parse({
    ...query,
    accountId: normalizedAccountId,
  });

  return handleRequest<DeleteAccountUserResponse>(
    apiClient.delete<DeleteAccountUserResponse>(
      `/api/user/account/users?accountId=${encodeURIComponent(payload.accountId)}&userId=${encodeURIComponent(payload.userId)}`
    )
  );
};

// ============================================================================
// TanStack Query Hooks
// ============================================================================
export const useCreateAccountUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAccountUserRequest) => createAccountUser(payload),
    onSuccess: async (_, payload) => {
      await queryClient.invalidateQueries({
        queryKey: ["accountUsers", payload.accountID],
      });
    },
  });
};

export const useAccountUsers = (accountId?: string) => {
  const normalizedAccountId = accountId
    ? accountId.startsWith("A#")
      ? accountId
      : `A#${accountId}`
    : undefined;

  return useQuery<AccountUserListItem[], Error>({
    queryKey: ["accountUsers", normalizedAccountId],
    queryFn: () =>
      fetchAccountUsers({ accountId: normalizedAccountId as string }),
    enabled: !!normalizedAccountId,
  });
};

export const useDeleteAccountUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (query: DeleteAccountUserQuery) => deleteAccountUser(query),
    onSuccess: async (_, query) => {
      const normalizedAccountId = query.accountId.startsWith("A#")
        ? query.accountId
        : `A#${query.accountId}`;

      await queryClient.invalidateQueries({
        queryKey: ["accountUsers", normalizedAccountId],
      });
    },
  });
};
