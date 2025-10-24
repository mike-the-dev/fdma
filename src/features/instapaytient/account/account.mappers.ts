import { Account, Transaction, TransactionMappedDTO } from "./account.schema";

export const mapAccount = (account: Account): Account => {
  return {
    ...account,
    id: account.id.replace("A#", ""),
    payout: account.payout ? {
      ...account.payout,
      take: (account.payout.take * 100) / 100
    } : null,
  };
};

export const mapTransaction = (transaction: Transaction): TransactionMappedDTO => {
  return {
    ...transaction,
    amount: parseFloat((transaction.amount / 100).toFixed(2)),
    currency: transaction.currency?.toUpperCase(),
    created: new Date(transaction.created * 1000).toLocaleDateString(),
  };
};
