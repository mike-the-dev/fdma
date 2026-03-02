"use client";

import React from "react";
import { Card, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import { Switch } from "@heroui/switch";
import { Tabs, Tab } from "@heroui/tabs";
import { Button } from "@heroui/button";
import { Icon } from "@iconify/react";

import { AccountStatus } from "@/types/AccountInstapaytient";
import { useAccountStatusToggle } from "./useAccountStatusToggle";

interface AccountSettingsPanelProps {
  accountId: string;
  selectedKey: string;
  onSelectionChange: (key: string) => void;
  status?: AccountStatus;
  onStatusUpdated?: () => Promise<void> | void;
}

const AccountSettingsPanel = ({
  accountId,
  selectedKey,
  onSelectionChange,
  status,
  onStatusUpdated,
}: AccountSettingsPanelProps): React.ReactElement => {
  const { isEnabled, hasExplicitStatus, handleToggle } =
    useAccountStatusToggle(accountId, status, onStatusUpdated);

  return (
    <div className="w-full">
      <Tabs
        aria-label="Account settings sections"
        classNames={{
          tabList: "w-[180px] min-w-[180px] pt-3 pb-3",
          panel: "w-full h-full",
        }}
        isVertical
        selectedKey={selectedKey}
        onSelectionChange={(key) => onSelectionChange(String(key))}
      >
        <Tab key="general" title="General" isDisabled>
          <Card className="border border-default-200 bg-default-50/40">
            <CardBody className="gap-4">
              <Input
                defaultValue=""
                description="Public-facing business name used across dashboards."
                label="Display Name"
                placeholder="Enter display name"
                variant="bordered"
              />
              <Input
                defaultValue=""
                description="Shown on receipts and payment statements."
                label="Statement Descriptor"
                placeholder="Enter statement descriptor"
                variant="bordered"
              />
            </CardBody>
          </Card>
        </Tab>
        <Tab key="notifications" title="Notifications" isDisabled>
          <Card className="border border-default-200 bg-default-50/40">
            <CardBody className="gap-5">
              <Switch defaultSelected size="sm">
                Notify on failed payouts
              </Switch>
              <Switch defaultSelected size="sm">
                Notify on refund contract updates
              </Switch>
              <Switch size="sm">Weekly account digest email</Switch>
            </CardBody>
          </Card>
        </Tab>
        <Tab key="access" title="Access">
          <Card className="border border-default-200 bg-default-50/40">
            <CardBody className="gap-4">
              <Switch
                isSelected={isEnabled}
                size="sm"
                onValueChange={handleToggle}
              >
                Account Enabled
              </Switch>
              <p className="text-sm text-foreground-600">
                Turning this off disables the account, prevents the merchant from
                accessing their ecommerce store, and prevents customers from
                accessing the storefront.
              </p>
              {!hasExplicitStatus ? (
                <div className="flex items-center gap-1 text-xs text-warning">
                  <Icon icon="lucide:triangle-alert" width={18} />
                  <span>Status has not been set yet.</span>
                </div>
              ) : null}
            </CardBody>
          </Card>
        </Tab>
        <Tab key="danger" title="Danger Zone" isDisabled>
          <Card className="border border-danger-300 bg-danger-50/30">
            <CardBody className="gap-3">
              <p className="text-sm text-foreground-600">
                Disabling this account will block new payment activity. This action
                should require a confirmation flow before activation.
              </p>
              <Button className="w-fit" color="danger" isDisabled variant="flat">
                Disable Account (Coming Soon)
              </Button>
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
};

export default AccountSettingsPanel;
