"use client";

import React from "react";
import { Card } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Icon } from "@iconify/react";
import { Spinner } from "@heroui/spinner";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
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

  return date.toLocaleString();
};

const RefundContractsTable = ({
  accountId,
}: RefundContractsTableProps): React.ReactElement => {
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
      <Table removeWrapper aria-label="Refund contracts table">
        <TableHeader>
          <TableColumn key="amount">Amount</TableColumn>
          <TableColumn key="paymentId">Payment ID</TableColumn>
          <TableColumn key="status">Status</TableColumn>
          <TableColumn key="reason">Reason</TableColumn>
          <TableColumn key="createdAt">Created</TableColumn>
          <TableColumn key="lastUpdated">Updated</TableColumn>
          <TableColumn key="contractId">Contract ID</TableColumn>
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
                  <span className="font-mono text-xs text-gray-600">
                    {contract.paymentId}
                  </span>
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
                <TableCell>{contract.reason || "-"}</TableCell>
                <TableCell>{formatDateTime(contract.createdAt)}</TableCell>
                <TableCell>{formatDateTime(contract.lastUpdated)}</TableCell>
                <TableCell>
                  <span className="font-mono text-xs text-gray-600">
                    {contract.id}
                  </span>
                </TableCell>
              </TableRow>
            );
          }}
        </TableBody>
      </Table>
    </Card>
  );
};

export default RefundContractsTable;
