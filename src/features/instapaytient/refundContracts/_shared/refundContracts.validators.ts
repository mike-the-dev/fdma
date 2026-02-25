import { listAdminRefundContractsQuerySchema } from "./refundContracts.schema";

export const validateRefundContractsAccountId = (
  value: string
): string | undefined => {
  const result = listAdminRefundContractsQuerySchema.safeParse({
    accountId: value,
  });

  if (result.success) return undefined;

  return result.error.issues[0]?.message;
};
