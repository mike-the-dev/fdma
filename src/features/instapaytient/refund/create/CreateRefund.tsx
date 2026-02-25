"use client";

import React from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Spacer } from "@heroui/spacer";
import { Checkbox } from "@heroui/checkbox";
import { Divider } from "@heroui/divider";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
} from "@heroui/dropdown";

import { RefundReason } from "../_shared/refund.types";

import { useRefundCreationForm } from "./useRefundCreationForm";

interface CreateRefundProps {
  accountId: string;
  businessName?: string;
  initialChargeId?: string;
  initialAmount?: number;
  initialOrderNumber?: string;
  onRefundCreated?: () => Promise<void> | void;
}

const CreateRefund = ({
  accountId,
  businessName,
  initialChargeId,
  initialAmount,
  initialOrderNumber,
  onRefundCreated,
}: CreateRefundProps): React.ReactElement => {
  const { form, validators, isPending, error, refund, handleFormSubmit } =
    useRefundCreationForm(
      accountId,
      initialChargeId,
      initialAmount,
      initialOrderNumber,
      onRefundCreated
    );
  const [isConfirmed, setIsConfirmed] = React.useState<boolean>(false);

  React.useEffect(() => {
    setIsConfirmed(false);
  }, [accountId, initialAmount, initialChargeId, initialOrderNumber]);

  const formattedAmount =
    typeof initialAmount === "number" ? initialAmount.toFixed(2) : "0.00";
  const displayOrderNumber = initialOrderNumber || "-";
  const displayBusinessName = businessName || "this business";
  const reasonOptions: Array<{ key: RefundReason; label: string }> = [
    { key: "duplicate", label: "Duplicate" },
    { key: "fraudulent", label: "Fraudulent" },
    { key: "requested_by_customer", label: "Requested by Customer" },
  ];
  const reasonLabelByKey: Record<RefundReason, string> = {
    duplicate: "Duplicate",
    fraudulent: "Fraudulent",
    requested_by_customer: "Requested by Customer",
  };

  return (
    <div>
      <h3>Refund Confirmation</h3>
      <p>Review refund details before initiating a refund contract.</p>
      <Spacer y={4} />
      <Divider />
      <Spacer y={4} />

      <form autoComplete="off" onSubmit={handleFormSubmit}>
        <div className="space-y-3">
          <div>
            <p className="text-xs text-foreground-500">Account ID</p>
            <p className="text-sm font-medium">{accountId || "-"}</p>
          </div>
          <div>
            <p className="text-xs text-foreground-500">Charge ID</p>
            <p className="text-sm font-medium">{initialChargeId || "-"}</p>
          </div>
          <div>
            <p className="text-xs text-foreground-500">Order Number</p>
            <p className="text-sm font-medium">{displayOrderNumber}</p>
          </div>
          <div>
            <p className="text-xs text-foreground-500">Amount</p>
            <p className="text-sm font-medium">${formattedAmount}</p>
          </div>
        </div>

        <Spacer y={4} />

        <form.Field name="reason" validators={validators.reason}>
          {(field: any) => (
            <div className="space-y-2">
              <p className="text-sm text-foreground-500">Reason</p>
              <Dropdown>
                <DropdownTrigger>
                  <Button className="w-full justify-between" variant="bordered">
                    <span>
                      {field.state.value
                        ? reasonLabelByKey[field.state.value as RefundReason]
                        : "Select reason"}
                    </span>
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Refund reason"
                  onAction={(key) => field.handleChange(String(key))}
                >
                  <DropdownSection title="Reasons">
                    {reasonOptions.map((option) => (
                      <DropdownItem key={option.key}>{option.label}</DropdownItem>
                    ))}
                  </DropdownSection>
                </DropdownMenu>
              </Dropdown>
              {field.state.meta.errors[0] ? (
                <p className="text-sm text-danger">{field.state.meta.errors[0]}</p>
              ) : null}
            </div>
          )}
        </form.Field>

        <Spacer y={4} />

        <form.Field name="internalNote" validators={validators.internalNote}>
          {(field: any) => (
            <div className="space-y-2">
              <p className="text-sm text-foreground-500">
                Internal Note (Optional Free-Text)
              </p>
              <textarea
                className="w-full rounded-medium border border-default-200 bg-transparent p-3 text-sm outline-none"
                placeholder="Add internal details (optional)"
                rows={4}
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
              />
              {field.state.meta.errors[0] ? (
                <p className="text-sm text-danger">{field.state.meta.errors[0]}</p>
              ) : null}
            </div>
          )}
        </form.Field>

        <Spacer y={4} />

        <Checkbox isSelected={isConfirmed} onValueChange={setIsConfirmed}>
          {`I confirm this data is correct and want to initate a refund contract with the ${displayBusinessName} for amount of $${formattedAmount} of order #${displayOrderNumber}.`}
        </Checkbox>

        <Spacer y={4} />
        <Divider />
        <Spacer y={4} />

        <div>
          <Button
            color="primary"
            isDisabled={isPending || !isConfirmed}
            type="submit"
            variant="shadow"
          >
            {isPending ? "Initating..." : "Initate Refund"}
          </Button>
        </div>
      </form>

      {error && (
        <>
          <Spacer y={4} />
          <p className="text-sm text-danger">{error}</p>
        </>
      )}

      {refund && (
        <>
          <Spacer y={6} />
          <div className="flex w-full flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <p className="text-sm text-foreground-500">Refund ID</p>
              <Input isReadOnly value={refund.id} />
            </div>
            <div className="flex-1">
              <p className="text-sm text-foreground-500">Status</p>
              <Input isReadOnly value={refund.status ?? "unknown"} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CreateRefund;
