import { z } from "zod";

export const updateAccountStatusSchema = z.object({
  accountId: z
    .string()
    .trim()
    .min(1, "Account ID is required")
    .transform((value) => (value.startsWith("A#") ? value : `A#${value}`)),
  status: z.object({
    isActive: z.boolean(),
    code: z.string().trim().min(1, "Status code is required"),
    message: z.string().trim().min(1, "Status message is required"),
  }),
});

export type UpdateAccountStatusSchema = z.infer<typeof updateAccountStatusSchema>;
