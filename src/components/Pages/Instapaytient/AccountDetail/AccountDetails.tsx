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
                <p className="text-sm text-gray-500 mt-1">{account.company} • {account.state}</p>
                <Chip
                size="sm"
                variant="flat"
                color="primary"
                className="self-start sm:self-center mt-1 sm:mt-0"
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
              <h4 className="mb-4 text-base font-medium text-white">Account Information</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-50">
                    <Icon icon="lucide:id-card" className="text-primary-500" />
                  </div>
                  <span>ID: {account.id}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-50">
                    <Icon icon="lucide:building" className="text-primary-500" />
                  </div>
                  <span>Company: {account.company}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-50">
                    <Icon icon="lucide:map-pin" className="text-primary-500" />
                  </div>
                  <span>State: {account.state}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 md:pt-0 md:pl-6">
              <div className="mb-4 flex items-center gap-3">
                <h4 className="text-base font-medium text-white">Payout Information</h4>
                <Chip
                  size="sm"
                  color={account.payout ? "success" : "danger"}
                  variant="flat"
                  startContent={
                    account.payout ?
                      <Icon icon="lucide:check-circle" /> :
                      <Icon icon="lucide:x-circle" />
                  }
                >
                  {account.payout ? "Active" : "Inactive"}
                </Chip>
              </div>

              <div className="space-y-3">
                {account.payout ? (
                  <>
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-50">
                        <Icon icon="lucide:user" className="text-primary-500" />
                      </div>
                      <span>Recipient: {account.payout.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-50">
                        <Icon icon="lucide:credit-card" className="text-primary-500" />
                      </div>
                      <span>Stripe ID: {account.payout.stripeId}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-50">
                        <Icon icon="lucide:percent" className="text-primary-500" />
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
                    <Icon icon="lucide:alert-circle" width={24} className="text-foreground-500 mx-auto mb-2" />
                    <p className="text-foreground-500 text-sm">No payout configuration found</p>
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