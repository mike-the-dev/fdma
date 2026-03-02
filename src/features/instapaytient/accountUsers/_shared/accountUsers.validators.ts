import { accountUserCreationSchema } from "./accountUsers.schema";

const validateField = (
  field: "emailAddress" | "password" | "firstName" | "lastName" | "role",
  value: string
): string | undefined => {
  const result = accountUserCreationSchema.safeParse({
    emailAddress: field === "emailAddress" ? value : "admin@example.com",
    password: field === "password" ? value : "StrongPassword123!",
    firstName: field === "firstName" ? value : "Jane",
    lastName: field === "lastName" ? value : "Doe",
    role: field === "role" ? value : "Administrator",
  });

  if (result.success) return undefined;

  const issue = result.error.issues.find((item) => item.path[0] === field);

  return issue?.message;
};

export const validateEmailAddress = (value: string): string | undefined =>
  validateField("emailAddress", value);

export const validatePassword = (value: string): string | undefined =>
  validateField("password", value);

export const validateFirstName = (value: string): string | undefined =>
  validateField("firstName", value);

export const validateLastName = (value: string): string | undefined =>
  validateField("lastName", value);

export const validateRole = (value: string): string | undefined =>
  validateField("role", value);
