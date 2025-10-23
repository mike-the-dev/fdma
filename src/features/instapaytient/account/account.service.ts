import apiClient from "@/utils/apiClient";
import { Account } from "./account.schema";

export const fetchAccountById = async (id: string): Promise<Account> => {
  const res = await apiClient.get<Account>(`/api/user/instapaytient/${id}`);
  return res.data;
};
