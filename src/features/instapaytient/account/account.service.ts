import { Account, Transaction, StripeAccount } from "./account.schema";
import { mapAccount, mapTransaction } from "./account.mappers";
import { TransactionMappedDTO } from "./account.schema";
import { useQuery } from "@tanstack/react-query";

import apiClient from "@/utils/apiClient";

const normalizeAccountId = (id?: string): string | undefined => {
  if (!id) return id;
  return id.startsWith("A#") ? id : `A#${id}`;
};

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
export const useAccountById = (id?: string, enabled: boolean = true) => {
  const normalizedId = normalizeAccountId(id);

  return useQuery<Account, Error>({
    queryKey: ["account", normalizedId],
    queryFn: () => fetchAccountById(id!),
    enabled: !!id && enabled,
    select: (account: Account): Account => mapAccount(account),
  });
};

export const useStripeAccountById = (id?: string) => {
  return useQuery<StripeAccount, Error>({
    queryKey: ["stripeAccount", id],
    queryFn: () => fetchStripeAccountById(id!),
    enabled: !!id,
  });
};

export const useTransactionsByStripeAccount = (
  stripeAccount?: string,
  enabled: boolean = true
) => {
  return useQuery<Transaction[], Error, TransactionMappedDTO[]>({
    queryKey: ["transactions", stripeAccount],
    queryFn: () => fetchTransactionsByStripeAccount(stripeAccount!),
    enabled: !!stripeAccount && enabled,
    select: (transactions: Transaction[]): TransactionMappedDTO[] =>
      transactions.map(mapTransaction),
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
