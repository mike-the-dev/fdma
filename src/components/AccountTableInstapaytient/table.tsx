"use client";

import React from "react";
import {
  Table as NextUITable,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from "@heroui/table";
import { Button } from "@heroui/button";
import { useDisclosure } from "@heroui/modal";

import ModalInstapaytient from "../ModalInstapaytient";

import { AccountInstapaytient } from "@/types/AccountInstapaytient";

const columns: {
  key: string;
  label: string;
}[] = [
  {
    key: "company",
    label: "COMPANY",
  },
  {
    key: "name",
    label: "NAME",
  },
  {
    key: "state",
    label: "STATE",
  },
  {
    key: "PK",
    label: "ID",
  },
  {
    key: "stripeID",
    label: "Stripe ID",
  },
  {
    key: "take",
    label: "TAKE",
  },
  {
    key: "edit",
    label: "EDIT",
  },
];

interface TableProps {
  heading: string;
  accounts: AccountInstapaytient[];
  refetchAccounts: () => Promise<void>;
}

const Table: React.FC<any> = (props: TableProps): React.ReactElement => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [account, setAccount] = React.useState<AccountInstapaytient>({
    entity: "",
    _createdAt_: "",
    payout: {
      name: "",
      total_payout_amount: 0,
      take: 0,
      currency: "",
      instant_payout_enabled: false,
      stripe_id: "",
    },
    company: "",
    "GSI1-SK": "",
    SK: "",
    "GSI1-PK": "",
    PK: "",
    name: "",
    _lastUpdated_: "",
    state: "",
  });

  const onClickEditHandler = (item: AccountInstapaytient) => {
    return (): void => {
      setAccount(item);
      onOpen();
    };
  };

  const setInitialState = (): void => {
    setAccount({
      entity: "",
      _createdAt_: "",
      payout: {
        name: "",
        total_payout_amount: 0,
        take: 0,
        currency: "",
        instant_payout_enabled: false,
        stripe_id: "",
      },
      company: "",
      "GSI1-SK": "",
      SK: "",
      "GSI1-PK": "",
      PK: "",
      name: "",
      _lastUpdated_: "",
      state: "",
    });
  };

  if (!props.accounts || props.accounts.length === 0)
    return <div>No Accounts</div>;

  return (
    <>
      <ModalInstapaytient
        account={account}
        isOpen={isOpen}
        refetchAccounts={props.refetchAccounts}
        setInitialState={setInitialState}
        onClose={onClose}
        onOpenChange={onOpenChange}
      />
      <NextUITable
        aria-label="Example table with dynamic content"
        color={"default"}
        selectionMode={"single"}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={props.accounts}>
          {(item) => (
            <TableRow key={item.PK}>
              {(columnKey) => {
                if (columnKey === "take") {
                  // Handle take from nested payout object
                  const takeValue = item.payout?.take || 0;

                  return <TableCell>{takeValue}%</TableCell>;
                }

                if (columnKey === "stripeID") {
                  // Handle stripeID from nested payout object
                  return (
                    <TableCell>{item.payout?.stripe_id || "N/A"}</TableCell>
                  );
                }

                if (columnKey === "instantPayoutEnabled")
                  return (
                    <TableCell>
                      {item.payout?.instant_payout_enabled ? "Yes" : "No"}
                    </TableCell>
                  );

                if (columnKey === "edit")
                  return (
                    <TableCell>
                      <Button onClick={onClickEditHandler(item)}>Edit</Button>
                    </TableCell>
                  );

                return <TableCell>{getKeyValue(item, columnKey)}</TableCell>;
              }}
            </TableRow>
          )}
        </TableBody>
      </NextUITable>
    </>
  );
};

export default Table;
