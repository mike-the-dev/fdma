"use client";

import { formOptions, useForm } from "@tanstack/react-form";
import React from "react";
import { addToast } from "@heroui/toast";
import { Icon } from "@iconify/react";

import {
  CreateAccountUserResponse,
  AccountUserCreationFormData,
  AccountUserCreationValidators,
  AccountUserRole,
} from "../_shared/accountUsers.types";
import { accountUserCreationSchema } from "../_shared/accountUsers.schema";
import {
  validateEmailAddress,
  validateFirstName,
  validateLastName,
  validatePassword,
  validateRole,
} from "../_shared/accountUsers.validators";
import { useCreateAccountUser } from "../accountUsers.service";

export interface UseAccountUserCreationFormReturn {
  form: any;
  validators: AccountUserCreationValidators;
  isPending: boolean;
  error: string | null;
  handleFormSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const useAccountUserCreationForm = (
  accountId: string,
  onUserCreated?: () => Promise<void> | void
): UseAccountUserCreationFormReturn => {
  const mutation = useCreateAccountUser();

  const formOpts = formOptions({
    defaultValues: {
      emailAddress: "",
      password: "",
      firstName: "",
      lastName: "",
      role: "",
    },
  });

  const form = useForm({
    ...formOpts,
    onSubmit: async ({ value }: { value: AccountUserCreationFormData }) => {
      try {
        const payload = accountUserCreationSchema.parse(value);
        const normalizedAccountId = accountId.startsWith("A#")
          ? accountId
          : `A#${accountId}`;

        const response: CreateAccountUserResponse = await mutation.mutateAsync({
          accountID: normalizedAccountId,
          emailAddress: payload.emailAddress,
          password: payload.password,
          firstName: payload.firstName,
          lastName: payload.lastName,
          role: payload.role as AccountUserRole,
        });

        addToast({
          title: "User Added",
          description: `Created user ${response.authorization.user.emailAddress} successfully.`,
          icon: React.createElement(Icon, {
            icon: "lucide:user-check",
            width: 24,
          }),
          severity: "success",
          color: "success",
          timeout: 5000,
        });

        form.reset();

        if (onUserCreated) await onUserCreated();
      } catch (error) {
        console.error("[useAccountUserCreationForm]", error);

        addToast({
          title: "Create User Failed",
          description: "Failed to create account user. Please verify inputs.",
          icon: React.createElement(Icon, {
            icon: "lucide:alert-circle",
            width: 24,
          }),
          severity: "danger",
          color: "danger",
          timeout: 5000,
        });
      }
    },
  });

  const validators: AccountUserCreationValidators = {
    emailAddress: {
      onChange: ({ value }: { value: string }) => validateEmailAddress(value),
    },
    password: {
      onChange: ({ value }: { value: string }) => validatePassword(value),
    },
    firstName: {
      onChange: ({ value }: { value: string }) => validateFirstName(value),
    },
    lastName: {
      onChange: ({ value }: { value: string }) => validateLastName(value),
    },
    role: {
      onChange: ({ value }: { value: string }) => validateRole(value),
    },
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
  };

  const errorMessage = (mutation.error as any)?.message || null;

  return {
    form,
    validators,
    isPending: mutation.isPending,
    error: errorMessage,
    handleFormSubmit,
  };
};
