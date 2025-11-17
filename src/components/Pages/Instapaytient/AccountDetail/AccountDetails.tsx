import React from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Icon } from "@iconify/react";
import { Divider } from "@heroui/divider";

export const AccountDetails: React.FC<any> = ({ account }) => {
  return (
    <div className="mb-0">
      <Card className="overflow-visible">
        <CardHeader className="flex flex-col gap-3 pb-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-2xl font-semibold">{account.name}</h3>
              <div className="flex flex-col gap-2 sm:flex-row">
                <p className="text-sm text-gray-500 mt-1">
                  {account.company} • {account.state}
                </p>
                <Chip
                  className="self-start sm:self-center mt-1 sm:mt-0"
                  color="primary"
                  size="sm"
                  variant="flat"
                >
                  ID: {account.id}
                </Chip>
              </div>
            </div>
          </div>
        </CardHeader>

        <Divider />

        <CardBody className="px-10">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="pb-6 md:pr-6">
              <h4 className="mb-4 text-base font-medium text-white">
                Account Information
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-50">
                    <Icon className="text-primary-500" icon="lucide:id-card" />
                  </div>
                  <span>ID: {account.id}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-50">
                    <Icon className="text-primary-500" icon="lucide:building" />
                  </div>
                  <span>Company: {account.company}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-50">
                    <Icon className="text-primary-500" icon="lucide:map-pin" />
                  </div>
                  <span>State: {account.state}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 md:pt-0 md:pl-6">
              <div className="mb-4 flex items-center gap-3">
                <h4 className="text-base font-medium text-white">
                  Payout Information
                </h4>
                <Chip
                  color={account.payout ? "success" : "danger"}
                  size="sm"
                  startContent={
                    account.payout ? (
                      <Icon icon="lucide:check-circle" />
                    ) : (
                      <Icon icon="lucide:x-circle" />
                    )
                  }
                  variant="flat"
                >
                  {account.payout ? "Active" : "Inactive"}
                </Chip>
              </div>

              <div className="space-y-3">
                {account.payout ? (
                  <>
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-50">
                        <Icon className="text-primary-500" icon="lucide:user" />
                      </div>
                      <span>Recipient: {account.payout.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-50">
                        <Icon
                          className="text-primary-500"
                          icon="lucide:credit-card"
                        />
                      </div>
                      <span>Stripe ID: {account.payout.stripeId}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-50">
                        <Icon
                          className="text-primary-500"
                          icon="lucide:percent"
                        />
                      </div>
                      <span>Take Rate: {account.payout.take}%</span>
                    </div>
                    {/* <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-50">
                        <Icon icon="lucide:currency-dollar" className="text-primary-500" />
                      </div>
                      <span>Total Payout: ${account.payout.totalPayoutAmount.toFixed(2)} {account.payout.currency.toUpperCase()}</span>
                    </div> */}
                  </>
                ) : (
                  <div className="text-center py-4">
                    <Icon
                      className="text-foreground-500 mx-auto mb-2"
                      icon="lucide:alert-circle"
                      width={24}
                    />
                    <p className="text-foreground-500 text-sm">
                      No payout configuration found
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
