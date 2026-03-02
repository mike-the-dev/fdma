"use client";

import React from "react";
import { Icon } from "@iconify/react";
import { addToast } from "@heroui/toast";

import { useUpdateAccountStatus } from "../accountSettings.service";

import { AccountStatus } from "@/types/AccountInstapaytient";

interface UseAccountStatusToggleReturn {
  isEnabled: boolean;
  hasExplicitStatus: boolean;
  isPending: boolean;
  handleToggle: (nextValue: boolean) => Promise<void>;
}

interface BuildStatusPayloadParams {
  isActive: boolean;
}

const buildStatusPayload = ({
  isActive,
}: BuildStatusPayloadParams): { code: string; message: string } => {
  if (isActive) {
    return {
      code: "ACTIVE",
      message: "Account is active.",
    };
  }

  return {
    code: "DISABLED",
    message: "Account has been disabled.",
  };
};

export const useAccountStatusToggle = (
  accountId: string,
  status?: AccountStatus,
  onStatusUpdated?: () => Promise<void> | void
): UseAccountStatusToggleReturn => {
  const mutation = useUpdateAccountStatus();
  const [isEnabled, setIsEnabled] = React.useState<boolean>(false);
  const hasExplicitStatus = Boolean(status?.updatedAt?.trim());

  React.useEffect(() => {
    if (!hasExplicitStatus) {
      setIsEnabled(false);
      return;
    }
    setIsEnabled(status?.isActive ?? false);
  }, [hasExplicitStatus, status?.isActive]);

  const handleToggle = async (nextValue: boolean): Promise<void> => {
    const previousValue = isEnabled;
    const payload = buildStatusPayload({ isActive: nextValue });

    try {
      setIsEnabled(nextValue);

      await mutation.mutateAsync({
        accountId,
        status: {
          isActive: nextValue,
          code: payload.code,
          message: payload.message,
        },
      });

      addToast({
        title: "Account Status Updated",
        description: nextValue ? "Account is now enabled." : "Account is now disabled.",
        icon: React.createElement(Icon, {
          icon: nextValue ? "lucide:toggle-right" : "lucide:toggle-left",
          width: 24,
        }),
        severity: "success",
        color: "success",
        timeout: 5000,
      });

      if (onStatusUpdated) await onStatusUpdated();
    } catch (error) {
      setIsEnabled(previousValue);

      addToast({
        title: "Status Update Failed",
        description: (error as Error)?.message || "Failed to update account status.",
        icon: React.createElement(Icon, {
          icon: "lucide:alert-circle",
          width: 24,
        }),
        severity: "danger",
        color: "danger",
        timeout: 5000,
      });
    }
  };

  return {
    isEnabled,
    hasExplicitStatus,
    isPending: mutation.isPending,
    handleToggle,
  };
};
