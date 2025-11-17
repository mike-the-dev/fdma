import { z } from "zod";

// US States validation
const US_STATES = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
] as const;

// Enterprise-grade validation schema for Account Deployment
export const accountDeploymentSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .regex(
      /^[a-zA-Z\s\-'\.]+$/,
      "Name can only contain letters, spaces, hyphens, apostrophes, and periods"
    )
    .transform((val) => val.trim()),

  company: z
    .string()
    .min(1, "Company name is required")
    .min(2, "Company name must be at least 2 characters")
    .max(200, "Company name must be less than 200 characters")
    .regex(
      /^[a-zA-Z0-9\u00C0-\u017F\s\-'\.&,()+]+$/,
      "Company name contains invalid characters"
    )
    .transform((val) => val.trim()),

  state: z
    .string()
    .min(1, "State is required")
    .refine((val) => US_STATES.includes(val as any), {
      message: "Please select a valid US state",
    }),

  domain: z
    .string()
    .min(1, "Subdomain is required")
    .min(2, "Subdomain must be at least 2 characters")
    .max(63, "Subdomain must be less than 63 characters")
    .regex(/^[a-zA-Z0-9-]+$/, "Subdomain can only contain letters, numbers, and hyphens")
    .refine((val) => !val.startsWith("-") && !val.endsWith("-"), {
      message: "Subdomain cannot start or end with hyphen",
    })
    .refine(
      (val) => !val.includes("--"),
      {
        message: "Subdomain cannot contain consecutive hyphens",
      }
    )
    .transform((val) => val.toLowerCase().trim()),

  stripeId: z
    .string()
    .trim()
    .min(1, "Stripe ID is required")
    .startsWith("acct_", { message: 'Stripe ID must start with "acct_".' }),
});

// Type inference for TypeScript
export type AccountDeploymentFormData = z.infer<typeof accountDeploymentSchema>;

// Validation helper functions
export const validateAccountDeployment = (data: unknown) => {
  return accountDeploymentSchema.safeParse(data);
};

export const validateAccountDeploymentField = (
  field: keyof AccountDeploymentFormData,
  value: string
) => {
  const fieldSchema = accountDeploymentSchema.shape[field];

  return fieldSchema.safeParse(value);
};
