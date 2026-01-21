"use client";

import React from "react";
import { Spacer } from "@heroui/spacer";
import { Card } from "@heroui/card";
import { Spinner } from "@heroui/spinner";

import styles from "../../page.module.css";

import AccountTableInstapaytient from "@/components/AccountTableInstapaytient";
import { useAccounts } from "@/features/instapaytient/accounts/useAccounts";
import { useGlobalAnalytics } from "@/features/instapaytient/accounts/useGlobalAnalytics";

interface HomeProps {}

const Home = (): React.ReactElement => {
  const { accounts, isLoading, error, refetch } = useAccounts();
  const { analytics } = useGlobalAnalytics();

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <Spinner color="secondary" />
          <Spacer y={2} />
          <p>Loading accounts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: "1600px", margin: "0 auto", padding: "0 16px" }}>
        <div className={styles.row}>
          <div className={styles.column}>
            <Card
              isBlurred
              className="border-none bg-background/60 dark:bg-default-100/50"
              shadow="sm"
              style={{ padding: "12px 12px 12px 12px", width: "100%" }}
            >
              <h3>Error</h3>
              <p className="text-small text-danger">{error}</p>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1600px", margin: "0 auto", padding: "0 16px" }}>
      <div className={styles.row}>
        <div className={styles.column}>
          <Card
            isBlurred
            className="border-none bg-background/60 dark:bg-default-100/50"
            shadow="sm"
            style={{ padding: "12px 12px 12px 12px", width: "100%" }}
          >
            <h3>User Accounts</h3>
            <p className="text-small text-default-500">
              List of user customer accounts.
            </p>
            <Spacer y={4} />
            <AccountTableInstapaytient
              accounts={accounts}
              refetchAccounts={refetch}
            />
            <Spacer y={6} />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;
