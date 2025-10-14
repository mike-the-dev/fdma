"use client";

import React, { useEffect, useState } from "react";
import { Spacer } from "@heroui/spacer";
import { Card } from "@heroui/card";
import { Spinner } from "@heroui/spinner";

import styles from "../../page.module.css";

import apiClient from "@/utils/apiClient";
import AccountTableInstapaytient from "@/components/AccountTableInstapaytient";
import { AccountInstapaytient } from "@/types/AccountInstapaytient";
import { useAuthContext } from "@/context/AuthContext";

interface HomeProps {}

const Home = (): React.ReactElement => {
  const { isAuthenticated, isLoading: authLoading } = useAuthContext();
  const [accounts, setAccounts] = useState<AccountInstapaytient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAccounts = async () => {
    try {
      const response = await apiClient.get<AccountInstapaytient[]>(
        "/api/user/listAccounts"
      );

      console.log("accounts: ", response.data);
      setAccounts(response.data);
    } catch (err: any) {
      console.error("Error fetching accounts:", err);

      // If it's a token expiration error, don't show error message as user will be logged out
      if (err.isTokenExpired) {
        return;
      }

      const errorMessage =
        err.response?.data?.message || err.message || "Failed to load accounts";

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch accounts when authentication is complete and user is authenticated
    if (!authLoading && isAuthenticated) {
      fetchAccounts();
    }
  }, [authLoading, isAuthenticated]);

  if (authLoading || isLoading) {
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
              refetchAccounts={fetchAccounts}
            />
            <Spacer y={6} />
            {/* <UserForm heading={"CREATE NEW USER"} /> */}
          </Card>
          {/* <Spacer y={10} /> */}
          {/* <Divider /> */}
          {/* <Spacer y={4} /> */}
          {/* <EmployeeTable accounts={accounts} employees={employees} /> */}
        </div>
      </div>
    </div>
  );
};

export default Home;
