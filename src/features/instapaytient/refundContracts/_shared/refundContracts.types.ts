export type RefundContractStatus =
  | "PENDING_DOCTOR_PAYMENT"
  | "PLATFORM_FUNDS_CLEARING"
  | "READY_FOR_REFUND"
  | "COMPLETED"
  | "FAILED";

export type PaymentType =
  | "credit card or debit card"
  | "affirm"
  | "no payment type";

export interface RefundContractDto {
  id: string;
  accountId: string;
  connectedAccountId: string;
  customerId?: string;
  paymentId: string;
  paymentMethod?: PaymentType;
  orderNumber?: string;
  amountToRefund: number;
  currency: string;
  status: RefundContractStatus;
  platformPaymentIntentId?: string;
  stripeTransferId?: string;
  stripeRefundId?: string;
  reason?: string;
  internalNote?: string;
  createdByAdmin?: string;
  createdAt: string;
  lastUpdated: string;
}

export interface ListAdminRefundContractsQuery {
  accountId: string;
}

export type ListRefundContractsResponse = RefundContractDto[];
