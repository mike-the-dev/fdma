"use client";

import React, { useState } from "react";
import { Tabs, Tab } from "@heroui/tabs";
import { Card, CardBody } from "@heroui/card";
import { Icon } from "@iconify/react";
import { PeriodComparisonSection } from "./PeriodComparisonSection";
import { PaymentMethodMixSection } from "./PaymentMethodMixSection";
import { AccountLeaderboardSection } from "./AccountLeaderboardSection";
import { VolumeStabilitySection } from "./VolumeStabilitySection";
import { CashFlowTimingSection } from "./CashFlowTimingSection";
import { OperationalHealthSection } from "./OperationalHealthSection";

export const AnalyticsTabs: React.FC = (props) => {
  const [activeTab, setActiveTab] = useState<string>("overview");

  return (
    <div className="mt-8">
      <Tabs
        aria-label="Analytics sections"
        color="primary"
        variant="underlined"
        selectedKey={activeTab}
        onSelectionChange={setActiveTab as any}
        classNames={{
          base: "bg-content1 rounded-lg shadow-sm p-4 w-full",
          tabList: "overflow-x-auto scrollbar-hidden",
          cursor: "bg-primary",
        }}
      >
        <Tab
          key="overview"
          title={
            <div className="flex items-center gap-2">
              <Icon icon="lucide:layout-dashboard" />
              <span>Overview</span>
            </div>
          }
        >
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <PeriodComparisonSection />
            <PaymentMethodMixSection />
            <AccountLeaderboardSection />
            <VolumeStabilitySection />
            <CashFlowTimingSection />
            <OperationalHealthSection />
          </div>
        </Tab>

        <Tab
          key="period-comparison"
          title={
            <div className="flex items-center gap-2">
              <Icon icon="lucide:trending-up" />
              <span>Period Comparison</span>
            </div>
          }
        >
          <Card className="mt-6">
            <CardBody>
              <PeriodComparisonSection fullWidth />
            </CardBody>
          </Card>
        </Tab>

        <Tab
          key="payment-methods"
          title={
            <div className="flex items-center gap-2">
              <Icon icon="lucide:credit-card" />
              <span>Payment Methods</span>
            </div>
          }
        >
          <Card className="mt-6">
            <CardBody>
              <PaymentMethodMixSection fullWidth />
            </CardBody>
          </Card>
        </Tab>

        <Tab
          key="accounts"
          title={
            <div className="flex items-center gap-2">
              <Icon icon="lucide:building" />
              <span>Merchant Accounts</span>
            </div>
          }
        >
          <Card className="mt-6">
            <CardBody>
              <AccountLeaderboardSection fullWidth />
            </CardBody>
          </Card>
        </Tab>

        <Tab
          key="volume"
          title={
            <div className="flex items-center gap-2">
              <Icon icon="lucide:bar-chart-2" />
              <span>Volume Stability</span>
            </div>
          }
        >
          <Card className="mt-6">
            <CardBody>
              <VolumeStabilitySection fullWidth />
            </CardBody>
          </Card>
        </Tab>

        <Tab
          key="cash-flow"
          title={
            <div className="flex items-center gap-2">
              <Icon icon="lucide:calendar-clock" />
              <span>Cash Flow Timing</span>
            </div>
          }
        >
          <Card className="mt-6">
            <CardBody>
              <CashFlowTimingSection fullWidth />
            </CardBody>
          </Card>
        </Tab>

        <Tab
          key="operational"
          title={
            <div className="flex items-center gap-2">
              <Icon icon="lucide:activity" />
              <span>Operational Health</span>
            </div>
          }
        >
          <Card className="mt-6">
            <CardBody>
              <OperationalHealthSection fullWidth />
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
};