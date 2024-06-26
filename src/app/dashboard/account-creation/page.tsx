import CustomerCreation from "@/components/CustomerCreation";
import React from "react";
import styles from "../../page.module.css";

const AccountCreation: React.FC = async (): Promise<React.ReactElement> => {
  return (
    <div>
      <div className={styles.row}>
        <div className={styles.column}>
          <CustomerCreation />
        </div>
      </div>
    </div>
  );
};

export default AccountCreation;