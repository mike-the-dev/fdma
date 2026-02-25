import { Charge, ChargeMappedDTO } from "./charges.types";

export const mapCharge = (charge: Charge): ChargeMappedDTO => {
  const paymentMethodType = charge.payment_method_details?.type;
  const sourceTransferOrderNumber =
    typeof charge.source_transfer === "object" &&
    charge.source_transfer !== null &&
    "metadata" in charge.source_transfer
      ? charge.source_transfer.metadata?.orderNumber
      : undefined;
  const orderNumber = charge.metadata?.orderNumber || sourceTransferOrderNumber;

  return {
    id: charge.id,
    amount: parseFloat((charge.amount / 100).toFixed(2)),
    currency: charge.currency?.toUpperCase() || "",
    created: new Date(charge.created * 1000).toLocaleDateString(),
    status: charge.status,
    metadata: {
      ...charge.metadata,
      ...(orderNumber ? { orderNumber } : {}),
    },
    payment_method_types: paymentMethodType ? [paymentMethodType] : [],
    latest_charge: charge,
  };
};
