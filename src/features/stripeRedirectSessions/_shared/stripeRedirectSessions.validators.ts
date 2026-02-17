import { stripeRedirectSessionCreationSchema } from "./stripeRedirectSessions.schema";

const validateField = (
  field: "stripeId" | "customerName" | "companyName" | "email",
  value: string
): string | undefined => {
  const result = stripeRedirectSessionCreationSchema.safeParse({
    stripeId: field === "stripeId" ? value : "acct_1ABCDEF",
    customerName: field === "customerName" ? value : "Jane Doe",
    companyName: field === "companyName" ? value : "Acme Dental",
    email: field === "email" ? value : "jane@acmedental.com",
    sendEmail: false,
  });

  if (result.success) return undefined;

  const issue = result.error.issues.find((item) => item.path[0] === field);
  return issue?.message;
};

export const validateStripeId = (value: string): string | undefined =>
  validateField("stripeId", value);

export const validateCustomerName = (value: string): string | undefined =>
  validateField("customerName", value);

export const validateCompanyName = (value: string): string | undefined =>
  validateField("companyName", value);

export const validateEmail = (value: string): string | undefined =>
  validateField("email", value);
