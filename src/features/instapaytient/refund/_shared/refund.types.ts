import Stripe from "stripe";

export type RefundReason = "duplicate" | "fraudulent" | "requested_by_customer";

export type RefundCreationFormData = {
  accountId: string;
  paymentId: string;
  amount: string;
  orderNumber: string;
  reason: RefundReason | "";
  internalNote: string;
};

export type RefundCreationValidators = {
  accountId: {
    onChange: ({ value }: { value: string }) => string | undefined;
  };
  paymentId: {
    onChange: ({ value }: { value: string }) => string | undefined;
  };
  amount: {
    onChange: ({ value }: { value: string }) => string | undefined;
  };
  orderNumber: {
    onChange: ({ value }: { value: string }) => string | undefined;
  };
  reason: {
    onChange: ({ value }: { value: string }) => string | undefined;
  };
  internalNote: {
    onChange: ({ value }: { value: string }) => string | undefined;
  };
};

export interface CreateRefundRequest {
  accountId: string;
  paymentId: string;
  amount: number;
  orderNumber?: string;
  reason: RefundReason;
  internalNote?: string;
}

export type CreateRefundResponse = Stripe.Refund;
