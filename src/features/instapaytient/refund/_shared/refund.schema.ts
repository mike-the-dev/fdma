import { z } from "zod";

export const refundCreationSchema = z.object({
  accountId: z
    .string()
    .trim()
    .min(1, "Account ID is required"),
  chargeId: z
    .string()
    .trim()
    .min(1, "Charge ID is required")
    .startsWith("ch_", { message: 'Charge ID must start with "ch_".' }),
  orderNumber: z
    .string()
    .trim()
    .optional(),
  reason: z.enum(
    ["duplicate", "fraudulent", "requested_by_customer"],
    {
      message: "Reason is required",
    }
  ),
  internalNote: z
    .string()
    .trim()
    .max(2000, "Internal note is too long")
    .optional(),
  amount: z.coerce
    .number()
    .positive("Amount must be greater than 0"),
});

export type RefundCreationSchema = z.infer<typeof refundCreationSchema>;
