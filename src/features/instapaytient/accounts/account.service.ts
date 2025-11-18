import { Account } from "./account.schema";
import { GlobalAnalytics } from "./analytics.schema";

import apiClient from "@/utils/apiClient";

export const fetchAccounts = async (): Promise<Account[]> => {
  const res = await apiClient.get<Account[]>("/api/user/listAccounts");

  return res.data;
};

export const fetchGlobalAnalytics = async (): Promise<GlobalAnalytics | null> => {
  const res = await apiClient.get<GlobalAnalytics | null>("/api/user/globalAnalytics");

  return res.data;
};
