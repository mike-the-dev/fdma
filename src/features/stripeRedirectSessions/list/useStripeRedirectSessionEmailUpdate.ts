"use client";

import React, { useState } from "react";
import { addToast } from "@heroui/toast";
import { Icon } from "@iconify/react";

import { useUpdateStripeRedirectSessionEmail } from "../stripeRedirectSessions.service";
import { validateEmail } from "@/features/onboardingSessionCreation/_shared/onboardingSessionCreation.validators";

export type StripeRedirectSessionEmailState = {
  value: string;
  error: string | null;
};

export type UseStripeRedirectSessionEmailUpdateReturn = {
  getEmailValue: (sessionId: string, fallback: string) => string;
  getEmailError: (sessionId: string) => string | null;
  setEmailValue: (sessionId: string, value: string) => void;
  handleUpdateEmail: (sessionId: string, fallbackEmail: string, companyName: string) => Promise<void>;
  isUpdating: (sessionId: string) => boolean;
};

export const useStripeRedirectSessionEmailUpdate = (): UseStripeRedirectSessionEmailUpdateReturn => {
  const mutation = useUpdateStripeRedirectSessionEmail();
  const [emailState, setEmailState] = useState<Record<string, StripeRedirectSessionEmailState>>({});
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  const getEmailValue = (sessionId: string, fallback: string): string => {
    return emailState[sessionId]?.value ?? fallback;
  };

  const getEmailError = (sessionId: string): string | null => {
    return emailState[sessionId]?.error ?? null;
  };

  const setEmailValue = (sessionId: string, value: string): void => {
    const error = validateEmail(value) ?? null;
    setEmailState((prev) => ({
      ...prev,
      [sessionId]: {
        value,
        error,
      },
    }));
  };

  const handleUpdateEmail = async (
    sessionId: string,
    fallbackEmail: string,
    companyName: string
  ): Promise<void> => {
    const nextValue = getEmailValue(sessionId, fallbackEmail);
    const error = validateEmail(nextValue) ?? null;

    if (error) {
      setEmailState((prev) => ({
        ...prev,
        [sessionId]: {
          value: nextValue,
          error,
        },
      }));

      addToast({
        title: "Invalid Email",
        description: error,
        icon: React.createElement(Icon, {
          icon: "lucide:alert-circle",
          width: 24,
        }),
        severity: "danger",
        color: "danger",
        timeout: 5000,
      });
      return;
    }

    setActiveSessionId(sessionId);

    try {
      const response = await mutation.mutateAsync({
        sessionId,
        email: nextValue,
      });

      setEmailState((prev) => ({
        ...prev,
        [sessionId]: {
          value: response.email,
          error: null,
        },
      }));

      addToast({
        title: "Email Updated",
        description: `Updated email for ${companyName}.`,
        icon: React.createElement(Icon, {
          icon: "lucide:check-circle",
          width: 24,
        }),
        severity: "success",
        color: "success",
        timeout: 5000,
      });
    } catch (error: any) {
      console.error("Error updating Stripe redirect session email: ", error);

      addToast({
        title: "Update Failed",
        description: `Failed to update email for ${companyName}. Please try again.`,
        icon: React.createElement(Icon, {
          icon: "lucide:alert-circle",
          width: 24,
        }),
        severity: "danger",
        color: "danger",
        timeout: 5000,
      });
    } finally {
      setActiveSessionId(null);
    }
  };

  const isUpdating = (sessionId: string): boolean => {
    return mutation.isPending && activeSessionId === sessionId;
  };

  return {
    getEmailValue,
    getEmailError,
    setEmailValue,
    handleUpdateEmail,
    isUpdating,
  };
};
