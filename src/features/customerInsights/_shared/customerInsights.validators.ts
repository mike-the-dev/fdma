import { z } from "zod";

// Zod schema for form validation - this is the single source of truth for all validation
export const CustomerInsightsFormSchema = z.object({
  accountId: z.string().min(1, "Select an account"),
  avgSpentDollars: z
    .string()
    .min(1, "Required")
    .refine((v) => !isNaN(Number(v)) && Number(v) >= 0, "Must be a valid non-negative number"),
  subscriptionRatePercent: z
    .string()
    .min(1, "Required")
    .refine((v) => !isNaN(Number(v)) && Number(v) >= 0 && Number(v) <= 100, "0–100"),
  repeatRatePercent: z
    .string()
    .min(1, "Required")
    .refine((v) => !isNaN(Number(v)) && Number(v) >= 0 && Number(v) <= 100, "0–100"),
  retentionRatePercent: z
    .string()
    .min(1, "Required")
    .refine((v) => !isNaN(Number(v)) && Number(v) >= 0 && Number(v) <= 100, "0–100"),
});

// Validators that use Zod schema for field-level validation
export const validateAccountId = (value: string): string | undefined => {
  const result = CustomerInsightsFormSchema.shape.accountId.safeParse(value);
  return result.success ? undefined : result.error.issues[0]?.message;
};

export const validateDollars = (value: string): string | undefined => {
  const result = CustomerInsightsFormSchema.shape.avgSpentDollars.safeParse(value);
  return result.success ? undefined : result.error.issues[0]?.message;
};

export const validatePercent = (value: string): string | undefined => {
  // All percent fields have the same validation rules
  const result = CustomerInsightsFormSchema.shape.subscriptionRatePercent.safeParse(value);
  return result.success ? undefined : result.error.issues[0]?.message;
};


