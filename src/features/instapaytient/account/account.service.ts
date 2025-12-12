import { Account, Transaction, StripeAccount } from "./account.schema";
import { useQuery } from "@tanstack/react-query";

import apiClient from "@/utils/apiClient";

export const fetchAccountById = async (id: string): Promise<Account> => {
  const res = await apiClient.get<Account>(`/api/user/account/${id}`);

  return res.data;
};

export const fetchTransactionsByStripeAccount = async (
  stripeAccount: string
): Promise<Transaction[]> => {
  const res = await apiClient.get<Transaction[]>(
    `/api/user/transactions?stripeAccount=${stripeAccount}`
  );

  return res.data;
};

export const fetchStripeAccountById = async (
  id: string
): Promise<StripeAccount> => {
  const res = await apiClient.get<StripeAccount>(
    `/api/user/stripe/connected-account/${id}`
  );

  return res.data;
};

// ============================================================================
// TanStack Query Hooks
// ============================================================================
export const useStripeAccountById = (id?: string) => {
  return useQuery<StripeAccount, Error>({
    queryKey: ["stripeAccount", id],
    queryFn: () => fetchStripeAccountById(id!),
    enabled: !!id,
  });
};

export const setStripeAccountMcc = async (
  id: string,
  mcc: string
): Promise<StripeAccount> => {
  const res = await apiClient.post<StripeAccount>(
    `/api/user/stripe/connected-account/${id}/mcc`,
    { mcc: mcc }
  );

  return res.data;
};
