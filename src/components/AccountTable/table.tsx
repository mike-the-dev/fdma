"use client";
import React from "react";
import { Table as NextUITable, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue, Button, useDisclosure } from "@nextui-org/react";
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
    {
      key: "currency",
      label: "CURRENCY"
    },
    // {
    //   key: "take",
    //   label: "TAKE"
    // },
    {
      key: "instantPayoutEnabled",
      label: "INSTANT PAYOUT ENABLED"
    },
    {
      key: "stripeID",
      label: "Stripe ID"
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


const Table = (props: TableProps): React.ReactElement => {
  const [account, setAccount] = React.useState<Account>({
    PK: "",
    SK: "",
    name: "",
    currency: "",
    take: 0,
    totalPayoutAmount: 0,
    instantPayoutEnabled: false,
    stripeID: "",
    ecwidPublicKey: "",
    ecwidSecretKey: ""
  });
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const onClickEditHandler = (item: Account) => {
    return (): void => {
      setAccount(item);
      onOpen();
    }
  };

  const setInitialState = (): void => setAccount({
    PK: "",
    SK: "",
    name: "",
    currency: "",
    take: 0,
    totalPayoutAmount: 0,
    instantPayoutEnabled: false,
    stripeID: "",
    ecwidPublicKey: "",
    ecwidSecretKey: ""
  });

  console.log("account props: ", props);

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