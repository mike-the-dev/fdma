import React from "react";
import { Table } from "@heroui/table";
import { TableHeader } from "@heroui/table";
import { TableColumn } from "@heroui/table";
import { TableBody } from "@heroui/table";
import { TableRow } from "@heroui/table";
import { TableCell } from "@heroui/table";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import { Icon } from "@iconify/react";
import { Spinner } from "@heroui/spinner";
import Image from "next/image";
import { Selection } from "@heroui/table";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
} from "@heroui/dropdown";

import { TransactionMappedDTO } from "@/features/instapaytient/account/account.schema";

const iconClasses = "text-xl text-default-500 pointer-events-none shrink-0";

const CopyDocumentIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 24 24"
      width="1em"
      {...props}
    >
      <path
        d="M15.5 13.15h-2.17c-1.78 0-3.23-1.44-3.23-3.23V7.75c0-.41-.33-.75-.75-.75H6.18C3.87 7 2 8.5 2 11.18v6.64C2 20.5 3.87 22 6.18 22h5.89c2.31 0 4.18-1.5 4.18-4.18V13.9c0-.42-.34-.75-.75-.75Z"
        fill="currentColor"
        opacity={0.4}
      />
      <path
        d="M17.82 2H11.93C9.67 2 7.84 3.44 7.76 6.01c.06 0 .11-.01.17-.01h5.89C16.13 6 18 7.5 18 10.18V16.83c0 .06-.01.11-.01.16 2.23-.07 4.01-1.55 4.01-4.16V6.18C22 3.5 20.13 2 17.82 2Z"
        fill="currentColor"
      />
      <path
        d="M11.98 7.15c-.31-.31-.84-.1-.84.33v2.62c0 1.1.93 2 2.07 2 .71.01 1.7.01 2.55.01.43 0 .65-.5.35-.8-1.09-1.09-3.03-3.04-4.13-4.16Z"
        fill="currentColor"
      />
    </svg>
  );
};

const VerticalDotsIcon = ({
  size = 24,
  width,
  height,
  ...props
}: React.SVGProps<SVGSVGElement> & {
  size?: number;
}) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height={size || height}
      role="presentation"
      viewBox="0 0 24 24"
      width={size || width}
      {...props}
    >
      <path
        d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 12c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
        fill="currentColor"
      />
    </svg>
  );
};
interface TransactionsTableProps {
  transactions?: TransactionMappedDTO[];
  isLoading?: boolean;
  error?: string | null;
  selectedKeys: Set<string>;
  onSelectionChange: (keys: Selection) => void;
  onRefund: (transactionId: string) => void;
}

export const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions = [],
  isLoading = false,
  error = null,
  selectedKeys,
  onSelectionChange,
  onRefund,
}) => {
  const renderCell = (transaction: TransactionMappedDTO, columnKey: string) => {
    switch (columnKey) {
      case "amount":
        const amountLatestCharge = transaction.latest_charge;
        const isAmountRefunded =
          typeof amountLatestCharge === "string"
            ? false
            : !!amountLatestCharge?.refunded;
        const hasActiveRefundContractForStatus =
          !!transaction.metadata?.active_refund_contract;
        const displayStatus =
          hasActiveRefundContractForStatus && transaction.status === "succeeded"
            ? "refund contracted"
            : transaction.status;
        const formattedAmount =
          typeof transaction.amount === "number"
            ? transaction.amount.toFixed(2)
            : "0.00";

        return (
          <div className="flex items-center gap-2">
            <span className="font-medium">${formattedAmount}</span>
            <span className="text-gray-500">{transaction.currency}</span>
            <Chip
              color={displayStatus === "succeeded" ? "success" : "default"}
              size="sm"
              variant="flat"
            >
              {displayStatus}
            </Chip>
            {isAmountRefunded ? (
              <Chip color="warning" size="sm" variant="flat">
                Refunded
              </Chip>
            ) : null}
          </div>
        );
      case "paymentMethod":
        const paymentMethodTypes = transaction.payment_method_types;
        const displayName = paymentMethodTypes?.includes("affirm")
          ? "Affirm"
          : paymentMethodTypes?.includes("stripe_account")
            ? "Authorize.net"
          : paymentMethodTypes?.[0] || "-";
        const isAffirm = paymentMethodTypes?.includes("affirm");

        return (
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gray-100">
              {isAffirm ? (
                <Image
                  alt="Affirm"
                  className="rounded"
                  height={24}
                  src="/blue_solid_circle_white_bg.svg"
                  width={24}
                />
              ) : (
                <Icon className="text-gray-600" icon="lucide:credit-card" />
              )}
            </div>
            <span>{displayName}</span>
          </div>
        );
      case "description":
        return (
          <span className="font-mono text-xs text-gray-600">
            {transaction.id}
          </span>
        );
      case "customer":
        return transaction.metadata?.customerEmail || "-";
      case "date":
        return transaction.created;
      case "merchant":
        return transaction.metadata?.orderNumber || "-";
      case "actions":
        const latestCharge = transaction.latest_charge;
        const chargeId =
          typeof latestCharge === "string"
            ? latestCharge
            : latestCharge?.id;
        const hasActiveRefundContractForAction =
          !!transaction.metadata?.active_refund_contract;
        const isRefunded =
          typeof latestCharge === "string"
            ? false
            : !!latestCharge?.refunded;
        const disableRefund =
          !chargeId || isRefunded || hasActiveRefundContractForAction;

        return (
          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly size="sm" variant="light" className="mx-auto">
                <VerticalDotsIcon className="text-default-500" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Refund actions" variant="faded">
              <DropdownSection title="Actions">
                <DropdownItem
                  key="initiate-refund"
                  description="Initate a new refund contract"
                  shortcut="⌘R"
                  startContent={<CopyDocumentIcon className={iconClasses} />}
                  isDisabled={disableRefund}
                  onPress={() => onRefund(transaction.id)}
                >
                  Initiate Refund
                </DropdownItem>
              </DropdownSection>
            </DropdownMenu>
          </Dropdown>
        );
      default:
        return String(transaction[columnKey as keyof TransactionMappedDTO]);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <Card className="overflow-visible shadow-sm">
        <div className="flex items-center justify-center p-8">
          <Spinner color="primary" size="lg" />
          <span className="ml-3 text-gray-500">Loading transactions...</span>
        </div>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="overflow-visible shadow-sm">
        <div className="flex items-center justify-center p-8">
          <Icon className="text-danger mr-3" icon="lucide:alert-circle" />
          <span className="text-danger">{error}</span>
        </div>
      </Card>
    );
  }

  // Empty state
  if (!transactions || transactions.length === 0) {
    return (
      <Card className="overflow-visible shadow-sm">
        <div className="flex items-center justify-center p-8">
          <Icon className="text-gray-400 mr-3" icon="lucide:file-x" />
          <span className="text-gray-500">No transactions found</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-visible shadow-sm">
      <Table
        removeWrapper
        aria-label="Transactions table"
        selectedKeys={selectedKeys}
        selectionMode="multiple"
        onSelectionChange={onSelectionChange}
      >
        <TableHeader>
          <TableColumn key="amount">Amount</TableColumn>
          <TableColumn key="paymentMethod">Payment method</TableColumn>
          <TableColumn key="description">Description</TableColumn>
          <TableColumn key="customer">Customer</TableColumn>
          <TableColumn key="date">Date</TableColumn>
          <TableColumn key="merchant">Order#</TableColumn>
          <TableColumn key="actions" hideHeader>
            <span />
          </TableColumn>
        </TableHeader>
        <TableBody items={transactions}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey as string)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
};
