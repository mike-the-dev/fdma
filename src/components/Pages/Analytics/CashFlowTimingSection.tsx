import React from "react";
import { Icon } from "@iconify/react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Tooltip } from "@heroui/tooltip";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";
import { useCashFlowTimingSection } from "@/features/analytics/dashboard/useCashFlowTiming";

interface CashFlowTimingProps {
  fullWidth?: boolean;
};

export const CashFlowTimingSection: React.FC<CashFlowTimingProps> = ({ fullWidth = false }) => {
  const { data, isLoading, error } = useCashFlowTimingSection();

  if (isLoading || !data) {
    return (
      <Card className={`bg-content1 ${fullWidth ? "col-span-2" : ""}`}>
        <CardBody>
          <div className="py-4 text-sm text-foreground-400">Loading cash flow timing...</div>
        </CardBody>
      </Card>
    );
  };

  if (error) {
    return (
      <Card className={`bg-content1 ${fullWidth ? "col-span-2" : ""}`}>
        <CardBody>
          <div className="py-4 text-sm text-danger">Failed to load cash flow timing.</div>
        </CardBody>
      </Card>
    );
  };

  const affirmAvg = data.affirm.avgDays ?? 0;
  const normalAvg = data.normal.avgDays ?? 0;
  const overallMedian = data.overall.medianDays ?? 0;

  const renderMetricCard = (
    title: string,
    metrics: { avgDays: number | null; medianDays: number | null; minDays: number | null; maxDays: number | null },
  ) => (
    <div className="rounded-medium bg-content2 p-4">
      <h4 className="mb-3 text-sm font-medium">{title}</h4>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="text-xs text-foreground-500">Average</div>
          <div className="text-lg font-semibold">
            {metrics.avgDays != null ? `${metrics.avgDays.toFixed(1)} days` : "N/A"}
          </div>
        </div>
        <div>
          <div className="text-xs text-foreground-500">Median</div>
          <div className="text-lg font-semibold">
            {metrics.medianDays != null ? `${metrics.medianDays.toFixed(1)} days` : "N/A"}
          </div>
        </div>
        <div>
          <div className="text-xs text-foreground-500">Min</div>
          <div className="text-base">
            {metrics.minDays != null ? `${metrics.minDays.toFixed(1)} days` : "N/A"}
          </div>
        </div>
        <div>
          <div className="text-xs text-foreground-500">Max</div>
          <div className="text-base">
            {metrics.maxDays != null ? `${metrics.maxDays.toFixed(1)} days` : "N/A"}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Card className={`bg-content1 ${fullWidth ? 'col-span-2' : ''}`}>
      <CardHeader className="flex flex-col gap-1 px-6 pb-0 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold mr-1">Cash Flow Timing</h2>
          <Tooltip content="Time from payment to payout arrival in bank">
            <Icon icon="lucide:info" className="text-foreground-400" />
          </Tooltip>
        </div>
        <p className="text-sm text-foreground-500">Days from payment to bank arrival</p>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {renderMetricCard("Overall Timing", data.overall)}
          {renderMetricCard("Affirm Timing", data.affirm)}
          {renderMetricCard("Normal Timing", data.normal)}
        </div>

        <Divider className="my-6" />

        <div>
          <h3 className="mb-4 text-sm font-medium">Processing Time Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.distribution}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="label" stroke="#a1a1aa" />
                <YAxis
                  stroke="#a1a1aa"
                />
                <RechartsTooltip
                  formatter={(value: number) => [value, "Payouts"]}
                  labelFormatter={(label) => `${label} days bucket`}
                  contentStyle={{
                    backgroundColor: "#1E2235",
                    border: "none",
                    borderRadius: "8px",
                  }}
                />
                <Bar
                  dataKey="count"
                  name="Count"
                  fill="#4F46E5"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="mb-2 text-sm font-medium">Processing Time Analysis</h3>
          <p className="text-sm text-foreground-500">
            {affirmAvg < normalAvg ? (
              <>
                Affirm payouts process{" "}
                <span className="text-success">
                  {(normalAvg - affirmAvg).toFixed(1)} days faster
                </span>{" "}
                than normal payment methods on average. The majority of payouts complete within{" "}
                {Math.ceil(overallMedian)} days.
              </>
            ) : (
              <>
                Normal payouts process{" "}
                <span className="text-success">
                  {(affirmAvg - normalAvg).toFixed(1)} days faster
                </span>{" "}
                than Affirm on average. The majority of payouts complete within{" "}
                {Math.ceil(overallMedian)} days.
              </>
            )}
          </p>
        </div>
      </CardBody>
    </Card>
  );
};