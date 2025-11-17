"use client";

import { Card } from "@heroui/card";
import { Spacer } from "@heroui/spacer";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { Slider } from "@heroui/slider";
import { NumberInput } from "@heroui/number-input";

import { useCustomerInsightsForm } from "@/features/customerInsights/create/useCustomerInsightsForm";

const CustomerInsights = (): React.ReactElement => {
  const { form, validators, isPending, handleFormSubmit, accounts } =
    useCustomerInsightsForm();

  return (
    <Card
      isBlurred
      className="border-none bg-background/60 dark:bg-default-100/50"
      shadow="sm"
      style={{ padding: "12px 12px 12px 12px", width: "100%" }}
    >
      <h3>Customer Insights</h3>
      <p>Set analytics targets for an account.</p>
      <Spacer y={4} />

      <form autoComplete="off" onSubmit={handleFormSubmit}>
        <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
          <div className="flex-1">
            <form.Field name="accountId" validators={validators.accountId}>
              {(field: any) => (
                <Select
                  errorMessage={field.state.meta.errors[0]}
                  isInvalid={!!field.state.meta.errors.length}
                  label="Account"
                  placeholder="Select an account"
                  selectedKeys={
                    field.state.value ? new Set([field.state.value]) : new Set()
                  }
                  onSelectionChange={(keys) => {
                    const selectedValue = Array.from(keys)[0] as
                      | string
                      | undefined;

                    field.handleChange(selectedValue ?? "");
                  }}
                >
                  {(accounts ?? []).map((acct) => (
                    <SelectItem key={acct.id}>{acct.name}</SelectItem>
                  ))}
                </Select>
              )}
            </form.Field>
          </div>
        </div>

        <Spacer y={4} />

        <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
          <div className="flex-1">
            <form.Field
              name="avgSpentDollars"
              validators={validators.avgSpentDollars}
            >
              {(field: any) => (
                <NumberInput
                  className="w-full"
                  errorMessage={field.state.meta.errors[0]}
                  formatOptions={{
                    style: "currency",
                    currency: "USD",
                  }}
                  isInvalid={!!field.state.meta.errors.length}
                  label="Average Spent Target"
                  value={
                    field.state.value && field.state.value.trim() !== ""
                      ? Number(field.state.value)
                      : 0
                  }
                  onValueChange={(value) => {
                    // Update with the value, converting to string for form state
                    if (
                      value !== null &&
                      value !== undefined &&
                      !isNaN(value)
                    ) {
                      field.handleChange(String(value));
                    } else {
                      field.handleChange("");
                    }
                  }}
                />
              )}
            </form.Field>
          </div>
        </div>

        <Spacer y={4} />

        <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
          <div className="flex-1">
            <form.Field
              name="subscriptionRatePercent"
              validators={validators.subscriptionRatePercent}
            >
              {(field: any) => (
                <Card className="p-4">
                  <Slider
                    showTooltip
                    className="w-full"
                    classNames={{
                      base: "max-w-full",
                    }}
                    label="Subscription Email Rate Target (%)"
                    maxValue={100}
                    minValue={0}
                    step={1}
                    value={field.state.value ? Number(field.state.value) : 0}
                    onChange={(value) => {
                      const numValue = Array.isArray(value) ? value[0] : value;

                      field.handleChange(String(numValue));
                    }}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-danger text-sm mt-1">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
                </Card>
              )}
            </form.Field>
          </div>
          <div className="flex-1">
            <form.Field
              name="repeatRatePercent"
              validators={validators.repeatRatePercent}
            >
              {(field: any) => (
                <Card className="p-4">
                  <Slider
                    showTooltip
                    className="w-full"
                    classNames={{
                      base: "max-w-full",
                    }}
                    label="Repeat Customer Rate Target (%)"
                    maxValue={100}
                    minValue={0}
                    step={1}
                    value={field.state.value ? Number(field.state.value) : 0}
                    onChange={(value) => {
                      const numValue = Array.isArray(value) ? value[0] : value;

                      field.handleChange(String(numValue));
                    }}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-danger text-sm mt-1">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
                </Card>
              )}
            </form.Field>
          </div>
        </div>

        <Spacer y={4} />

        <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
          <div className="flex-1">
            <form.Field
              name="retentionRatePercent"
              validators={validators.retentionRatePercent}
            >
              {(field: any) => (
                <Card className="p-4">
                  <Slider
                    showTooltip
                    className="w-full"
                    classNames={{
                      base: "max-w-full",
                    }}
                    label="Retention Customer Rate Target (%)"
                    maxValue={100}
                    minValue={0}
                    step={1}
                    value={field.state.value ? Number(field.state.value) : 0}
                    onChange={(value) => {
                      const numValue = Array.isArray(value) ? value[0] : value;

                      field.handleChange(String(numValue));
                    }}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-danger text-sm mt-1">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
                </Card>
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
            {isPending ? "Saving..." : "Save Targets"}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default CustomerInsights;

export { CustomerInsights };