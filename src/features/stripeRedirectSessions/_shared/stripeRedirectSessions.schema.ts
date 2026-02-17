import { z } from "zod";

export const stripeRedirectSessionCreationSchema = z.object({
  stripeId: z
    .string()
    .trim()
    .min(1, "Stripe ID is required")
    .startsWith("acct_", { message: 'Stripe ID must start with "acct_".' }),
  customerName: z
    .string()
    .trim()
    .min(1, "Customer name is required"),
  companyName: z
    .string()
    .trim()
    .min(1, "Company name is required"),
  email: z
    .string()
    .trim()
    .email("Email must be a valid email address"),
  sendEmail: z
    .boolean()
    .optional(),
});

export type StripeRedirectSessionCreationSchema = z.infer<
  typeof stripeRedirectSessionCreationSchema
>;
