import { refundCreationSchema } from "./refund.schema";

const validateField = (
  field: "accountId" | "chargeId" | "amount" | "orderNumber",
  value: string
): string | undefined => {
  const result = refundCreationSchema.safeParse({
    accountId: field === "accountId" ? value : "A#placeholder",
    chargeId: field === "chargeId" ? value : "ch_1234567890",
    orderNumber: field === "orderNumber" ? value : "ORDER-123",
    amount: field === "amount" ? value : 10,
  });

  if (result.success) return undefined;

  const issue = result.error.issues.find((item) => item.path[0] === field);

  return issue?.message;
};

export const validateAccountId = (value: string): string | undefined =>
  validateField("accountId", value);

export const validateChargeId = (value: string): string | undefined =>
  validateField("chargeId", value);

export const validateAmount = (value: string): string | undefined =>
  validateField("amount", value);

export const validateOrderNumber = (value: string): string | undefined =>
  validateField("orderNumber", value);
