import Stripe from "stripe";

import { AccountInstapaytient } from "@/types/AccountInstapaytient";

export type Account = AccountInstapaytient;
export type StripeAccount = Stripe.Account;
export type Transaction = Stripe.PaymentIntent;

export type TransactionMappedDTO = Omit<
  Transaction,
  "amount" | "currency" | "created"
> & {
  amount: number;
  currency: string;
  created: string;
};
