import { z } from "zod";

export const listChargesQuerySchema = z.object({
  stripeAccount: z
    .string()
    .trim()
    .min(1, "Stripe account is required"),
});

export type ListChargesQuerySchema = z.infer<typeof listChargesQuerySchema>;
