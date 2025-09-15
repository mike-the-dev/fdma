import React from "react";
import Table from "./table";

interface AccountTableInstapaytientProps {
  accounts: any
};

const AccountTableInstapaytient: React.FC<AccountTableInstapaytientProps> = (props): React.ReactElement => {
  return (
    <>
      <Table 
        heading="Instapaytient Accounts" 
        accounts={props.accounts}
      />
    </>
  );
}

export default AccountTableInstapaytient;
