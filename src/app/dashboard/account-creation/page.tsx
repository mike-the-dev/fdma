"use client";

import React from "react";

import styles from "../../page.module.css";

import CustomerCreation from "@/components/CustomerCreation";

interface AccountCreationProps {}

const AccountCreation: React.FC<
  AccountCreationProps
> = (): React.ReactElement => {
  return (
    <div style={{ maxWidth: "1300px", margin: "0 auto", padding: "0 16px" }}>
      <div className={styles.row}>
        <div className={styles.column}>
          <CustomerCreation />
        </div>
      </div>
    </div>
  );
};

export default AccountCreation;
