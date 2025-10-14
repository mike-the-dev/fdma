import React from "react";

import Table from "./table";

interface AccountTableInstapaytientProps {
  accounts: any;
  refetchAccounts: () => Promise<void>;
}

const AccountTableInstapaytient: React.FC<AccountTableInstapaytientProps> = (
  props
): React.ReactElement => {
  return (
    <>
      <Table
        accounts={props.accounts}
        heading="Instapaytient Accounts"
        refetchAccounts={props.refetchAccounts}
      />
    </>
  );
};

export default AccountTableInstapaytient;
