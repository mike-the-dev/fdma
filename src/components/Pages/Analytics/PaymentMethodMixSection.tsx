"use client";

import React from "react";
import { Icon } from "@iconify/react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Tooltip } from "@heroui/tooltip";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip as RechartsTooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { usePaymentMethodMixSection } from "@/features/analytics/dashboard/usePaymentMethodMix";

interface PaymentMethodMixSectionProps {
  fullWidth?: boolean;
};

export const PaymentMethodMixSection: React.FC<PaymentMethodMixSectionProps> = ({ fullWidth = false }) => {
  const { data, isLoading, error } = usePaymentMethodMixSection();

  if (isLoading || !data) {
    return (
      <Card className={`bg-content1 ${fullWidth ? "col-span-2" : ""}`}>
        <CardBody>
          <div className="py-4 text-sm text-foreground-400">Loading payment method mix...</div>
        </CardBody>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`bg-content1 ${fullWidth ? "col-span-2" : ""}`}>
        <CardBody>
          <div className="py-4 text-sm text-danger">Failed to load payment method mix.</div>
        </CardBody>
      </Card>
    );
  }

  const formatCurrency = (cents: number) => {
    const dollars = cents / 100;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(dollars);
  };

  const formatPercent = (value: number) => {
    // value is 0–1 ratio
    return `${(value * 100).toFixed(1)}%`;
  };

  const totalVolume = data.volume.affirm + data.volume.normal;
  const totalCount = data.count.affirm + data.count.normal;

  const volumeData = [
    { name: "Affirm", value: data.volume.affirm },
    { name: "Normal", value: data.volume.normal },
  ];

  const countData = [
    { name: "Affirm", value: data.count.affirm },
    { name: "Normal", value: data.count.normal },
  ];

  const COLORS = ["#4F46E5", "#6366f1"];

  return (
    <Card className={`bg-content1 ${fullWidth ? "col-span-2" : ""}`}>
      <CardHeader className="flex flex-col gap-1 px-6 pb-0 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold mr-1">Payment Method Mix</h2>
          <Tooltip content="Distribution of payment methods used for payouts">
            <Icon icon="lucide:info" className="text-foreground-400" />
          </Tooltip>
        </div>
        <p className="text-sm text-foreground-500">Affirm vs normal payment methods</p>
      </CardHeader>
      <CardBody>
        <div className="flex flex-col gap-6">
          {/* Volume & count distribution - side by side */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Volume Distribution */}
            <div>
              <h3 className="mb-2 text-sm font-medium">Volume Distribution</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={volumeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent ? percent * 100 : 0).toFixed(1)}%`}
                      labelLine={false}
                    >
                      {volumeData.map((entry, index) => (
                        <Cell key={`vol-cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      formatter={(value: number) => [formatCurrency(value), "Volume"]}
                      contentStyle={{
                        backgroundColor: "#1E2235",
                        border: "none",
                        borderRadius: "8px",
                      }}
                      itemStyle={{
                        color: "#FFF",
                      }}
                      labelStyle={{
                        color: "#FFF",
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="rounded-medium bg-content2 p-3">
                  <div className="text-xs text-foreground-500">Affirm Volume</div>
                  <div className="text-lg font-semibold">
                    {formatCurrency(data.volume.affirm)}
                  </div>
                  <div className="text-xs text-foreground-500">
                    {formatPercent(totalVolume > 0 ? data.volume.affirm / totalVolume : 0)}
                  </div>
                </div>
                <div className="rounded-medium bg-content2 p-3">
                  <div className="text-xs text-foreground-500">Normal Volume</div>
                  <div className="text-lg font-semibold">
                    {formatCurrency(data.volume.normal)}
                  </div>
                  <div className="text-xs text-foreground-500">
                    {formatPercent(totalVolume > 0 ? data.volume.normal / totalVolume : 0)}
                  </div>
                </div>
              </div>
            </div>

            {/* Count Distribution */}
            <div>
              <h3 className="mb-2 text-sm font-medium">Count Distribution</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={countData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent ? percent * 100 : 0).toFixed(1)}%`}
                      labelLine={false}
                    >
                      {countData.map((entry, index) => (
                        <Cell
                          key={`count-cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                          opacity={0.8}
                        />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      formatter={(value: number) => [
                        (value as number).toLocaleString(),
                        "Payouts",
                      ]}
                      contentStyle={{
                        backgroundColor: "#1E2235",
                        border: "none",
                        borderRadius: "8px",
                      }}
                      itemStyle={{
                        color: "#FFF",
                      }}
                      labelStyle={{
                        color: "#FFF",
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="rounded-medium bg-content2 p-3">
                  <div className="text-xs text-foreground-500">Affirm Count</div>
                  <div className="text-lg font-semibold">
                    {data.count.affirm.toLocaleString()}
                  </div>
                  <div className="text-xs text-foreground-500">
                    {formatPercent(totalCount > 0 ? data.count.affirm / totalCount : 0)}
                  </div>
                </div>
                <div className="rounded-medium bg-content2 p-3">
                  <div className="text-xs text-foreground-500">Normal Count</div>
                  <div className="text-lg font-semibold">
                    {data.count.normal.toLocaleString()}
                  </div>
                  <div className="text-xs text-foreground-500">
                    {formatPercent(totalCount > 0 ? data.count.normal / totalCount : 0)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trend chart */}
          <div>
            <h3 className="mb-2 text-sm font-medium">Affirm Share Trend</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data.trend}
                  margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
                >
                  <defs>
                    <linearGradient id="colorAffirm" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="colorNormal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="date" stroke="#a1a1aa" />
                  <YAxis
                    stroke="#a1a1aa"
                    tickFormatter={(value: number) => `${(value * 100).toFixed(0)}%`}
                  />
                  <RechartsTooltip
                    formatter={(value: number) => [
                      `${((value as number) * 100).toFixed(1)}%`,
                      "",
                    ]}
                    contentStyle={{
                      backgroundColor: "#1E2235",
                      border: "none",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="affirmShare"
                    name="Affirm Share"
                    stackId="1"
                    stroke="#4F46E5"
                    fillOpacity={1}
                    fill="url(#colorAffirm)"
                  />
                  <Area
                    type="monotone"
                    dataKey="normalShare"
                    name="Normal Share"
                    stackId="1"
                    stroke="#6366f1"
                    fillOpacity={1}
                    fill="url(#colorNormal)"
                  />
                  <Legend />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <Divider className="my-6" />
      </CardBody>
    </Card>
  );
};