import Stripe from "stripe";

export interface ProcessRefundRequest {
  accountId: string;
  chargeId: string;
  amount?: number;
}

export type ProcessRefundResponse = Stripe.Refund;
