"use client";

import { useState, createContext, useContext } from "react";
import { SummaryMetrics } from "./SummaryMetrics";
import { AnalyticsTabs } from "./AnalyticsTabs";
import { Card } from "@heroui/card";
import { DateRangeFilter } from "./DateRangeFilter";

interface DateRange {
  from: string;
  to: string;
};

const AnalyticsRangeContext = createContext<{
  range: DateRange;
  setRange: (range: DateRange) => void;
} | null>(null);

const toLocalDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const monthStr = month < 10 ? `0${month}` : `${month}`;
  const dayStr = day < 10 ? `0${day}` : `${day}`;

  return `${year}-${monthStr}-${dayStr}`;
};

export const useAnalyticsRange = () => {
  const ctx = useContext(AnalyticsRangeContext);
  if (!ctx) throw new Error("useAnalyticsRange must be used within AnalyticsRangeContext");
  return ctx;
};

export function AnalyticsDashboardShell(props: { initialFrom: string; initialTo: string }) {
  const [range, setRange] = useState<DateRange>({
    from: props.initialFrom,
    to: props.initialTo,
  });

  const [fromYear, fromMonth, fromDay] = range.from.split("-").map(Number);
  const [toYear, toMonth, toDay] = range.to.split("-").map(Number);

  const dateRange = {
    start: new Date(fromYear, fromMonth - 1, fromDay),
    end: new Date(toYear, toMonth - 1, toDay),
  };

  const handleDateRangeChange = (next: { start: Date; end: Date }) => {
    setRange({
      from: toLocalDateString(next.start),
      to: toLocalDateString(next.end),
    });
  };

  return (
    <AnalyticsRangeContext.Provider value={{ range, setRange }}>
      <div className="mb-4 flex justify-end">
        <DateRangeFilter value={dateRange} onChange={handleDateRangeChange} />
      </div>

      <Card
        isBlurred
        className="border-none bg-background/60 dark:bg-default-100/50"
        shadow="sm"
        style={{ padding: "12px 12px 12px 12px", width: "100%" }}
      >
        {/* Top summary cards */}
        <SummaryMetrics />

        {/* Tabs: Period Comparison, Payment Methods, Merchant Accounts, etc. */}
        <AnalyticsTabs />
      </Card>
    </AnalyticsRangeContext.Provider>
  );
};