"use client";

import React from "react";
import { useRouter } from "next/navigation";
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
    key: "id",
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
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [account, setAccount] = React.useState<AccountInstapaytient>({
    id: "",
    name: "",
    company: "",
    state: "",
    entity: "ACCOUNT",
    payout: {
      name: "",
      currency: "",
      stripeId: "",
      take: 0,
      totalPayoutAmount: 0,
      instantPayoutEnabled: false,
    },
  });

  const handleRowClick = (item: AccountInstapaytient) => {
    return (): void => {
      // Navigate to the account detail page using the id
      router.push(`/dashboard/instapaytient/${encodeURIComponent(item.id)}`);
    };
  };

  const onClickEditHandler = (item: AccountInstapaytient) => {
    return (e: React.MouseEvent): void => {
      // Prevent row click when clicking edit button
      e.stopPropagation();
      setAccount(item);
      onOpen();
    };
  };

  const setInitialState = (): void => {
    setAccount({
      id: "",
      name: "",
      company: "",
      state: "",
      entity: "ACCOUNT",
      payout: {
        name: "",
        currency: "",
        stripeId: "",
        take: 0,
        totalPayoutAmount: 0,
        instantPayoutEnabled: false,
      },
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
            <TableRow 
              key={item.id}
              className="cursor-pointer hover:bg-default-100 transition-colors"
              onClick={handleRowClick(item)}
            >
              {(columnKey) => {
                if (columnKey === "take") {
                  // Handle take from nested payout object
                  const takeValue = item.payout?.take || 0;

                  return <TableCell>{takeValue}%</TableCell>;
                }

                if (columnKey === "stripeID") {
                  // Handle stripeID from nested payout object
                  return (
                    <TableCell>{item.payout?.stripeId || "N/A"}</TableCell>
                  );
                }

                if (columnKey === "instantPayoutEnabled")
                  return (
                    <TableCell>
                      {item.payout?.instantPayoutEnabled ? "Yes" : "No"}
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
