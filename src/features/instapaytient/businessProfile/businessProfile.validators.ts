import { z } from "zod";

// Zod schema for form validation - this is the single source of truth for all validation
export const BusinessProfileFormSchema = z.object({
  mccCode: z.string().min(1, "Select an MCC code"),
});

// Validators that use Zod schema for field-level validation
export const validateMccCode = (value: string): string | undefined => {
  const result = BusinessProfileFormSchema.shape.mccCode.safeParse(value);

  return result.success ? undefined : result.error.issues[0]?.message;
};

