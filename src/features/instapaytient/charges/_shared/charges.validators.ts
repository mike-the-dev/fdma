import { listChargesQuerySchema } from "./charges.schema";

export const validateStripeAccount = (value: string): string | undefined => {
  const result = listChargesQuerySchema.safeParse({
    stripeAccount: value,
  });

  if (result.success) return undefined;

  const issue = result.error.issues.find((item) => item.path[0] === "stripeAccount");

  return issue?.message;
};
