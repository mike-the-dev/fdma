"use client";

import React from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Spacer } from "@heroui/spacer";
import { Checkbox } from "@heroui/checkbox";
import { Divider } from "@heroui/divider";

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
  const { form, isPending, error, refund, handleFormSubmit } =
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
