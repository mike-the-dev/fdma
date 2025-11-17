import React from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Avatar } from "@heroui/avatar";
import { Icon } from "@iconify/react";

interface AccountProps {
  account: {
    PK: string;
    SK: string;
    name: string;
    company: string;
    state: string;
    "GSI1-PK": string;
    "GSI1-SK": string;
    entity: string;
    payout?: {
      name: string;
      currency: string;
      stripe_id: string;
      take: number;
      total_payout_amount: number;
      instant_payout_enabled: boolean;
    };
  };
}

export const AccountDetails: React.FC<AccountProps> = ({ account }) => {
  // Add null check for account
  if (!account) {
    return (
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Account Details</h2>
        </CardHeader>
        <Divider />
        <CardBody className="text-center p-6">
          <Icon
            className="text-foreground-500 mx-auto mb-4"
            icon="lucide:user-x"
            width={48}
          />
          <p className="text-foreground-500">
            Account information not available
          </p>
        </CardBody>
      </Card>
    );
  }

  const { name, company, state, payout } = account;

  // Generate initials for the avatar
  const getInitials = (name: string) => {
    if (!name) return "NA";

    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold">Account Details</h2>
      </CardHeader>
      <Divider />
      <CardBody className="space-y-4">
        <div className="flex items-center gap-4">
          <Avatar color="primary" name={getInitials(name)} size="lg" />
          <div>
            <h3 className="font-semibold">{name || "N/A"}</h3>
            <p className="text-foreground-500">{company || "N/A"}</p>
          </div>
        </div>

        <Divider />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-foreground-500">Account ID</span>
            <span className="font-mono text-sm">
              {account.PK ? account.PK.replace("ACCOUNT#", "") : "N/A"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-foreground-500">Location</span>
            <div className="flex items-center gap-1">
              <Icon
                className="text-foreground-500"
                icon="lucide:map-pin"
                width={16}
              />
              <span>{state || "N/A"}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-foreground-500">Payout Account</span>
            <div className="flex items-center gap-1">
              <Icon
                className="text-foreground-500"
                icon="lucide:credit-card"
                width={16}
              />
              <span className="font-mono text-sm">
                {payout?.stripe_id || "N/A"}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-foreground-500">Currency</span>
            <span>{payout?.currency || "N/A"}</span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
