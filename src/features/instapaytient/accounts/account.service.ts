import { Account } from "./account.schema";

import apiClient from "@/utils/apiClient";

export const fetchAccounts = async (): Promise<Account[]> => {
  const res = await apiClient.get<Account[]>("/api/user/listAccounts");

  return res.data;
};
