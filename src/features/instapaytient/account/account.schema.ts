import { AccountInstapaytient } from "@/types/AccountInstapaytient";
import Stripe from 'stripe';

export type Account = AccountInstapaytient;
export type Transaction = Stripe.PaymentIntent;

export type TransactionMappedDTO = Omit<Transaction, 'amount' | 'currency' | 'created'> & {
  amount: number;
  currency: string;
  created: string;
};