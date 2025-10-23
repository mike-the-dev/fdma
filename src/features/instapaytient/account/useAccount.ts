import { useState, useEffect } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { fetchAccountById } from "./account.service";
import { mapAccount } from "./account.mappers";
import { AccountInstapaytient } from "@/types/AccountInstapaytient";
import { toAccountError } from "./account.errors";

interface UseAccountReturn {
  account: AccountInstapaytient | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useAccount = (id: string): UseAccountReturn => {
  const { isAuthenticated, isLoading: authLoading } = useAuthContext();
  const [account, setAccount] = useState<AccountInstapaytient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAccountDetails = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await fetchAccountById(id);
      setAccount(mapAccount(data));
    } catch (err: unknown) {
      const mapped = toAccountError(err);

      // TOKEN_EXPIRED handled by global auth (redirect). No local error UI.
      if (mapped.code === "TOKEN_EXPIRED") return;

      setError(mapped.message);

      if (process.env.NODE_ENV !== "production") console.error("[useAccount]", err);
    } finally {
      setIsLoading(false);
    };
  };

  useEffect(() => {
    // Only fetch account details when authentication is complete and user is authenticated
    if (!authLoading && isAuthenticated && id) fetchAccountDetails();
  }, [authLoading, isAuthenticated, id]);

  return {
    account,
    isLoading,
    error,
    refetch: fetchAccountDetails,
  };
};
