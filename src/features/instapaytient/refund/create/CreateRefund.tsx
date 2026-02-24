"use client";

import React from "react";
import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import { Input } from "@heroui/input";
import { Spacer } from "@heroui/spacer";

import { useRefundCreationForm } from "./useRefundCreationForm";

interface CreateRefundProps {
  accountId: string;
  initialChargeId?: string;
  initialAmount?: number;
  onRefundCreated?: () => Promise<void> | void;
}

const CreateRefund = ({
  accountId,
  initialChargeId,
  initialAmount,
  onRefundCreated,
}: CreateRefundProps): React.ReactElement => {
  const { form, validators, isPending, error, refund, handleFormSubmit } =
    useRefundCreationForm(
      accountId,
      initialChargeId,
      initialAmount,
      onRefundCreated
    );

  return (
    <Card
      isBlurred
      className="border-none bg-background/60 dark:bg-default-100/50"
      shadow="sm"
      style={{ padding: "12px 12px 12px 12px", width: "100%" }}
    >
      <h3>Refund Creation</h3>
      <p>Create a refund from an existing Stripe charge.</p>
      <Spacer y={4} />

      <form autoComplete="off" onSubmit={handleFormSubmit}>
        <div className="flex w-full flex-col gap-4 md:flex-row">
          <div className="flex-1">
            <form.Field name="accountId" validators={validators.accountId}>
              {(field: any) => (
                <Input
                  label="Account ID"
                  errorMessage={field.state.meta.errors[0]}
                  isInvalid={!!field.state.meta.errors.length}
                  isReadOnly
                  value={field.state.value}
                  onValueChange={(value) => field.handleChange(value)}
                />
              )}
            </form.Field>
          </div>
          <div className="flex-1">
            <form.Field name="chargeId" validators={validators.chargeId}>
              {(field: any) => (
                <Input
                  label="Charge ID"
                  placeholder="ch_..."
                  errorMessage={field.state.meta.errors[0]}
                  isInvalid={!!field.state.meta.errors.length}
                  value={field.state.value}
                  onValueChange={(value) => field.handleChange(value)}
                />
              )}
            </form.Field>
          </div>
          <div className="flex-1">
            <form.Field name="amount" validators={validators.amount}>
              {(field: any) => (
                <Input
                  label="Amount"
                  placeholder="0.00"
                  type="number"
                  errorMessage={field.state.meta.errors[0]}
                  isInvalid={!!field.state.meta.errors.length}
                  value={field.state.value}
                  onValueChange={(value) => field.handleChange(value)}
                />
              )}
            </form.Field>
          </div>
        </div>

        <Spacer y={4} />

        <div>
          <Button
            color="primary"
            isDisabled={isPending}
            type="submit"
            variant="shadow"
          >
            {isPending ? "Creating..." : "Create Refund"}
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
    </Card>
  );
};

export default CreateRefund;
