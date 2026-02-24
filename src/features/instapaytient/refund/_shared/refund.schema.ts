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
});

export type RefundCreationSchema = z.infer<typeof refundCreationSchema>;
