"use client";

import { formOptions, useForm } from "@tanstack/react-form";
import React from "react";
import { addToast } from "@heroui/toast";
import { Icon } from "@iconify/react";
import { CustomerInsightsFormData, CustomerInsightsValidators } from "../_shared/customerInsights.schema";
import { useUpdateAnalyticsTargets, useAccounts } from "../customerInsights.service";
import { validateAccountId, validateDollars, validatePercent } from "../_shared/customerInsights.validators";
import { mapFormToTargets } from "../_shared/customerInsights.mappers";

export interface UseCustomerInsightsFormReturn {
  form: any;
  validators: CustomerInsightsValidators;
  isPending: boolean;
  error: string | null;
  handleFormSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  accounts: { id: string; name: string }[] | undefined;
}

export const useCustomerInsightsForm = (): UseCustomerInsightsFormReturn => {
  const mutation = useUpdateAnalyticsTargets();
  const { data: accounts } = useAccounts();

  const formOpts = formOptions({
    defaultValues: {
      accountId: "",
      avgSpentDollars: "",
      subscriptionRatePercent: "",
      repeatRatePercent: "",
      retentionRatePercent: "",
    },
  });

  const form = useForm({
    ...formOpts,
    onSubmit: async ({ value }: { value: CustomerInsightsFormData }) => {
      try {
        const payload = mapFormToTargets(value);
        await mutation.mutateAsync({ accountId: value.accountId, data: payload });
        
        // Show success toast
        addToast({
          title: "Targets Saved Successfully",
          description: "Analytics targets have been updated successfully!",
          icon: React.createElement(Icon, { icon: "lucide:check-circle", width: 24 }),
          severity: "success",
          color: "success",
          timeout: 5000,
        });
        
        // Reset after submit
        form.reset();
      } catch (error: any) {
        console.error("Error updating analytics targets: ", error);
        
        // If it's a token expiration error, don't show error message as user will be logged out
        if (error.isTokenExpired) {
          return;
        }
        
        // Show error toast
        addToast({
          title: "Update Failed",
          description: "Failed to update analytics targets. Please try again.",
          icon: React.createElement(Icon, { icon: "lucide:alert-circle", width: 24 }),
          severity: "danger",
          color: "danger",
          timeout: 5000,
        });
      }
    },
  });

  const validators: CustomerInsightsValidators = {
    accountId: { onChange: ({ value }: { value: string }) => validateAccountId(value) },
    avgSpentDollars: { onChange: ({ value }: { value: string }) => validateDollars(value) },
    subscriptionRatePercent: { onChange: ({ value }: { value: string }) => validatePercent(value) },
    repeatRatePercent: { onChange: ({ value }: { value: string }) => validatePercent(value) },
    retentionRatePercent: { onChange: ({ value }: { value: string }) => validatePercent(value) },
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
    accounts,
  };
};


