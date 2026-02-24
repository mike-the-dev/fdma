import { refundCreationSchema } from "./refund.schema";

const validateField = (
  field: "accountId" | "chargeId",
  value: string
): string | undefined => {
  const result = refundCreationSchema.safeParse({
    accountId: field === "accountId" ? value : "A#placeholder",
    chargeId: field === "chargeId" ? value : "ch_1234567890",
  });

  if (result.success) return undefined;

  const issue = result.error.issues.find((item) => item.path[0] === field);

  return issue?.message;
};

export const validateAccountId = (value: string): string | undefined =>
  validateField("accountId", value);

export const validateChargeId = (value: string): string | undefined =>
  validateField("chargeId", value);
