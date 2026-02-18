"use client";

import React, { useState } from "react";
import { addToast } from "@heroui/toast";
import { Icon } from "@iconify/react";

import { useRefreshStripeRedirectSession } from "../stripeRedirectSessions.service";

export type UseStripeRedirectSessionRefreshReturn = {
  handleRefresh: (sessionId: string, companyName: string) => Promise<void>;
  isRefreshing: (sessionId: string) => boolean;
};

export const useStripeRedirectSessionRefresh = (): UseStripeRedirectSessionRefreshReturn => {
  const mutation = useRefreshStripeRedirectSession();
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  const handleRefresh = async (
    sessionId: string,
    companyName: string
  ): Promise<void> => {
    setActiveSessionId(sessionId);

    try {
      await mutation.mutateAsync({ sessionId });

      addToast({
        title: "Session Refreshed",
        description: `Stripe redirect session refreshed for ${companyName}.`,
        icon: React.createElement(Icon, {
          icon: "lucide:check-circle",
          width: 24,
        }),
        severity: "success",
        color: "success",
        timeout: 5000,
      });
    } catch (error: any) {
      console.error("Error refreshing Stripe redirect session: ", error);

      addToast({
        title: "Refresh Failed",
        description: `Failed to refresh Stripe redirect session for ${companyName}. Please try again.`,
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

  const isRefreshing = (sessionId: string): boolean => {
    return mutation.isPending && activeSessionId === sessionId;
  };

  return {
    handleRefresh,
    isRefreshing,
  };
};
