import Stripe from "stripe";

export type RefundCreationFormData = {
  accountId: string;
  chargeId: string;
};

export type RefundCreationValidators = {
  accountId: {
    onChange: ({ value }: { value: string }) => string | undefined;
  };
  chargeId: {
    onChange: ({ value }: { value: string }) => string | undefined;
  };
};

export interface CreateRefundRequest {
  accountId: string;
  chargeId: string;
  amount?: number;
}

export type CreateRefundResponse = Stripe.Refund;
