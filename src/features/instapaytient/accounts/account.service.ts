import apiClient from "@/utils/apiClient";
import { Account } from "./account.schema";

export const fetchAccounts = async (): Promise<Account[]> => {
  const res = await apiClient.get<Account[]>("/api/user/listAccounts");
  return res.data;
};
