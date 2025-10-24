import { Account, Transaction } from "./account.schema";

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

export const mapTransaction = (transaction: Transaction): Transaction => {
  return {
    ...transaction,
  };
};
