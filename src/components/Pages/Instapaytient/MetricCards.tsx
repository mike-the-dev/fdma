import React from "react";
import { Card, CardBody } from "@heroui/card";
import { Icon } from "@iconify/react";
import { GlobalAnalytics } from "@/features/instapaytient/accounts/analytics.schema";
import { formatCurrency } from "@/utils/formatters";

type MetricCardProps = {
  title: string;
  value: string;
  icon: string;
  trend: {
    value: string;
    isPositive: boolean;
  };
  color: "primary" | "success" | "warning";
};

const MetricCard = ({ title, value, icon, trend, color }: MetricCardProps) => {
  const colorMap = {
    primary: {
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      trendColor: trend.isPositive ? "text-success-500" : "text-danger-500",
    },
    success: {
      iconBg: "bg-success/10",
      iconColor: "text-success",
      trendColor: trend.isPositive ? "text-success-500" : "text-danger-500",
    },
    warning: {
      iconBg: "bg-warning/10",
      iconColor: "text-warning",
      trendColor: trend.isPositive ? "text-success-500" : "text-danger-500",
    },
  };

  return (
    <Card 
      isBlurred
      className="w-full transition-all duration-200 hover:shadow-md p-2"
      shadow="sm"
    >
      <Card
        className="bg-background/70"
      >
        <CardBody className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-default-500">{title}</p>
              <h3 className="mt-1 text-2xl font-semibold text-foreground">{value}</h3>
              {/* <div className="mt-2 flex items-center">
                <Icon 
                  icon={trend.isPositive ? "lucide:trending-up" : "lucide:trending-down"} 
                  className={`mr-1 h-4 w-4 ${colorMap[color].trendColor}`} 
                />
                <span className={`text-xs ${colorMap[color].trendColor}`}>
                  {trend.value} {trend.isPositive ? "increase" : "decrease"}
                </span>
              </div> */}
            </div>
            <div className={`rounded-full p-3 ${colorMap[color].iconBg}`}>
              <Icon icon={icon} className={`h-6 w-6 ${colorMap[color].iconColor}`} />
            </div>
          </div>
        </CardBody>

      </Card>
    </Card>
  );
};

type MetricCardsProps = {
  analytics: GlobalAnalytics | null;
};

export const MetricCards = ({ analytics }: MetricCardsProps) => {
  const payoutStats = analytics?.payoutStats;
  
  return (
    <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <MetricCard
        title="Affirm Total"
        value={formatCurrency(payoutStats?.affirmTotalCents ?? 0)}
        icon="lucide:credit-card"
        trend={{ value: "12.5%", isPositive: true }}
        color="primary"
      />
      <MetricCard
        title="Overall Total"
        value={formatCurrency(payoutStats?.grandTotalCents ?? 0)}
        icon="lucide:bar-chart-2"
        trend={{ value: "8.2%", isPositive: true }}
        color="success"
      />
      <MetricCard
        title="Authorize Total"
        value={formatCurrency(payoutStats?.normalTotalCents ?? 0)}
        icon="lucide:check-circle"
        trend={{ value: "3.1%", isPositive: false }}
        color="warning"
      />
    </div>
  );
};
