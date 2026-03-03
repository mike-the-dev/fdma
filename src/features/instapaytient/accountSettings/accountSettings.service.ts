import { useMutation, useQueryClient } from "@tanstack/react-query";

import apiClient from "@/utils/apiClient";
import { handleRequest } from "@/services/api";

import {
  UpdateAccountStatusRequest,
  UpdateAccountStatusResponse,
} from "./_shared/accountSettings.types";
import { updateAccountStatusSchema } from "./_shared/accountSettings.schema";

export const updateAccountStatus = async (
  payload: UpdateAccountStatusRequest
): Promise<UpdateAccountStatusResponse> => {
  const parsed = updateAccountStatusSchema.parse(payload);

  return handleRequest<UpdateAccountStatusResponse>(
    apiClient.post<UpdateAccountStatusResponse>("/api/user/account/status", parsed)
  );
};

export const useUpdateAccountStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateAccountStatusRequest) => updateAccountStatus(payload),
    onSuccess: async (_, payload) => {
      const normalizedAccountId = payload.accountId.startsWith("A#")
        ? payload.accountId
        : `A#${payload.accountId}`;

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["account", normalizedAccountId],
        }),
        queryClient.invalidateQueries({
          queryKey: ["account", payload.accountId],
        }),
      ]);
    },
  });
};
