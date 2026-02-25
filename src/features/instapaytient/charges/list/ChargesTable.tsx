"use client";

import React from "react";
import { Selection } from "@heroui/table";

import { useCharges } from "../charges.service";
import { ChargeMappedDTO } from "../_shared/charges.types";

import { TransactionsTable } from "@/components/Pages/Instapaytient/AccountDetail/TransactionsTable";
import { TransactionMappedDTO } from "@/features/instapaytient/account/account.schema";

interface ChargesTableProps {
  stripeAccount?: string;
  onRefund: (charge: ChargeMappedDTO) => void;
}

const ChargesTable = ({
  stripeAccount,
  onRefund,
}: ChargesTableProps): React.ReactElement => {
  const { data: charges = [], isLoading, error } = useCharges(stripeAccount);
  const [selectedKeys, setSelectedKeys] = React.useState<Set<string>>(new Set());

  const handleSelectionChange = (keys: Selection): void => {
    if (keys === "all") return;
    setSelectedKeys(new Set(Array.from(keys).map(String)));
  };

  const handleRefund = (chargeId: string): void => {
    const selectedCharge = charges.find((charge) => charge.id === chargeId);
    if (!selectedCharge) return;
    onRefund(selectedCharge);
  };

  return (
    <TransactionsTable
      error={error ? (error as Error).message : null}
      isLoading={isLoading}
      selectedKeys={selectedKeys}
      transactions={charges as unknown as TransactionMappedDTO[]}
      onRefund={handleRefund}
      onSelectionChange={handleSelectionChange}
    />
  );
};

export default ChargesTable;
