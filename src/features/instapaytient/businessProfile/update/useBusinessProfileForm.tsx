"use client";

import { formOptions, useForm } from "@tanstack/react-form";
import React from "react";
import { addToast } from "@heroui/toast";
import { Icon } from "@iconify/react";

import {
  BusinessProfileFormData,
  BusinessProfileValidators,
} from "../businessProfile.schema";
import { useUpdateStripeAccountMcc } from "../businessProfile.service";
import { validateMccCode } from "../businessProfile.validators";

export interface UseBusinessProfileFormReturn {
  form: any;
  validators: BusinessProfileValidators;
  isPending: boolean;
  error: string | null;
  handleFormSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

interface UseBusinessProfileFormProps {
  stripeAccountId: string;
  initialMccCode: string;
}

export const useBusinessProfileForm = (
  props: UseBusinessProfileFormProps
): UseBusinessProfileFormReturn => {
  const { stripeAccountId, initialMccCode } = props;
  const mutation = useUpdateStripeAccountMcc();

  const formOpts = formOptions({
    defaultValues: {
      mccCode: initialMccCode,
    },
  });

  const form = useForm({
    ...formOpts,
    onSubmit: async ({ value }: { value: BusinessProfileFormData }) => {
      try {
        await mutation.mutateAsync({
          id: stripeAccountId,
          mcc: value.mccCode,
        });

        // Show success toast
        addToast({
          title: "MCC Updated Successfully",
          description: "The MCC code has been updated successfully!",
          icon: React.createElement(Icon, {
            icon: "lucide:check-circle",
            width: 24,
          }),
          severity: "success",
          color: "success",
          timeout: 5000,
        });

        // Reset after submit
        form.reset();
      } catch (error: any) {
        console.error("Error updating MCC: ", error);

        // If it's a token expiration error, don't show error message as user will be logged out
        if (error.isTokenExpired) {
          return;
        }

        // Show error toast
        addToast({
          title: "Update Failed",
          description: "Failed to update MCC code. Please try again.",
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

  const validators: BusinessProfileValidators = {
    mccCode: {
      onChange: ({ value }: { value: string }) => validateMccCode(value),
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

