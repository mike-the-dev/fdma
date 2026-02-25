import Stripe from "stripe";

export type RefundCreationFormData = {
  accountId: string;
  chargeId: string;
  amount: string;
  orderNumber: string;
};

export type RefundCreationValidators = {
  accountId: {
    onChange: ({ value }: { value: string }) => string | undefined;
  };
  chargeId: {
    onChange: ({ value }: { value: string }) => string | undefined;
  };
  amount: {
    onChange: ({ value }: { value: string }) => string | undefined;
  };
  orderNumber: {
    onChange: ({ value }: { value: string }) => string | undefined;
  };
};

export interface CreateRefundRequest {
  accountId: string;
  chargeId: string;
  amount: number;
  orderNumber?: string;
}

export type CreateRefundResponse = Stripe.Refund;
