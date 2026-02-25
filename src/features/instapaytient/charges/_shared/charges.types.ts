import Stripe from "stripe";

export interface ListChargesQuery {
  stripeAccount: string;
}

export interface ListChargesResponse {
  data: Stripe.Charge[];
}

export type Charge = Stripe.Charge;

export type ChargeMappedDTO = {
  id: string;
  amount: number;
  currency: string;
  created: string;
  status: string;
  metadata: Stripe.Metadata;
  payment_method_types: string[];
  latest_charge: Charge;
};
