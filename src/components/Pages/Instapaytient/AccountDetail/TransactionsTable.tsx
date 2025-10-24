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
import { Transaction } from "@/features/instapaytient/account/account.schema";

// Temporary test data - will be replaced with real data from props
const testTransactions = [
  {
    id: "1",
    amount: "$1,200.00",
    currency: "USD",
    status: "Succeeded",
    paymentMethod: "Affirm",
    description: "pi_35JLXfFB7NUYQVAN15iCNbJZ",
    customer: "deisy.lino19@gmail.com",
    date: "Oct 17, 2:53 PM",
    merchant: "Texas Hair Restoration"
  },
  {
    id: "2",
    amount: "$4,995.00",
    currency: "USD",
    status: "Canceled",
    paymentMethod: "Affirm",
    description: "pi_35JLKrFB7NUYQVAN2waDUq5s",
    customer: "daisy.lino19@gmail.com",
    date: "Oct 17, 2:45 PM",
    merchant: "Texas Hair Restoration"
  },
  {
    id: "3",
    amount: "$4,995.00",
    currency: "USD",
    status: "Canceled",
    paymentMethod: "Affirm",
    description: "pi_35JLRlFB7NUYQVAN0oB504B0",
    customer: "gab@test3.com",
    date: "Oct 17, 2:44 PM",
    merchant: "Texas Hair Restoration"
  },
  {
    id: "4",
    amount: "$7,995.00",
    currency: "USD",
    status: "Canceled",
    paymentMethod: "Affirm",
    description: "pi_35JLCzFB7NUYQVAN2hjUj0Lp",
    customer: "daisy.lino19@gmail.com",
    date: "Oct 17, 2:31 PM",
    merchant: "Texas Hair Restoration"
  },
  {
    id: "5",
    amount: "$7,995.00",
    currency: "USD",
    status: "Canceled",
    paymentMethod: "Affirm",
    description: "pi_35JL8XFB7NUYQVAN2Drj42Iv",
    customer: "gab@test2.com",
    date: "Oct 17, 2:24 PM",
    merchant: "Texas Hair Restoration"
  },
  {
    id: "6",
    amount: "$7,995.00",
    currency: "USD",
    status: "Canceled",
    paymentMethod: "Affirm",
    description: "pi_35JL5gFB7NUYQVAN1RbsKAL0",
    customer: "henry@medaestheticsgroup.com",
    date: "Oct 17, 2:21 PM",
    merchant: "Texas Hair Restoration"
  },
  {
    id: "7",
    amount: "$1,995.00",
    currency: "USD",
    status: "Succeeded",
    paymentMethod: "Affirm",
    description: "pi_35IZ8QFB7NUYQVAN1W0V9tvc",
    customer: "Daintee.success@yahoo.com",
    date: "Oct 15, 11:11 AM",
    merchant: "Texas Hair Restoration"
  },
  {
    id: "8",
    amount: "$4,995.00",
    currency: "USD",
    status: "Canceled",
    paymentMethod: "Affirm",
    description: "pi_35IYvUFB7NUYQVAN0Fn8FbIJ",
    customer: "gabrielle@instapatient.com",
    date: "Oct 15, 11:06 AM",
    merchant: "Texas Hair Restoration"
  },
  {
    id: "9",
    amount: "$258.82",
    currency: "USD",
    status: "Succeeded",
    paymentMethod: "acct_1NIGoNFbIMQZZWcr",
    description: "py_15FfCcFZ7Tps6WjhTpbaftXR",
    customer: "",
    date: "Oct 7, 11:01 AM",
    merchant: "Instapatient"
  },
  {
    id: "10",
    amount: "$7,467.33",
    currency: "USD",
    status: "Succeeded",
    paymentMethod: "acct_1QpxZf2Y7btXWnqf",
    description: "py_15Ff82FZ7Tps6WjhnA84pBTb",
    customer: "",
    date: "Oct 7, 10:56 AM",
    merchant: "Instapatient"
  },
  {
    id: "11",
    amount: "$250.00",
    currency: "USD",
    status: "Canceled",
    paymentMethod: "Affirm",
    description: "pi_35BIagFbIMQZZWcr1v21no0J",
    customer: "mikedev0431@gmail.com",
    date: "Sep 25, 10:04 AM",
    merchant: "Medaestheticsgroup"
  },
  {
    id: "12",
    amount: "$250.00",
    currency: "USD",
    status: "Succeeded",
    paymentMethod: "Affirm",
    description: "pi_35AxnjFbIMQZZWcr1JEMioxm",
    customer: "henryc134@gmail.com",
    date: "Sep 24, 11:53 AM",
    merchant: "Medaestheticsgroup"
  }
];

interface TransactionsTableProps {
  transactions?: Transaction[];
  isLoading?: boolean;
  error?: string | null;
  selectedKeys: Set<string>;
  onSelectionChange: (keys: Set<string>) => void;
}

export const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions = [],
  isLoading = false,
  error = null,
  selectedKeys,
  onSelectionChange
}) => {

  const renderCell = (transaction: Transaction, columnKey: string) => {
    switch (columnKey) {
      case "amount":
        const amount = (transaction.amount / 100).toFixed(2);
        const currency = transaction.currency?.toUpperCase();
        return (
          <div className="flex items-center gap-2">
            <span className="font-medium">${amount}</span>
            <span className="text-gray-500">{currency}</span>
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
        const date = new Date(transaction.created * 1000).toLocaleDateString();
        return date;
      case "merchant":
        return transaction.metadata?.orderNumber || "-";
      case "actions":
        return (
          <Button isIconOnly size="sm" variant="light">
            <Icon icon="lucide:more-horizontal" className="text-lg" />
          </Button>
        );
      default:
        return String(transaction[columnKey as keyof Transaction]);
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
        onSelectionChange={onSelectionChange as any}
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