"use client";

import React from "react";
import { Icon } from "@iconify/react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";
import { Tooltip } from "@heroui/tooltip";
import { Divider } from "@heroui/divider";
import { Progress } from "@heroui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from "recharts";
import { useAccountSizeDistributionSection } from "@/features/analytics/dashboard/useAccountSizeDistribution";
import { useMerchantAccountsLeaderboardSection } from "@/features/analytics/dashboard/useMerchantAccountsLeaderboard";

interface AccountLeaderboardSectionProps {
  fullWidth?: boolean;
};

export const AccountLeaderboardSection: React.FC<AccountLeaderboardSectionProps> = ({ fullWidth = false }) => {
  const { data: sizeData, isLoading: isLoadingSize, error: errorSize } = useAccountSizeDistributionSection();
  const { data: leaderboardData, isLoading: isLoadingLeaderboard, error: errorLeaderboard } = useMerchantAccountsLeaderboardSection();

  if (isLoadingSize || isLoadingLeaderboard || !sizeData || !leaderboardData) {
    return (
      <Card className={`bg-content1 ${fullWidth ? "col-span-2" : ""}`}>
        <CardBody>
          <div className="py-4 text-sm text-foreground-400">Loading merchant accounts...</div>
        </CardBody>
      </Card>
    );
  };

  if (errorSize || errorLeaderboard) {
    return (
      <Card className={`bg-content1 ${fullWidth ? "col-span-2" : ""}`}>
        <CardBody>
          <div className="py-4 text-sm text-danger">Failed to load merchant account metrics.</div>
        </CardBody>
      </Card>
    );
  };

  const formatCurrency = (cents: number) => {
    const dollars = cents / 100;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(dollars);
  };

  const totalActive = sizeData.totalActiveAccounts;

  const smallBucket = sizeData.buckets.find((b) => b.size === "small") || {
    size: "small",
    accountCount: 0,
    grandTotalCents: 0,
  };

  const mediumBucket = sizeData.buckets.find((b) => b.size === "medium") || {
    size: "medium",
    accountCount: 0,
    grandTotalCents: 0,
  };

  const largeBucket = sizeData.buckets.find((b) => b.size === "large") || {
    size: "large",
    accountCount: 0,
    grandTotalCents: 0,
  };

  const smallPct = totalActive > 0 ? (smallBucket.accountCount / totalActive) * 100 : 0;
  const mediumPct = totalActive > 0 ? (mediumBucket.accountCount / totalActive) * 100 : 0;
  const largePct = totalActive > 0 ? (largeBucket.accountCount / totalActive) * 100 : 0;

  const volumeDistribution = [
    {
      range: "Small",
      count: smallBucket.accountCount,
      volumeCents: smallBucket.grandTotalCents,
    },
    {
      range: "Medium",
      count: mediumBucket.accountCount,
      volumeCents: mediumBucket.grandTotalCents,
    },
    {
      range: "Large",
      count: largeBucket.accountCount,
      volumeCents: largeBucket.grandTotalCents,
    },
  ];

  return (
    <Card className={`bg-content1 ${fullWidth ? "col-span-2" : ""}`}>
      <CardHeader className="flex flex-col gap-1 px-6 pb-0 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold mr-1">Merchant Accounts</h2>
          <Tooltip content="Top accounts and size distribution by payout volume">
            <Icon icon="lucide:info" className="text-foreground-400" />
          </Tooltip>
        </div>
        <p className="text-sm text-foreground-500">
          {totalActive} active accounts in this period
        </p>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h3 className="mb-4 text-sm font-medium">Top Accounts by Volume</h3>

            {/* Placeholder table until leaderboard hook is wired */}
            <Table
              aria-label="Top accounts by volume"
              removeWrapper
              className="min-h-[220px]"
            >
              <TableHeader>
                <TableColumn>ACCOUNT</TableColumn>
                <TableColumn>VOLUME</TableColumn>
                <TableColumn>PAYOUTS</TableColumn>
                <TableColumn>AVG SIZE</TableColumn>
              </TableHeader>
              <TableBody emptyContent="No accounts found for this period">
                {leaderboardData.topAccounts.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary">
                          {account.name.charAt(0).toUpperCase()}
                        </div>
                        <span>{account.name.charAt(0) + account.name.slice(1)}</span>
                      </div>
                    </TableCell>
                    <TableCell>{formatCurrency(account.volumeCents)}</TableCell>
                    <TableCell>{account.payoutCount.toLocaleString()}</TableCell>
                    <TableCell>{formatCurrency(account.avgPayoutSizeCents)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-medium">Account Size Distribution</h3>
            <div className="space-y-4">
              <div className="rounded-medium bg-content2 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Small Accounts</span>
                  <span className="text-sm font-medium">{smallPct.toFixed(1)}%</span>
                </div>
                <Progress
                  value={smallPct}
                  color="primary"
                  className="mt-2"
                  size="sm"
                />
                <div className="mt-1 text-xs text-foreground-500">
                  &lt; $10k in selected period
                </div>
              </div>

              <div className="rounded-medium bg-content2 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Medium Accounts</span>
                  <span className="text-sm font-medium">{mediumPct.toFixed(1)}%</span>
                </div>
                <Progress
                  value={mediumPct}
                  color="primary"
                  className="mt-2"
                  size="sm"
                />
                <div className="mt-1 text-xs text-foreground-500">
                  $10k - $50k in selected period
                </div>
              </div>

              <div className="rounded-medium bg-content2 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Large Accounts</span>
                  <span className="text-sm font-medium">{largePct.toFixed(1)}%</span>
                </div>
                <Progress
                  value={largePct}
                  color="primary"
                  className="mt-2"
                  size="sm"
                />
                <div className="mt-1 text-xs text-foreground-500">
                  &gt; $50k in selected period
                </div>
              </div>
            </div>
          </div>
        </div>

        <Divider className="my-6" />

        <div>
          <h3 className="mb-4 text-sm font-medium">Volume Distribution by Account Size</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={volumeDistribution}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="range" stroke="#a1a1aa" />
                <YAxis
                  stroke="#a1a1aa"
                  tickFormatter={(value: number) => {
                    const dollars = value / 100;
                    if (dollars >= 1_000_000) return `$${(dollars / 1_000_000).toFixed(1)}M`;
                    if (dollars >= 1_000) return `$${(dollars / 1_000).toFixed(0)}K`;
                    return `$${dollars.toFixed(0)}`;
                  }}
                />
                <RechartsTooltip
                  formatter={(value: number, name: string) => {
                    if (name === "Volume") return [formatCurrency(value), "Volume"];
                    return [value, "Accounts"];
                  }}
                  contentStyle={{
                    backgroundColor: "#1E2235",
                    border: "none",
                    borderRadius: "8px",
                  }}
                />
                <Bar
                  dataKey="volumeCents"
                  name="Volume"
                  fill="#4F46E5"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};