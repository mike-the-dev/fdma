import { z } from "zod";

export const onboardingSessionCreationSchema = z.object({
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
});

export type OnboardingSessionCreationSchema = z.infer<
  typeof onboardingSessionCreationSchema
>;
