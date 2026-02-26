import { z } from "zod";

export const refundCreationSchema = z.object({
  accountId: z
    .string()
    .trim()
    .min(1, "Account ID is required"),
  paymentId: z
    .string()
    .trim()
    .min(1, "Payment ID is required")
    .regex(/^(ch_|py_|pi_)/, {
      message: 'Payment ID must start with "ch_", "py_", or "pi_".',
    }),
  paymentMethod: z
    .enum(
      ["credit card or debit card", "affirm", "no payment type"],
      {
        message: "Payment method is invalid.",
      }
    )
    .optional(),
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
