"use client";

import React from "react";

import styles from "../page.module.css";

import { CreateOnboardingSession, OnboardingSessionsTable } from "@/features/onboardingSessionCreation";

const SessionCreationPage: React.FC = (): React.ReactElement => {
  return (
    <div style={{ maxWidth: "1300px", margin: "0 auto", padding: "0 16px" }}>
      <div className={styles.row}>
        <div className={styles.column}>
          <CreateOnboardingSession />
          <div style={{ marginTop: "24px" }}>
            <OnboardingSessionsTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionCreationPage;
