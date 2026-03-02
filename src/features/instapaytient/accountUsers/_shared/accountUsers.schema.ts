import { z } from "zod";

export const accountUserCreationSchema = z.object({
  emailAddress: z
    .string()
    .trim()
    .min(1, "Email is required")
    .pipe(z.email("Email must be valid")),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password is too long"),
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(100, "First name is too long"),
  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(100, "Last name is too long"),
  role: z.enum(["Administrator", "Developer", "Marketing"], {
    message: "Role is required",
  }),
});

export type AccountUserCreationSchema = z.infer<typeof accountUserCreationSchema>;

export const listAccountUsersQuerySchema = z.object({
  accountId: z
    .string()
    .trim()
    .min(1, "Account ID is required.")
    .regex(/^A#/, "Invalid Account ID."),
});

export type ListAccountUsersQuerySchema = z.infer<
  typeof listAccountUsersQuerySchema
>;

export const deleteAccountUserQuerySchema = z.object({
  accountId: z
    .string()
    .trim()
    .min(1, "Account ID is required.")
    .regex(/^A#/, "Invalid Account ID."),
  userId: z
    .string()
    .trim()
    .min(1, "User ID is required.")
    .regex(/^U#/, "Invalid User ID."),
});

export type DeleteAccountUserQuerySchema = z.infer<
  typeof deleteAccountUserQuerySchema
>;
