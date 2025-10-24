import React from "react";
import { Icon } from "@iconify/react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import { StripeAccount } from "@/features/instapaytient/account/account.schema";

interface BankAccountDetailsProps {
  stripeAccount: StripeAccount | null;
  stripeAccountLoading: boolean;
  stripeAccountError: string | null;
}

export const BankAccountDetails: React.FC<BankAccountDetailsProps> = ({ 
  stripeAccount, 
  stripeAccountLoading, 
  stripeAccountError 
}) => {
  // Handle loading state
  if (stripeAccountLoading) {
    return (
      <Card className="mb-8">
        <CardBody className="flex items-center justify-center py-8">
          <div className="text-center">
            <Icon icon="lucide:loader-2" className="text-2xl animate-spin text-primary-500 mb-2" />
            <p className="text-sm text-gray-500">Loading bank account details...</p>
          </div>
        </CardBody>
      </Card>
    );
  }

  // Handle error state
  if (stripeAccountError) {
    return (
      <Card className="mb-8">
        <CardBody className="flex items-center justify-center py-8">
          <div className="text-center">
            <Icon icon="lucide:alert-circle" className="text-2xl text-danger-500 mb-2" />
            <p className="text-sm text-danger-500">{stripeAccountError}</p>
          </div>
        </CardBody>
      </Card>
    );
  }

  // Handle no bank account
  if (!stripeAccount?.external_accounts?.data?.length) {
    return (
      <Card className="mb-8">
        <CardBody className="flex items-center justify-center py-8">
          <div className="text-center">
            <Icon icon="lucide:credit-card" className="text-2xl text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">No bank account linked</p>
          </div>
        </CardBody>
      </Card>
    );
  }

  // Get the first bank account (assuming we want to show the primary/default one)
  const bankAccount = stripeAccount.external_accounts.data[0];
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
      case "verified":
        return "success";
      case "new":
      case "pending":
        return "warning";
      case "error":
      case "rejected":
        return "danger";
      default:
        return "default";
    }
  };

  const formatCurrency = (currency: string) => {
    return currency.toUpperCase();
  };

  return (
    <Card className="mb-8">
      <CardHeader className="flex flex-row justify-between items-center">
        <div className="flex items-center gap-2">
          <Icon icon="lucide:credit-card" className="text-xl text-primary-500" />
          <h3 className="text-lg font-medium">Bank Account</h3>
        </div>
        <Chip
          size="sm"
          color={getStatusColor(bankAccount.status || "unknown")}
          variant="flat"
          startContent={
            <Icon
              icon={
                (bankAccount.status?.toLowerCase() === "active" || bankAccount.status?.toLowerCase() === "verified")
                  ? "lucide:check-circle"
                  : (bankAccount.status?.toLowerCase() === "new" || bankAccount.status?.toLowerCase() === "pending")
                    ? "lucide:clock"
                    : "lucide:alert-circle"
              }
              className="text-sm"
            />
          }
        >
          {(bankAccount.status || "unknown").charAt(0).toUpperCase() + (bankAccount.status || "unknown").slice(1)}
        </Chip>
      </CardHeader>
      <Divider />
      <CardBody>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Bank Information</h4>
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary-100 dark:bg-primary-900/30">
                  <Icon icon="lucide:building-bank" className="text-xl text-primary-500 dark:text-primary-400" />
                </div>
                <div>
                  <p className="font-medium">{(bankAccount as any).bank_name || "Unknown Bank"}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {(bankAccount as any).country?.toUpperCase()} • {formatCurrency(bankAccount.currency || "usd")}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Account Number</p>
                  <p className="font-mono">****{bankAccount.last4 || "****"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Routing Number</p>
                  <p className="font-mono">{(bankAccount as any).routing_number || "Not available"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Account Details</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Account Holder</span>
                  <span className="font-medium">
                    {(bankAccount as any).account_holder_name || "Not specified"}
                  </span>
                </div>
                <Divider className="my-2" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Account Type</span>
                  <span className="font-medium">
                    {(bankAccount as any).account_holder_type
                      ? (bankAccount as any).account_holder_type.charAt(0).toUpperCase() + (bankAccount as any).account_holder_type.slice(1)
                      : "Not specified"}
                  </span>
                </div>
                <Divider className="my-2" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Default Account</span>
                  <Chip
                    size="sm"
                    color={bankAccount.default_for_currency ? "success" : "default"}
                    variant="flat"
                  >
                    {bankAccount.default_for_currency ? "Yes" : "No"}
                  </Chip>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};