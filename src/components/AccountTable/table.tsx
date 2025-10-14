"use client";

import React from "react";
import { Table as NextUITable, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue } from "@heroui/table";
import { Button } from "@heroui/button";
import { useDisclosure } from "@heroui/modal";
import { Account } from "@/types/Account";
import ModalApp from "../Modal";

const columns: {
  key: string;
  label: string;
}[] = [
    {
      key: "name",
      label: "NAME",
    },
    {
      key: "PK",
      label: "ID",
    },
    // {
    //   key: "currency",
    //   label: "CURRENCY"
    // },
    // {
    //   key: "instantPayoutEnabled",
    //   label: "INSTANT PAYOUT ENABLED"
    // },
    {
      key: "stripeID",
      label: "Stripe ID"
    },
    // {
    //   key: "ecwidAppSecretKey",
    //   label: "Ecwid App Secret Key"
    // },
    // {
    //   key: "ecwidPublicKey",
    //   label: "Ecwid Public Key"
    // },
    // {
    //   key: "ecwidSecretKey",
    //   label: "Ecwid Secret Key"
    // },
    {
      key: "GSI1-PK",
      label: "Ecwid Store ID"
    },
    {
      key: "take",
      label: "TAKE"
    },
    {
      key: "edit",
      label: "EDIT"
    }
  ];

interface TableProps {
  heading: string;
  accounts: Account[];
};


const Table: React.FC<any> = (props: TableProps): React.ReactElement => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [account, setAccount] = React.useState<Account>({
    PK: "",
    SK: "",
    name: "",
    currency: "",
    take: 0,
    totalPayoutAmount: 0,
    instantPayoutEnabled: false,
    stripeID: "",
    ecwidAppSecretKey: "",
    ecwidPublicKey: "",
    ecwidSecretKey: "",
    "GSI1-PK" : ""
  });

  const onClickEditHandler = (item: Account) => {
    return (): void => {
      setAccount(item);
      onOpen();
    }
  };

  const setInitialState = (): void => {
      setAccount({
      PK: "",
      SK: "",
      name: "",
      currency: "",
      take: 0,
      totalPayoutAmount: 0,
      instantPayoutEnabled: false,
      stripeID: "",
      ecwidAppSecretKey: "",
      ecwidPublicKey: "",
      ecwidSecretKey: "",
      "GSI1-PK": ""
    });
  };

  if (!props.accounts || props.accounts.length === 0) return <div>No Accounts</div>;

  return (
    <>
      <ModalApp
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        onClose={onClose}
        setInitialState={setInitialState}
        account={account}
      />
      <NextUITable 
        color={"default"}
        selectionMode={"single"}
        aria-label="Example table with dynamic content"
      >
        <TableHeader columns={columns}>
          {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
        </TableHeader>
        <TableBody items={props.accounts}>
          {(item) => (
            <TableRow key={item.PK}>
              {
                (columnKey) => {
                  if (columnKey === "take") return <TableCell>{item.take}%</TableCell>

                  if (columnKey === "instantPayoutEnabled") return <TableCell>{item.instantPayoutEnabled ? "Yes" : "No"}</TableCell>

                  if (columnKey === "edit") return <TableCell><Button onClick={onClickEditHandler(item)}>Edit</Button></TableCell>

                  return <TableCell>{getKeyValue(item, columnKey)}</TableCell>
                }
              }
            </TableRow>
          )}
        </TableBody>
      </NextUITable>
    </>
  );
}

export default Table;