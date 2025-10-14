"use client";

import styles from "../../page.module.css";

import AccountDeploymentForm from "@/components/AccountDeploymentForm";

const AccountDeployment = () => {
  return (
    <div style={{ maxWidth: "1300px", margin: "0 auto", padding: "0 16px" }}>
      <div className={styles.row}>
        <div className={styles.column}>
          <AccountDeploymentForm />
        </div>
      </div>
    </div>
  );
};

export default AccountDeployment;
