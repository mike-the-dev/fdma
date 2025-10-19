export type PayoutPayload = {
  payout_account_id: string;
  stripe_account_id: string;
  order_id: string;
  cart_items: Array<{
    serviceID: string;
    name: string;
    price: string;
    quantity: number;
    total: number;
    imageUrl: string;
    variant?: string;
  }>;
  current_subtotal_price: number;
  payment_method: string;
  tenderTransaction_id: string;
  tenderTransaction_paymentMethod: string;
  tenderTransaction_processedAt: string;
  tenderTransaction_remoteReference: string;
  tenderTransaction_test: boolean;
  tenderTransaction_amount: {
    tenderTransaction_amount_amount: number;
    tenderTransaction_amount_currencyCode: string;
  };
  tenderTransaction_transactionDetails: {
    tenderTransaction_transactionDetails_TenderTransactionCreditCardDetails_creditCardCompany: string;
  };
  account: {
    PK: string;
    SK: string;
    name: string;
    company: string;
    state: string;
    "GSI1-PK": string;
    "GSI1-SK": string;
    entity: "ACCOUNT";
    payout: {
      name: string;
      currency: string;
      stripe_id: string;
      take: number;
      total_payout_amount: number;
      instant_payout_enabled: boolean;
    };
  };
  customer_name: string;
};


