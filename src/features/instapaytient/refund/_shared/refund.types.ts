import Stripe from "stripe";

export type PaymentType =
  | "credit card or debit card"
  | "affirm"
  | "no payment type";

export type RefundReason = "duplicate" | "fraudulent" | "requested_by_customer";

export type RefundCreationFormData = {
  accountId: string;
  paymentId: string;
  paymentMethod: PaymentType;
  customerEmail: string;
  customerFirstName: string;
  customerLastName: string;
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
  customerEmail: {
    onChange: ({ value }: { value: string }) => string | undefined;
  };
  customerFirstName: {
    onChange: ({ value }: { value: string }) => string | undefined;
  };
  customerLastName: {
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
  paymentMethod?: PaymentType;
  customerEmail?: string;
  customerFirstName?: string;
  customerLastName?: string;
  amount: number;
  orderNumber?: string;
  reason: RefundReason;
  internalNote?: string;
}

export type CreateRefundResponse = Stripe.Refund;
