import apiClient from "@/utils/apiClient";
import { Account, Transaction } from "./account.schema";

export const fetchAccountById = async (id: string): Promise<Account> => {
  const res = await apiClient.get<Account>(`/api/user/account/${id}`);
  return res.data;
};

export const fetchTransactionsByStripeAccount = async (stripeAccount: string): Promise<Transaction[]> => {
  const res = await apiClient.get<Transaction[]>(`/api/user/transactions?stripeAccount=${stripeAccount}`);
  return res.data;
};
