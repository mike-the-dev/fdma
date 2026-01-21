import { onboardingSessionCreationSchema } from "./onboardingSessionCreation.schema";

const validateField = (field: "customerName" | "companyName" | "email", value: string): string | undefined => {
  const result = onboardingSessionCreationSchema.safeParse({
    customerName: field === "customerName" ? value : "placeholder",
    companyName: field === "companyName" ? value : "placeholder",
    email: field === "email" ? value : "placeholder@example.com",
  });

  if (result.success) return undefined;

  const issue = result.error.issues.find((item) => item.path[0] === field);
  return issue?.message;
};

export const validateCustomerName = (value: string): string | undefined =>
  validateField("customerName", value);

export const validateCompanyName = (value: string): string | undefined =>
  validateField("companyName", value);

export const validateEmail = (value: string): string | undefined =>
  validateField("email", value);
