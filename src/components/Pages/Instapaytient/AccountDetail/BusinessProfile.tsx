"use client";

import React from "react";
import { Icon } from "@iconify/react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { formOptions, useForm } from "@tanstack/react-form";

import { StripeAccount } from "@/features/instapaytient/account/account.schema";
import { Select, SelectItem } from "@heroui/select";
import { MCC_CODES_ALL } from "@/utils/mccCodes.all";
import { Button } from "@heroui/button";

interface BusinessProfileProps {
  stripeAccount: StripeAccount | null;
  stripeAccountLoading: boolean;
  stripeAccountError: string | null;
};

export const BusinessProfile: React.FC<BusinessProfileProps> = ({
  stripeAccount,
  stripeAccountLoading,
  stripeAccountError,
}) => {
  const formOpts = formOptions({
    defaultValues: {
      mccCode: stripeAccount?.business_profile?.mcc ?? "",
    },
  });

  const form = useForm({
    ...formOpts,
    onSubmit: async ({ value }: { value: { mccCode: string } }) => {
      console.log("UPDATE_MCC_HANDLER_CALLED", value);
      // TODO: Implement MCC update logic
    },
  });

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
  };

  const getMccByCode = (mccCodes: readonly { code: string; description: string }[], code: string): { code: string; description: string } | undefined => {
    return mccCodes.find((mcc) => mcc.code === code);
  };

  // Handle loading state
  if (stripeAccountLoading) {
    return (
      <Card className="mb-8">
        <CardBody className="flex items-center justify-center py-8">
          <div className="text-center">
            <Icon
              className="text-2xl animate-spin text-primary-500 mb-2"
              icon="lucide:loader-2"
            />
            <p className="text-sm text-gray-500">
              Loading bank account details...
            </p>
          </div>
        </CardBody>
      </Card>
    );
  };

  // Handle error state
  if (stripeAccountError) {
    return (
      <Card className="mb-8">
        <CardBody className="flex items-center justify-center py-8">
          <div className="text-center">
            <Icon
              className="text-2xl text-danger-500 mb-2"
              icon="lucide:alert-circle"
            />
            <p className="text-sm text-danger-500">{stripeAccountError}</p>
          </div>
        </CardBody>
      </Card>
    );
  };

  // Handle no bank account
  if (!stripeAccount?.business_profile?.mcc) {
    return (
      <Card className="mb-8">
        <CardBody className="flex items-center justify-center py-8">
          <div className="text-center">
            <Icon
              className="text-2xl text-gray-400 mb-2"
              icon="lucide:credit-card"
            />
            <p className="text-sm text-gray-500">No MCC has been set for this account.</p>
          </div>
        </CardBody>
      </Card>
    );
  };

  const mcc = getMccByCode(
    MCC_CODES_ALL,
    stripeAccount?.business_profile?.mcc ?? "",
  );

  return (
    <Card className="mb-8">
      <CardHeader className="flex flex-row justify-between items-center">
        <div className="flex items-center gap-2">
          <Icon
            className="text-xl text-primary-500"
            icon="lucide:credit-card"
          />
          <h3 className="text-lg font-medium">Stripe Business Profile</h3>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Account Details
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    MCC
                  </span>
                  <span className="font-medium">
                    {mcc
                      ? `${mcc.code} — ${mcc.description.length > 40
                        ? `${mcc.description.slice(0, 40)}...`
                        : mcc.description
                      }`
                      : "Not specified"}
                  </span>
                </div>
                <Divider className="my-2" />
                <div className="flex items-center justify-between">
                  <form autoComplete="off" onSubmit={handleFormSubmit}>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Update MCC
                    </span>
                    <form.Field name="mccCode">
                      {(field: any) => (
                        <Select
                          className="max-w-xs"
                          errorMessage={field.state.meta.errors[0]}
                          isInvalid={!!field.state.meta.errors.length}
                          label="Select MCC CODE"
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
                          {MCC_CODES_ALL.map((mcc) => (
                            <SelectItem key={mcc.code} textValue={`${mcc.code} - ${mcc.description}`}>
                              {`${mcc.code} - ${mcc.description}`}
                            </SelectItem>
                          ))}
                        </Select>
                      )}
                    </form.Field>
                    <Button color="primary" variant="shadow" type="submit">
                      Update MCC
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};