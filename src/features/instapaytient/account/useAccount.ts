import { useState, useEffect } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { fetchAccountById, fetchTransactionsByStripeAccount, fetchStripeAccountById } from "./account.service";
import { mapAccount, mapTransaction } from "./account.mappers";
import { AccountInstapaytient } from "@/types/AccountInstapaytient";
import { TransactionMappedDTO, StripeAccount } from "./account.schema";
import { toAccountError } from "./account.errors";

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
  const [transactionsError, setTransactionsError] = useState<string | null>(null);
  
  // Stripe Account state
  const [stripeAccount, setStripeAccount] = useState<StripeAccount | null>(null);
  const [stripeAccountLoading, setStripeAccountLoading] = useState(false);
  const [stripeAccountError, setStripeAccountError] = useState<string | null>(null);

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

  const fetchTransactions = async (): Promise<void> => {
    if (!account?.payout?.stripeId) return;
    
    try {
      setTransactionsLoading(true);
      setTransactionsError(null);
      
      const data = await fetchTransactionsByStripeAccount(account.payout.stripeId);
      const mappedTransactions = data.map(mapTransaction);
      setTransactions(mappedTransactions);
    } catch (err: unknown) {
      const mapped = toAccountError(err);

      // TOKEN_EXPIRED handled by global auth (redirect). No local error UI.
      if (mapped.code === "TOKEN_EXPIRED") return;

      setTransactionsError(mapped.message);

      if (process.env.NODE_ENV !== "production") console.error("[useAccount - fetchTransactions]", err);
    } finally {
      setTransactionsLoading(false);
    };
  };

  const fetchStripeAccount = async (): Promise<void> => {
    if (!account?.payout?.stripeId) return;
    
    try {
      setStripeAccountLoading(true);
      setStripeAccountError(null);
      
      const data = await fetchStripeAccountById(account.payout.stripeId);
      setStripeAccount(data);
    } catch (err: unknown) {
      const mapped = toAccountError(err);

      // TOKEN_EXPIRED handled by global auth (redirect). No local error UI.
      if (mapped.code === "TOKEN_EXPIRED") return;

      setStripeAccountError(mapped.message);

      if (process.env.NODE_ENV !== "production") console.error("[useAccount - fetchStripeAccount]", err);
    } finally {
      setStripeAccountLoading(false);
    };
  };

  useEffect(() => {
    // Only fetch account details when authentication is complete and user is authenticated
    if (!authLoading && isAuthenticated && id) fetchAccountDetails();
  }, [authLoading, isAuthenticated, id]);

  useEffect(() => {
    // Fetch transactions when account data is available and has stripeId
    if (account?.payout?.stripeId) fetchTransactions();
  }, [account?.payout?.stripeId]);

  useEffect(() => {
    // Fetch Stripe account when account data is available and has stripeId
    if (account?.payout?.stripeId) fetchStripeAccount();
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
    stripeAccount,
    stripeAccountLoading,
    stripeAccountError,
    refetchStripeAccount: fetchStripeAccount,
  };
};
