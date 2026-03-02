import React from "react";
import { Icon } from "@iconify/react";
import { addToast } from "@heroui/toast";

import {
  useAccountById,
  useTransactionsByStripeAccount,
  useStripeAccountById,
} from "./account.service";
import { TransactionMappedDTO, StripeAccount } from "./account.schema";
import { toAccountError } from "./account.errors";
import { processRefund } from "../refund/refund.service";
import { toRefundError } from "../refund/_shared/refund.errors";

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
  handleRefundTransaction: (transactionId: string) => Promise<void>;
  stripeAccount: StripeAccount | null;
  stripeAccountLoading: boolean;
  stripeAccountError: string | null;
  refetchStripeAccount: () => Promise<void>;
}

export const useAccount = (id: string): UseAccountReturn => {
  const { isAuthenticated, isLoading: authLoading } = useAuthContext();
  const accountQueryEnabled = !authLoading && isAuthenticated && !!id;
  const {
    data: accountData,
    isLoading,
    error: accountQueryError,
    refetch: refetchAccountQuery,
  } = useAccountById(id, accountQueryEnabled);
  const account = accountData ?? null;
  const error = accountQueryError ? toAccountError(accountQueryError).message : null;

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

  // Transactions - using React Query
  const {
    data: transactions = [],
    isLoading: transactionsLoading,
    error: transactionsQueryError,
    refetch: refetchTransactionsQuery,
  } = useTransactionsByStripeAccount(
    stripeAccountId,
    !authLoading && isAuthenticated
  );

  const transactionsError = transactionsQueryError
    ? toAccountError(transactionsQueryError).message
    : null;

  // Wrapper function for refetch to maintain interface
  const refetchStripeAccount = async (): Promise<void> => {
    await refetchStripeAccountQuery();
  };

  const refetchTransactions = async (): Promise<void> => {
    await refetchTransactionsQuery();
  };

  const refetch = async (): Promise<void> => {
    await refetchAccountQuery();
  };

  const handleRefundTransaction = async (transactionId: string): Promise<void> => {
    const selectedTransaction = transactions.find(
      (transaction) => transaction.id === transactionId
    );
    const latestCharge = selectedTransaction?.latest_charge;
    const paymentId =
      typeof latestCharge === "string"
        ? latestCharge
        : latestCharge?.id;
    const normalizedAccountId = id.startsWith("A#") ? id : `A#${id}`;

    if (!paymentId) {
      console.error(
        "[useAccount - handleRefundTransaction] Missing latest_charge for refund:",
        transactionId
      );
      return;
    }
    const amount = selectedTransaction?.amount;

    if (typeof amount !== "number" || amount <= 0) {
      console.error(
        "[useAccount - handleRefundTransaction] Missing valid amount for refund:",
        transactionId
      );
      return;
    }
    const amountInCents = Math.round(amount * 100);

    try {
      await processRefund({
        accountId: normalizedAccountId,
        paymentId,
        amount: amountInCents,
        reason: "requested_by_customer",
      });
      console.log(
        "[useAccount - handleRefundTransaction] Refund created:",
        { transactionId, paymentId }
      );
      addToast({
        title: "Refund Created",
        description: "The refund has been successfully processed.",
        icon: React.createElement(Icon, {
          icon: "lucide:check-circle",
          width: 24,
        }),
        severity: "success",
        color: "success",
        timeout: 5000,
      });
      await refetchTransactions();
    } catch (err: unknown) {
      const mapped = toRefundError(err);

      if (mapped.code === "TOKEN_EXPIRED") return;

      console.error("[useAccount - handleRefundTransaction]", mapped.message);
      addToast({
        title: "Refund Failed",
        description: mapped.message || "Failed to process refund. Please try again.",
        icon: React.createElement(Icon, {
          icon: "lucide:alert-circle",
          width: 24,
        }),
        severity: "danger",
        color: "danger",
        timeout: 5000,
      });
    }
  };

  return {
    account,
    isLoading,
    error,
    refetch,
    transactions,
    transactionsLoading,
    transactionsError,
    refetchTransactions,
    handleRefundTransaction,
    stripeAccount: stripeAccount ?? null,
    stripeAccountLoading,
    stripeAccountError,
    refetchStripeAccount,
  };
};
