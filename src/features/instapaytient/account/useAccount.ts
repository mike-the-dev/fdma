import { useState, useEffect } from "react";

import {
  fetchAccountById,
  fetchTransactionsByStripeAccount,
  useStripeAccountById,
} from "./account.service";
import { mapAccount, mapTransaction } from "./account.mappers";
import { TransactionMappedDTO, StripeAccount } from "./account.schema";
import { toAccountError } from "./account.errors";

import { AccountInstapaytient } from "@/types/AccountInstapaytient";
import { useAuthContext } from "@/context/AuthContext";

interface UseAccountReturn {
  account: AccountInstapaytient | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  transactions: TransactionMappedDTO[];
  transactionsLoading: boolean;
  transactionsError: string | null;
  refetchTransactions: () => Promise<void>;
  stripeAccount: StripeAccount | null;
  stripeAccountLoading: boolean;
  stripeAccountError: string | null;
  refetchStripeAccount: () => Promise<void>;
}

export const useAccount = (id: string): UseAccountReturn => {
  const { isAuthenticated, isLoading: authLoading } = useAuthContext();
  // Account state
  const [account, setAccount] = useState<AccountInstapaytient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Transaction state
  const [transactions, setTransactions] = useState<TransactionMappedDTO[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [transactionsError, setTransactionsError] = useState<string | null>(
    null
  );

  // Stripe Account - using React Query
  const stripeAccountId = account?.payout?.stripeId;
  const {
    data: stripeAccount,
    isLoading: stripeAccountLoading,
    error: stripeAccountQueryError,
    refetch: refetchStripeAccountQuery,
  } = useStripeAccountById(stripeAccountId);

  // Map React Query error to string for backward compatibility
  const stripeAccountError = stripeAccountQueryError
    ? toAccountError(stripeAccountQueryError).message
    : null;

  // Wrapper function for refetch to maintain interface
  const refetchStripeAccount = async (): Promise<void> => {
    await refetchStripeAccountQuery();
  };

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

      if (process.env.NODE_ENV !== "production")
        console.error("[useAccount]", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTransactions = async (): Promise<void> => {
    if (!account?.payout?.stripeId) return;

    try {
      setTransactionsLoading(true);
      setTransactionsError(null);

      const data = await fetchTransactionsByStripeAccount(
        account.payout.stripeId
      );
      const mappedTransactions = data.map(mapTransaction);

      setTransactions(mappedTransactions);
    } catch (err: unknown) {
      const mapped = toAccountError(err);

      // TOKEN_EXPIRED handled by global auth (redirect). No local error UI.
      if (mapped.code === "TOKEN_EXPIRED") return;

      setTransactionsError(mapped.message);

      if (process.env.NODE_ENV !== "production")
        console.error("[useAccount - fetchTransactions]", err);
    } finally {
      setTransactionsLoading(false);
    }
  };


  useEffect(() => {
    // Only fetch account details when authentication is complete and user is authenticated
    if (!authLoading && isAuthenticated && id) fetchAccountDetails();
  }, [authLoading, isAuthenticated, id]);

  useEffect(() => {
    // Fetch transactions when account data is available and has stripeId
    if (account?.payout?.stripeId) fetchTransactions();
  }, [account?.payout?.stripeId]);

  return {
    account,
    isLoading,
    error,
    refetch: fetchAccountDetails,
    transactions,
    transactionsLoading,
    transactionsError,
    refetchTransactions: fetchTransactions,
    stripeAccount: stripeAccount ?? null,
    stripeAccountLoading,
    stripeAccountError,
    refetchStripeAccount,
  };
};
