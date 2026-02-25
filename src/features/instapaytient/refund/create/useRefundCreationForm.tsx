"use client";

import { formOptions, useForm } from "@tanstack/react-form";
import React, { useEffect, useState } from "react";
import { addToast } from "@heroui/toast";
import { Icon } from "@iconify/react";

import {
  CreateRefundResponse,
  RefundReason,
  RefundCreationFormData,
  RefundCreationValidators,
} from "../_shared/refund.types";
import { refundCreationSchema } from "../_shared/refund.schema";
import {
  validateAccountId,
  validateAmount,
  validatePaymentId,
  validateInternalNote,
  validateOrderNumber,
  validateReason,
} from "../_shared/refund.validators";
import { toRefundError } from "../_shared/refund.errors";
import { useProcessRefund } from "../refund.service";

export interface UseRefundCreationFormReturn {
  form: any;
  validators: RefundCreationValidators;
  isPending: boolean;
  error: string | null;
  refund: CreateRefundResponse | null;
  handleFormSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const useRefundCreationForm = (
  accountId: string,
  initialChargeId?: string,
  initialAmount?: number,
  initialOrderNumber?: string,
  onRefundCreated?: () => Promise<void> | void
): UseRefundCreationFormReturn => {
  const mutation = useProcessRefund();
  const [refund, setRefund] = useState<CreateRefundResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const emptyReason: "" | RefundReason = "";
  const defaultValues: RefundCreationFormData = {
    accountId,
    paymentId: initialChargeId ?? "",
    orderNumber: initialOrderNumber ?? "",
    reason: emptyReason,
    internalNote: "",
    amount:
      typeof initialAmount === "number" && Number.isFinite(initialAmount)
        ? initialAmount.toFixed(2)
        : "",
  };
  const formOpts = formOptions({
    defaultValues,
  });

  const form = useForm({
    ...formOpts,
    onSubmit: async ({ value }: { value: RefundCreationFormData }) => {
      try {
        setError(null);
        const payload = refundCreationSchema.parse(value);
        const normalizedAccountId = payload.accountId.startsWith("A#")
          ? payload.accountId
          : `A#${payload.accountId}`;
        const amountInCents = Math.round(payload.amount * 100);
        const requestPayload = {
          accountId: normalizedAccountId,
          paymentId: payload.paymentId,
          amount: amountInCents,
          orderNumber: payload.orderNumber?.trim() || undefined,
          reason: payload.reason,
          internalNote: payload.internalNote?.trim() || undefined,
        };

        console.log("[useRefundCreationForm] Refund request payload:", requestPayload);
        setRefund(null);

        addToast({
          title: "Refund Payload Logged",
          description: "Request payload logged to console for testing.",
          icon: React.createElement(Icon, {
            icon: "lucide:check-circle",
            width: 24,
          }),
          severity: "success",
          color: "success",
          timeout: 5000,
        });

        form.reset();

        if (onRefundCreated) await onRefundCreated();
      } catch (submitError: unknown) {
        const mapped = toRefundError(submitError);

        setError(mapped.message);
        console.error("[useRefundCreationForm]", mapped.message);

        addToast({
          title: "Refund Failed",
          description: mapped.message || "Failed to process refund. Please try again.",
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

  const validators: RefundCreationValidators = {
    accountId: {
      onChange: ({ value }: { value: string }) => validateAccountId(value),
    },
    paymentId: {
      onChange: ({ value }: { value: string }) => validatePaymentId(value),
    },
    amount: {
      onChange: ({ value }: { value: string }) => validateAmount(value),
    },
    orderNumber: {
      onChange: ({ value }: { value: string }) => validateOrderNumber(value),
    },
    reason: {
      onChange: ({ value }: { value: string }) => validateReason(value),
    },
    internalNote: {
      onChange: ({ value }: { value: string }) => validateInternalNote(value),
    },
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
  };

  useEffect(() => {
    form.reset({
      accountId,
      paymentId: initialChargeId ?? "",
      orderNumber: initialOrderNumber ?? "",
      reason: emptyReason,
      internalNote: "",
      amount:
        typeof initialAmount === "number" && Number.isFinite(initialAmount)
          ? initialAmount.toFixed(2)
          : "",
    });
  }, [accountId, emptyReason, form, initialAmount, initialChargeId, initialOrderNumber]);

  return {
    form,
    validators,
    isPending: mutation.isPending,
    error: error || ((mutation.error as any)?.message ?? null),
    refund,
    handleFormSubmit,
  };
};
