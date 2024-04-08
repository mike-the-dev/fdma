import React from "react";
import Table from "./table";
import { Account, AccountHttpResponse } from "@/types/Account";

/**
 * @notes Move Table to a client only component.
 */

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
  {
    key: "take",
    label: "TAKE"
  },
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

interface AccountTableProps {};

const AccountTable = async (props: AccountTableProps): Promise<React.ReactElement> => {
  const getData = async <T,>(): Promise<T> => {
    await new Promise(resolve => setTimeout(resolve, 5000));
    const res = await fetch(`http://localhost:3000/api`, {
      method: "GET",
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    });
  
    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      // throw new Error('Failed to fetch data');
    };
  
    return res.json() as Promise<T>;
  };
  const { accounts } = await getData<AccountHttpResponse>();

  const onClickEditHandler = (item: Account) => {
    return (): void => {
      // setAccount(item);
      // onOpen();
    }
  };

  return (
    <>
      <Table 
        heading="User Acounts" 
        accounts={accounts}
      />
    </>
  );
}

export default AccountTable;