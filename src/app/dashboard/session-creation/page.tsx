"use client";

import React from "react";
import { Tabs, Tab } from "@heroui/tabs";

import styles from "../../page.module.css";

import {
  CreateOnboardingSession,
  OnboardingSessionsTable,
} from "@/features/onboardingSessionCreation";
import { StripeRedirectSessionsTable } from "@/features/stripeRedirectSessions";

const SessionCreationPage: React.FC = (): React.ReactElement => {
  return (
    <div style={{ maxWidth: "1300px", margin: "0 auto", padding: "0 16px" }}>
      <div className={styles.row}>
        <div className={styles.column}>
          <Tabs aria-label="Session form tabs" radius="full">
            <Tab key="onboarding-link" title="Onbarding Link">
              <div style={{ marginTop: "16px" }}>
                <CreateOnboardingSession />
              </div>
            </Tab>
            <Tab key="stripe-link" title="Stripe Link">
              <div style={{ marginTop: "16px" }} />
            </Tab>
          </Tabs>
          <div style={{ marginTop: "24px" }}>
            <Tabs aria-label="Session tables" radius="full">
              <Tab key="onboarding" title="Onboarding Sessions">
                <div style={{ marginTop: "16px" }}>
                  <OnboardingSessionsTable />
                </div>
              </Tab>
              <Tab key="stripe" title="Stripe Redirect Sessions">
                <div style={{ marginTop: "16px" }}>
                  <StripeRedirectSessionsTable />
                </div>
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionCreationPage;
