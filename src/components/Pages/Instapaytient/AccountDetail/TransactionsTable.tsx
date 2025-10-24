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
import { TransactionMappedDTO } from "@/features/instapaytient/account/account.schema";
import { Selection } from "@heroui/table";
interface TransactionsTableProps {
  transactions?: TransactionMappedDTO[];
  isLoading?: boolean;
  error?: string | null;
  selectedKeys: Set<string>;
  onSelectionChange: (keys: Selection) => void;
}

export const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions = [],
  isLoading = false,
  error = null,
  selectedKeys,
  onSelectionChange
}) => {

  const renderCell = (transaction: TransactionMappedDTO, columnKey: string) => {
    switch (columnKey) {
      case "amount":
        return (
          <div className="flex items-center gap-2">
            <span className="font-medium">${transaction.amount}</span>
            <span className="text-gray-500">{transaction.currency}</span>
            <Chip
              size="sm"
              color={transaction.status === "succeeded" ? "success" : "default"}
              variant="flat"
            >
              {transaction.status}
            </Chip>
          </div>
        );
      case "paymentMethod":
        const paymentMethodTypes = transaction.payment_method_types;
        const displayName = paymentMethodTypes?.includes("affirm") ? "Affirm" : paymentMethodTypes?.[0] || "-";
        const isAffirm = paymentMethodTypes?.includes("affirm");
        
        return (
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gray-100">
              {isAffirm ? (
                <Image
                  src="/blue_solid_circle_white_bg.svg"
                  alt="Affirm"
                  width={24}
                  height={24}
                  className="rounded"
                />
              ) : (
                <Icon icon="lucide:credit-card" className="text-gray-600" />
              )}
            </div>
            <span>{displayName}</span>
          </div>
        );
      case "description":
        return <span className="font-mono text-xs text-gray-600">{transaction.id}</span>;
      case "customer":
        return transaction.metadata?.customerEmail || "-";
      case "date":
        return transaction.created;
      case "merchant":
        return transaction.metadata?.orderNumber || "-";
      case "actions":
        return (
          <Button isIconOnly size="sm" variant="light">
            <Icon icon="lucide:more-horizontal" className="text-lg" />
          </Button>
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
          <Spinner size="lg" color="primary" />
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
          <Icon icon="lucide:alert-circle" className="text-danger mr-3" />
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
          <Icon icon="lucide:file-x" className="text-gray-400 mr-3" />
          <span className="text-gray-500">No transactions found</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-visible shadow-sm">
      <Table
        aria-label="Transactions table"
        selectionMode="multiple"
        selectedKeys={selectedKeys}
        onSelectionChange={onSelectionChange}
        removeWrapper
      >
        <TableHeader>
          <TableColumn key="amount">Amount</TableColumn>
          <TableColumn key="paymentMethod">Payment method</TableColumn>
          <TableColumn key="description">Description</TableColumn>
          <TableColumn key="customer">Customer</TableColumn>
          <TableColumn key="date">Date</TableColumn>
          <TableColumn key="merchant">Order#</TableColumn>
          <TableColumn key="actions" hideHeader>
            <span></span>
          </TableColumn>
        </TableHeader>
        <TableBody items={transactions}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => <TableCell>{renderCell(item, columnKey as string)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
};