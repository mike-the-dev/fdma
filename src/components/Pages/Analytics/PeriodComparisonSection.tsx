"use client";

import React from "react";
import { Icon } from "@iconify/react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Tooltip } from "@heroui/tooltip";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from "recharts";

import { usePeriodComparisonSection } from "@/features/analytics/dashboard/usePeriodComparison";

interface PeriodComparisonSectionProps {
  fullWidth?: boolean;
};

export const PeriodComparisonSection: React.FC<PeriodComparisonSectionProps> = ({ fullWidth = false }) => {
  const { data, isLoading, error } = usePeriodComparisonSection();

  if (isLoading || !data) {
    return (
      <Card className={`bg-content1 ${fullWidth ? "col-span-2" : ""}`}>
        <CardBody>
          <div className="py-4 text-sm text-foreground-400">Loading period comparison...</div>
        </CardBody>
      </Card>
    );
  };

  if (error) {
    return (
      <Card className={`bg-content1 ${fullWidth ? "col-span-2" : ""}`}>
        <CardBody>
          <div className="py-4 text-sm text-danger">Failed to load period comparison.</div>
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

  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const renderGrowthIndicator = (current: number, previous: number) => {
    const growth = calculateGrowth(current, previous);
    const isPositive = growth > 0;

    const icon = isPositive
      ? <Icon icon="lucide:trending-up" className="text-success" />
      : <Icon icon="lucide:trending-down" className="text-danger" />;

    return (
      <div className={`flex items-center gap-1 ${isPositive ? "text-success" : "text-danger"}`}>
        {icon}
        <span>{Math.abs(growth).toFixed(1)}%</span>
      </div>
    );
  };

  const comparisonData = [
    {
      name: "Month",
      current: data.thisMonth.total,
      previous: data.lastMonth.total,
      currentLabel: "This Month",
      previousLabel: "Last Month",
      growth: calculateGrowth(data.thisMonth.total, data.lastMonth.total),
    },
    {
      name: "Week",
      current: data.thisWeek.total,
      previous: data.lastWeek.total,
      currentLabel: "This Week",
      previousLabel: "Last Week",
      growth: calculateGrowth(data.thisWeek.total, data.lastWeek.total),
    },
    {
      name: "30 Days",
      current: data.last30Days.total,
      previous: data.prior30Days.total,
      currentLabel: "Last 30 Days",
      previousLabel: "Prior 30 Days",
      growth: calculateGrowth(data.last30Days.total, data.prior30Days.total),
    },
  ];

  const chartData = comparisonData.map((item) => ({
    name: item.name,
    Current: item.current,
    Previous: item.previous,
    growth: item.growth,
  }));

  return (
    <Card className={`bg-content1 ${fullWidth ? "col-span-2" : ""}`}>
      <CardHeader className="flex flex-col gap-1 px-6 pb-0 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold mr-1">Period Comparison</h2>
          <Tooltip content="Compare payout volumes across different time periods">
            <Icon icon="lucide:info" className="text-foreground-400" />
          </Tooltip>
        </div>
        <p className="text-sm text-foreground-500">Growth trends across different time periods</p>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {comparisonData.map((item, index) => (
            <div key={index} className="flex flex-col gap-2 rounded-medium bg-content2 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">{item.name} Comparison</h3>
                {renderGrowthIndicator(item.current, item.previous)}
              </div>
              <div className="text-lg font-semibold">{formatCurrency(item.current)}</div>
              <div className="text-xs text-foreground-500">
                vs {formatCurrency(item.previous)} ({item.previousLabel})
              </div>
            </div>
          ))}
        </div>
        <Divider className="my-6" />
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="#a1a1aa" />
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
                formatter={(value: number) => [formatCurrency(value), ""]}
                labelFormatter={(label) => `${label} Comparison`}
                contentStyle={{ backgroundColor: "#1E2235", border: "none", borderRadius: "8px" }}
              />
              <Legend />
              <Bar dataKey="Current" fill="#4F46E5" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Previous" fill="#6366f1" radius={[4, 4, 0, 0]} opacity={0.6} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-6">
          <h3 className="mb-4 text-sm font-medium">Payment Method Growth</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-medium bg-content2 p-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm">Affirm Payouts</h4>
                {renderGrowthIndicator(data.thisMonth.affirm, data.lastMonth.affirm)}
              </div>
              <div className="mt-2 text-lg font-semibold">{formatCurrency(data.thisMonth.affirm)}</div>
              <div className="text-xs text-foreground-500">
                vs {formatCurrency(data.lastMonth.affirm)} last month
              </div>
            </div>
            <div className="rounded-medium bg-content2 p-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm">Normal Payouts</h4>
                {renderGrowthIndicator(data.thisMonth.normal, data.lastMonth.normal)}
              </div>
              <div className="mt-2 text-lg font-semibold">{formatCurrency(data.thisMonth.normal)}</div>
              <div className="text-xs text-foreground-500">
                vs {formatCurrency(data.lastMonth.normal)} last month
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};