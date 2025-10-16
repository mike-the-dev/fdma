"use client";

import type { Scheduler } from "@/types/Scheduler";

import React, { useEffect, useState } from "react";
import { Spacer } from "@heroui/spacer";
import { Card } from "@heroui/card";
import { Spinner } from "@heroui/spinner";

import styles from "../../page.module.css";

import apiClient from "@/utils/apiClient";
import SchedulerTable from "@/components/SchedulerTable";
import { useAuthContext } from "@/context/AuthContext";

interface SchedulerProps {}

const Scheduler = (): React.ReactElement => {
  const { isAuthenticated, isLoading: authLoading } = useAuthContext();
  const [schedulers, setSchedulers] = useState<Scheduler[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSchedulers = async () => {
    try {
      const response = await apiClient.get<Scheduler[]>("/api/user/schedulers");

      console.log("schedulers: ", response.data);
      setSchedulers(response.data);
    } catch (err: any) {
      console.error("Error fetching schedulers:", err);

      // If it's a token expiration error, don't show error message as user will be logged out
      if (err.isTokenExpired) {
        return;
      }

      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to load schedulers";

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch schedulers when authentication is complete and user is authenticated
    if (!authLoading && isAuthenticated) {
      fetchSchedulers();
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
          <p>Loading schedulers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          maxWidth: "1600px",
          width: "100%",
          margin: "0 auto",
          padding: "0 16px",
        }}
      >
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
    <div
      style={{
        maxWidth: "1600px",
        width: "100%",
        margin: "0 auto",
        padding: "0 16px",
      }}
    >
      <div className={styles.row}>
        <div className={styles.column}>
          <Card
            isBlurred
            className="border-none bg-background/60 dark:bg-default-100/50"
            shadow="sm"
            style={{ padding: "12px 12px 12px 12px", width: "100%" }}
          >
            <h3>Scheduler</h3>
            <p className="text-small text-default-500">
              Manage your scheduling and appointments.
            </p>
            <Spacer y={4} />
            <SchedulerTable schedules={schedulers} />
            <Spacer y={6} />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Scheduler;
