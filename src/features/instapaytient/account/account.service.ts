import apiClient from "@/utils/apiClient";
import { Account, Transaction, StripeAccount } from "./account.schema";

export const fetchAccountById = async (id: string): Promise<Account> => {
  const res = await apiClient.get<Account>(`/api/user/account/${id}`);
  return res.data;
};

export const fetchTransactionsByStripeAccount = async (stripeAccount: string): Promise<Transaction[]> => {
  const res = await apiClient.get<Transaction[]>(`/api/user/transactions?stripeAccount=${stripeAccount}`);
  return res.data;
};

export const fetchStripeAccountById = async (id: string): Promise<StripeAccount> => {
  const res = await apiClient.get<StripeAccount>(`/api/user/stripe/connected-account/${id}`);
  return res.data;
};
