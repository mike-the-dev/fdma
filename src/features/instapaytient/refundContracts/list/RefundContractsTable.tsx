"use client";

import React from "react";
import { Card } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Icon } from "@iconify/react";
import { Spinner } from "@heroui/spinner";
import { Tooltip } from "@heroui/tooltip";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Selection,
} from "@heroui/table";

import { RefundContractDto } from "../_shared/refundContracts.types";
import { useAdminRefundContracts } from "../refundContracts.service";

interface RefundContractsTableProps {
  accountId: string;
}

const getStatusColor = (
  status: RefundContractDto["status"]
): "default" | "warning" | "success" | "danger" => {
  if (status === "COMPLETED") return "success";
  if (status === "FAILED") return "danger";
  if (status === "READY_FOR_REFUND") return "warning";
  return "default";
};

const formatDateTime = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString("en-US");
};

const formatShortDate = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-US");
};

const truncateValue = (value: string, visibleLength: number): string => {
  if (!value || value.length <= visibleLength) return value;

  return `${value.slice(0, visibleLength)}...`;
};

const formatReason = (reason?: string): string => {
  if (!reason) return "-";
  if (reason === "requested_by_customer") return "Requested By Customer";
  if (reason === "duplicate") return "Duplicate";
  if (reason === "fraudulent") return "Fraudulent";

  return reason;
};

const formatPaymentMethod = (paymentMethod?: string): string => {
  if (!paymentMethod) return "No Payment Type";
  if (paymentMethod === "affirm") return "Affirm";
  if (paymentMethod === "credit card or debit card")
    return "Credit Card or Debit Card";
  if (paymentMethod === "no payment type") return "No Payment Type";

  return paymentMethod;
};

const RefundContractsTable = ({
  accountId,
}: RefundContractsTableProps): React.ReactElement => {
  const [selectedKeys, setSelectedKeys] = React.useState<Set<string>>(new Set());
  const {
    data: contracts = [],
    isLoading,
    error,
  } = useAdminRefundContracts(accountId);

  if (isLoading) {
    return (
      <Card className="overflow-visible shadow-sm">
        <div className="flex items-center justify-center p-8">
          <Spinner color="primary" size="lg" />
          <span className="ml-3 text-gray-500">Loading refund contracts...</span>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="overflow-visible shadow-sm">
        <div className="flex items-center justify-center p-8">
          <Icon className="text-danger mr-3" icon="lucide:alert-circle" />
          <span className="text-danger">{error.message}</span>
        </div>
      </Card>
    );
  }

  if (contracts.length === 0) {
    return (
      <Card className="overflow-visible shadow-sm">
        <div className="flex items-center justify-center p-8">
          <Icon className="text-gray-400 mr-3" icon="lucide:file-x" />
          <span className="text-gray-500">No refund contracts found</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-visible shadow-sm">
      <div className="overflow-x-auto">
        <Table
          removeWrapper
          aria-label="Refund contracts table"
          selectedKeys={selectedKeys}
          selectionMode="multiple"
          onSelectionChange={(keys: Selection) => {
            if (keys === "all") return;
            setSelectedKeys(new Set(Array.from(keys).map(String)));
          }}
        >
          <TableHeader>
            <TableColumn key="amount">Amount</TableColumn>
            <TableColumn key="paymentId">Payment ID</TableColumn>
            <TableColumn key="status">Status</TableColumn>
            <TableColumn key="paymentMethod">Payment Method</TableColumn>
            <TableColumn key="orderNumber">Order #</TableColumn>
            <TableColumn key="reason">Reason</TableColumn>
            <TableColumn key="contractId">Contract ID</TableColumn>
            <TableColumn key="createdAt">Created</TableColumn>
            <TableColumn key="lastUpdated">Updated</TableColumn>
          </TableHeader>
          <TableBody items={contracts}>
            {(contract) => {
              const amount = Number.isFinite(contract.amountToRefund)
                ? (contract.amountToRefund / 100).toFixed(2)
                : "0.00";

              return (
                <TableRow key={contract.id}>
                  <TableCell>${amount}</TableCell>
                  <TableCell>
                    <Tooltip content={contract.paymentId}>
                      <span className="font-mono text-xs text-gray-600">
                        {truncateValue(contract.paymentId, 8)}
                      </span>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Chip
                      color={getStatusColor(contract.status)}
                      size="sm"
                      variant="flat"
                    >
                      {contract.status}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <span className="whitespace-nowrap">
                      {formatPaymentMethod(contract.paymentMethod)}
                    </span>
                  </TableCell>
                  <TableCell>{contract.orderNumber || "-"}</TableCell>
                  <TableCell>
                    <span className="whitespace-nowrap">
                      {formatReason(contract.reason)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Tooltip content={contract.id}>
                      <span className="font-mono text-xs text-gray-600">
                        {truncateValue(contract.id, 22)}
                      </span>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Tooltip content={formatDateTime(contract.createdAt)}>
                      <span>{formatShortDate(contract.createdAt)}</span>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Tooltip content={formatDateTime(contract.lastUpdated)}>
                      <span>{formatShortDate(contract.lastUpdated)}</span>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            }}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default RefundContractsTable;
