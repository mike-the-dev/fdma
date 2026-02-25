import { z } from "zod";

export const listAdminRefundContractsQuerySchema = z.object({
  accountId: z
    .string()
    .trim()
    .min(1, "Account ID is required"),
});

export type ListAdminRefundContractsQuerySchema = z.infer<
  typeof listAdminRefundContractsQuerySchema
>;
