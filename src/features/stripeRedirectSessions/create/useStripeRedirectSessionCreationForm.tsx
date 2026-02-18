"use client";

import { formOptions, useForm } from "@tanstack/react-form";
import React, { useState } from "react";
import { addToast } from "@heroui/toast";
import { Icon } from "@iconify/react";

import {
  CreateStripeRedirectSessionResponse,
  StripeRedirectSessionCreationFormData,
  StripeRedirectSessionCreationValidators,
} from "../_shared/stripeRedirectSessions.types";
import {
  validateCompanyName,
  validateCustomerName,
  validateEmail,
  validateStripeId,
} from "../_shared/stripeRedirectSessions.validators";
import { stripeRedirectSessionCreationSchema } from "../_shared/stripeRedirectSessions.schema";
import { useCreateStripeRedirectSession } from "../stripeRedirectSessions.service";

export interface UseStripeRedirectSessionCreationFormReturn {
  form: any;
  validators: StripeRedirectSessionCreationValidators;
  isPending: boolean;
  error: string | null;
  session: CreateStripeRedirectSessionResponse | null;
  handleFormSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const useStripeRedirectSessionCreationForm = (): UseStripeRedirectSessionCreationFormReturn => {
  const mutation = useCreateStripeRedirectSession();
  const [session, setSession] = useState<CreateStripeRedirectSessionResponse | null>(null);

  const formOpts = formOptions({
    defaultValues: {
      stripeId: "",
      customerName: "",
      companyName: "",
      email: "",
      sendEmail: false,
    },
  });

  const form = useForm({
    ...formOpts,
    onSubmit: async ({ value }: { value: StripeRedirectSessionCreationFormData }) => {
      try {
        const payload = stripeRedirectSessionCreationSchema.parse(value);

        const response = await mutation.mutateAsync({
          stripeId: payload.stripeId,
          customerName: payload.customerName,
          companyName: payload.companyName,
          email: payload.email,
          sendEmail: payload.sendEmail,
        });

        setSession(response);

        addToast({
          title: "Session Created",
          description: "Stripe redirect session created successfully.",
          icon: React.createElement(Icon, {
            icon: "lucide:check-circle",
            width: 24,
          }),
          severity: "success",
          color: "success",
          timeout: 5000,
        });

        form.reset();
      } catch (error: any) {
        console.error("Error creating Stripe redirect session: ", error);

        addToast({
          title: "Creation Failed",
          description: "Failed to create Stripe redirect session. Please try again.",
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

  const validators: StripeRedirectSessionCreationValidators = {
    stripeId: {
      onChange: ({ value }: { value: string }) => validateStripeId(value),
    },
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
