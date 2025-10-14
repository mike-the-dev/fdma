import React from "react";

import Table from "./table";

interface AccountTableProps {
  accounts: any;
}

const AccountTable: React.FC<AccountTableProps> = (
  props
): React.ReactElement => {
  return (
    <>
      <Table accounts={props.accounts} heading="User Acounts" />
    </>
  );
};

export default AccountTable;
