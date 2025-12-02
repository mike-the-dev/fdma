"use client";

import React from "react";
import { Icon } from "@iconify/react";
import { Card, CardBody } from "@heroui/card";
import { Tooltip } from "@heroui/tooltip";
import { Spinner } from "@heroui/spinner";

import { useAnalyticsRange } from "./AnalyticsDashboardShell";
import { useSummaryMetrics as useSummaryMetricsQuery } from "@/features/analytics/analytics.service";

interface SummaryMetricsData {
  totalPayouts: number;
  totalVolume: number;
  totalPercentChange: number;
  affirm: {
    count: number;
    volume: number;
    percentChange: number;
  };
  normal: {
    count: number;
    volume: number;
    percentChange: number;
  };
  activeAccounts: number;
  avgProcessingDays: number;
  lastSyncTime: string;
};

const useSummaryMetricsSection = (): {
  data: SummaryMetricsData | null;
  isLoading: boolean;
  error: unknown;
} => {
  const { range } = useAnalyticsRange();
  const { from, to } = range;

  const { data, isLoading, error } = useSummaryMetricsQuery(from, to);

  if (!data) {
    return { data: null, isLoading, error };
  }

  const mapped: SummaryMetricsData = {
    totalPayouts: data.totalPayouts,
    totalVolume: data.totalVolumeCents,
    totalPercentChange: data.totalPercentChange,
    affirm: {
      count: data.affirm.count,
      volume: data.affirm.volumeCents,
      percentChange: data.affirm.percentChange,
    },
    normal: {
      count: data.normal.count,
      volume: data.normal.volumeCents,
      percentChange: data.normal.percentChange,
    },
    activeAccounts: data.activeAccounts,
    avgProcessingDays: data.avgProcessingDays,
    lastSyncTime: data.lastSyncTime,
  };

  return { data: mapped, isLoading, error };
};

export const SummaryMetrics: React.FC = () => {
  const { data, isLoading, error } = useSummaryMetricsSection();

  if (isLoading || !data) {
    return (
      <div className="w-full h-[108px] flex items-center justify-center">
        <Spinner color="primary" />
      </div>
    );
  };

  if (error) {
    // TODO: replace with real error UI
    return <div className="py-4 text-sm text-danger">Failed to load summary metrics.</div>;
  };

  const formatCents = (cents: number) => {
    const dollars = cents / 100;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(dollars);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(num);
  };

  const formatPercentChange = (value: number) => {
    const formattedValue = Math.abs(value).toFixed(1);
    const icon = value > 0
      ? <Icon icon="lucide:trending-up" className="text-success" />
      : <Icon icon="lucide:trending-down" className="text-danger" />;

    return (
      <div className={`flex items-center gap-1 text-sm ${value > 0 ? "text-success" : "text-danger"}`}>
        {icon}
        <span>{formattedValue}%</span>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-content1">
        <CardBody className="gap-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-foreground-500">Total Volume</h3>
            <Tooltip content="Change vs last month (MoM)">
              <Icon icon="lucide:info" className="text-foreground-400" />
            </Tooltip>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-semibold">{formatCents(data.totalVolume)}</span>
            {data.totalPercentChange !== 0 && formatPercentChange(data.totalPercentChange)}
          </div>
          <div className="text-xs text-foreground-400">
            {formatNumber(data.totalPayouts)} payouts
          </div>
        </CardBody>
      </Card>

      <Card className="bg-content1">
        <CardBody className="gap-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-foreground-500">Affirm Volume</h3>
            <Tooltip content="Affirm payout volume — MoM change">
              <Icon icon="lucide:info" className="text-foreground-400" />
            </Tooltip>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-semibold">{formatCents(data.affirm.volume)}</span>
            {data.affirm.percentChange !== 0 && formatPercentChange(data.affirm.percentChange)}
          </div>
          <div className="text-xs text-foreground-400">
            {formatNumber(data.affirm.count)} payouts
          </div>
        </CardBody>
      </Card>

      <Card className="bg-content1">
        <CardBody className="gap-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-foreground-500">Normal Volume</h3>
            <Tooltip content="Card/Normal payout volume — MoM change">
              <Icon icon="lucide:info" className="text-foreground-400" />
            </Tooltip>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-semibold">{formatCents(data.normal.volume)}</span>
            {data.normal.percentChange !== 0 && formatPercentChange(data.normal.percentChange)}
          </div>
          <div className="text-xs text-foreground-400">
            {formatNumber(data.normal.count)} payouts
          </div>
        </CardBody>
      </Card>

      <Card className="bg-content1">
        <CardBody className="gap-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-foreground-500">Active Accounts</h3>
            <Tooltip content="Accounts with at least one payout in period">
              <Icon icon="lucide:info" className="text-foreground-400" />
            </Tooltip>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-semibold">{formatNumber(data.activeAccounts)}</span>
          </div>
          <div className="text-xs text-foreground-400">
            Avg {data.avgProcessingDays.toFixed(1)} days processing
          </div>
        </CardBody>
      </Card>
    </div>
  );
};