"use client";

import { formOptions, useForm } from "@tanstack/react-form";
import React, { useState } from "react";
import { addToast } from "@heroui/toast";
import { Icon } from "@iconify/react";

import {
  CreateOnboardingSessionResponse,
  OnboardingSessionCreationFormData,
  OnboardingSessionCreationValidators,
} from "../_shared/onboardingSessionCreation.types";
import {
  validateCompanyName,
  validateCustomerName,
  validateEmail,
} from "../_shared/onboardingSessionCreation.validators";
import { useCreateOnboardingSession } from "../onboardingSessionCreation.service";

export interface UseOnboardingSessionCreationFormReturn {
  form: any;
  validators: OnboardingSessionCreationValidators;
  isPending: boolean;
  error: string | null;
  session: CreateOnboardingSessionResponse | null;
  handleFormSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const useOnboardingSessionCreationForm = (): UseOnboardingSessionCreationFormReturn => {
  const mutation = useCreateOnboardingSession();
  const [session, setSession] = useState<CreateOnboardingSessionResponse | null>(null);

  const formOpts = formOptions({
    defaultValues: {
      customerName: "",
      companyName: "",
      email: "",
    },
  });

  const form = useForm({
    ...formOpts,
    onSubmit: async ({ value }: { value: OnboardingSessionCreationFormData }) => {
      try {
        const response = await mutation.mutateAsync({
          customerName: value.customerName,
          companyName: value.companyName,
          email: value.email,
        });

        setSession(response);

        addToast({
          title: "Session Created",
          description: "Onboarding session created successfully.",
          icon: React.createElement(Icon, {
            icon: "lucide:check-circle",
            width: 24,
          }),
          severity: "success",
          color: "success",
          timeout: 5000,
        });
      } catch (error: any) {
        console.error("Error creating onboarding session: ", error);

        if (error.isTokenExpired) {
          return;
        }

        addToast({
          title: "Creation Failed",
          description: "Failed to create onboarding session. Please try again.",
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

  const validators: OnboardingSessionCreationValidators = {
    customerName: {
      onChange: ({ value }: { value: string }) => validateCustomerName(value),
    },
    companyName: {
      onChange: ({ value }: { value: string }) => validateCompanyName(value),
    },
    email: {
      onChange: ({ value }: { value: string }) => validateEmail(value),
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
    session,
    handleFormSubmit,
  };
};
