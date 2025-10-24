import { AccountInstapaytient } from "@/types/AccountInstapaytient";
import Stripe from 'stripe';

export type Account = AccountInstapaytient;
export type Transaction = Stripe.PaymentIntent;