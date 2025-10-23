import { useState, useEffect } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { fetchAccounts } from "./account.service";
import { mapAccounts } from "./account.mappers";
import { AccountInstapaytient } from "@/types/AccountInstapaytient";
import { toAccountsError } from "./account.errors";

interface UseAccountsReturn {
  accounts: AccountInstapaytient[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useAccounts = (): UseAccountsReturn => {
  const { isAuthenticated, isLoading: authLoading } = useAuthContext();
  const [accounts, setAccounts] = useState<AccountInstapaytient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAccountsData = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await fetchAccounts();
      setAccounts(mapAccounts(data));
    } catch (err: unknown) {
      const mapped = toAccountsError(err);

      // TOKEN_EXPIRED handled by global auth (redirect). No local error UI.
      if (mapped.code === "TOKEN_EXPIRED") return;

      setError(mapped.message);

      if (process.env.NODE_ENV !== "production") console.error("[useAccounts]", err);
    } finally {
      setIsLoading(false);
    };
  };

  useEffect(() => {
    // Only fetch accounts when authentication is complete and user is authenticated
    if (!authLoading && isAuthenticated) fetchAccountsData();
  }, [authLoading, isAuthenticated]);

  return {
    accounts,
    isLoading,
    error,
    refetch: fetchAccountsData,
  };
};
