import React from "react";
import { Icon } from "@iconify/react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Tooltip } from "@heroui/tooltip";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";
import { useVolumeStabilitySection } from "@/features/analytics/dashboard/useVolumeStability";

interface VolumeStabilityProps {
  fullWidth?: boolean;
};

export const VolumeStabilitySection: React.FC<VolumeStabilityProps> = ({ fullWidth = false }) => {
  const { data, isLoading, error } = useVolumeStabilitySection();

  if (isLoading || !data) {
    return (
      <Card className={`bg-content1 ${fullWidth ? "col-span-2" : ""}`}>
        <CardBody>
          <div className="py-4 text-sm text-foreground-400">Loading volume stability...</div>
        </CardBody>
      </Card>
    );
  };

  if (error) {
    return (
      <Card className={`bg-content1 ${fullWidth ? "col-span-2" : ""}`}>
        <CardBody>
          <div className="py-4 text-sm text-danger">Failed to load volume stability.</div>
        </CardBody>
      </Card>
    );
  };

  const chartData = data.trend.map((t) => ({
    date: t.date,
    volume: t.grandTotalCents,
    count: t.grandCount,
  }));

  const vol = data.stats.coefficientOfVariation ?? 0;

  const minCents = data.stats.minDailyGrandTotalCents;
  const maxCents = data.stats.maxDailyGrandTotalCents;
  const ratioText =
    minCents > 0
      ? ((maxCents / minCents) - 1).toFixed(1) + "x"
      : "N/A";

  const formatCurrency = (cents: number) => {
    const dollars = cents / 100;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(dollars);
  };

  const getVolatilityLabel = (volatility: number) => {
    if (volatility < 0.2) return "Very Stable";
    if (volatility < 0.4) return "Stable";
    if (volatility < 0.6) return "Moderate";
    if (volatility < 0.8) return "Volatile";
    return "Highly Volatile";
  };

  const getVolatilityColor = (volatility: number) => {
    if (volatility < 0.2) return "text-success";
    if (volatility < 0.4) return "text-success-500";
    if (volatility < 0.6) return "text-warning-500";
    if (volatility < 0.8) return "text-warning";
    return "text-danger";
  };

  return (
    <Card className={`bg-content1 ${fullWidth ? 'col-span-2' : ''}`}>
      <CardHeader className="flex flex-col gap-1 px-6 pb-0 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold mr-1">Volume Stability</h2>
          <Tooltip content="Stability and cadence of payout volumes over time">
            <Icon icon="lucide:info" className="text-foreground-400" />
          </Tooltip>
        </div>
        <p className="text-sm text-foreground-500">Daily payout volume patterns</p>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-medium bg-content2 p-4">
            <div className="text-xs text-foreground-500">Average Daily</div>
            <div className="text-lg font-semibold">{formatCurrency(data.stats.averageDailyGrandTotalCents)}</div>
          </div>
          <div className="rounded-medium bg-content2 p-4">
            <div className="text-xs text-foreground-500">Maximum Daily</div>
            <div className="text-lg font-semibold">{formatCurrency(data.stats.maxDailyGrandTotalCents)}</div>
          </div>
          <div className="rounded-medium bg-content2 p-4">
            <div className="text-xs text-foreground-500">Minimum Daily</div>
            <div className="text-lg font-semibold">{formatCurrency(data.stats.minDailyGrandTotalCents)}</div>
          </div>
          <div className="rounded-medium bg-content2 p-4">
            <div className="text-xs text-foreground-500">Volatility</div>
            <div className={`text-lg font-semibold ${getVolatilityColor(vol)}`}>
              {getVolatilityLabel(vol)}
            </div>
            <div className="text-xs text-foreground-500">
              {(vol * 100).toFixed(1)}% coefficient
            </div>
          </div>
        </div>
        <Divider className="my-6" />
        <div>
          <h3 className="mb-4 text-sm font-medium">Daily Volume Trend</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" stroke="#a1a1aa" />
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
                    if (name === "volume") return [formatCurrency(value), "Volume"];
                    return [value, "Count"];
                  }}
                  labelFormatter={(label) => `Date: ${label}`}
                  contentStyle={{ backgroundColor: '#1E2235', border: 'none', borderRadius: '8px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="volume"
                  name="volume"
                  stroke="#4F46E5" 
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="mt-6">
          <h3 className="mb-2 text-sm font-medium">Volume Stability Analysis</h3>
          <p className="text-sm text-foreground-500">
            {vol < 0.4 ? (
              <>
                Payout volume is <span className="text-success">stable</span> with consistent daily patterns.
                The difference between maximum and minimum daily volumes is{" "}{ratioText}.
              </>
            ) : vol < 0.7 ? (
              <>
                Payout volume shows <span className="text-warning">moderate volatility</span> with some daily fluctuations.
                The difference between maximum and minimum daily volumes is{" "}{ratioText}.
              </>
            ) : (
              <>
                Payout volume is <span className="text-danger">highly volatile</span> with significant daily fluctuations.
                The difference between maximum and minimum daily volumes is{" "}{ratioText}.
              </>
            )}
          </p>
        </div>
      </CardBody>
    </Card>
  );
};