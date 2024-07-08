import React from "react";
import Table from "./table";

interface AccountTableProps {
  accounts: any
};

const AccountTable: React.FC<AccountTableProps> = (props): React.ReactElement => {
  return (
    <>
      <Table 
        heading="User Acounts" 
        accounts={props.accounts}
      />
    </>
  );
}

export default AccountTable;