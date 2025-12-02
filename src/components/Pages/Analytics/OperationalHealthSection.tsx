import React from "react";
import { Icon } from "@iconify/react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Tooltip } from "@heroui/tooltip";
import { Badge } from "@heroui/badge";
import { Progress } from "@heroui/progress";
import { useOperationalHealthSection } from "@/features/analytics/dashboard/useOperationalHealth";

interface OperationalHealthProps {
  fullWidth?: boolean;
};

export const OperationalHealthSection: React.FC<OperationalHealthProps> = ({ fullWidth = false }) => {
  const { data, isLoading, error } = useOperationalHealthSection();

  if (isLoading || !data) {
    return (
      <Card className={`bg-content1 ${fullWidth ? "col-span-2" : ""}`}>
        <CardBody>
          <div className="py-4 text-sm text-foreground-400">Loading operational health...</div>
        </CardBody>
      </Card>
    );
  };

  if (error) {
    return (
      <Card className={`bg-content1 ${fullWidth ? "col-span-2" : ""}`}>
        <CardBody>
          <div className="py-4 text-sm text-danger">Failed to load operational health.</div>
        </CardBody>
      </Card>
    );
  };

  const formatDuration = (ms: number | null) => {
    if (!ms || ms <= 0) return "N/A";

    const totalSeconds = Math.floor(ms / 1000);
    if (totalSeconds < 60) {
      return `${totalSeconds}s`;
    };

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    if (minutes < 60) {
      return seconds > 0 ? `${minutes}m ${seconds}s` : `${minutes}m`;
    };

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success": return "success";
      case "failure": return "danger";
      default: return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success": return "lucide:check-circle";
      case "failure": return "lucide:alert-circle";
      default: return "lucide:info";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "success": return "Healthy";
      case "failure": return "Error";
      default: return "Unknown";
    }
  };

  return (
    <Card className={`bg-content1 ${fullWidth ? 'col-span-2' : ''}`}>
      <CardHeader className="flex flex-col gap-1 px-6 pb-0 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold mr-1">Operational Health</h2>
          <Tooltip content="Current system operational status">
            <Icon icon="lucide:info" className="text-foreground-400" />
          </Tooltip>
        </div>
        <p className="text-sm text-foreground-500">System sync status and health</p>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="rounded-medium bg-content2 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Sync Status</h3>
                <Badge color={getStatusColor(data.lastRunStatus)} variant="flat">
                  <div className="flex items-center gap-1">
                    <Icon icon={getStatusIcon(data.lastRunStatus)} className="text-sm" />
                    <span>{getStatusText(data.lastRunStatus)}</span>
                  </div>
                </Badge>
              </div>
              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs text-foreground-500">Health Score</span>
                  <span className="text-xs font-medium">{data.healthScorePercent}%</span>
                  <Progress
                    value={data.healthScorePercent}
                    color={getStatusColor(data.lastRunStatus)}
                    size="sm"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-medium bg-content2 p-4">
                <div className="text-xs text-foreground-500">Last Sync</div>
                <div className="text-lg font-semibold">
                  {data.lastRunAt ? new Date(data.lastRunAt).toLocaleString() : "N/A"}
                </div>
              </div>
              <div className="rounded-medium bg-content2 p-4">
                <div className="text-xs text-foreground-500">Duration</div>
                <div className="text-lg font-semibold">{formatDuration(data.lastRunDurationMs)}</div>
              </div>
            </div>

            <div className="rounded-medium bg-content2 p-4">
              <div className="text-xs text-foreground-500">Payouts Processed</div>
              <div className="text-lg font-semibold">
                {data.totalPayoutsProcessed.toLocaleString()}
              </div>
            </div>

            <div className="rounded-medium bg-content2 p-4">
              <div className="text-xs text-foreground-500">Accounts Processed</div>
              <div className="text-lg font-semibold">
                {data.accountsProcessed.toLocaleString()}
              </div>
            </div>
          </div>

          {/* <div className="space-y-4">
            <div className="rounded-medium bg-content2 p-4">
              <h3 className="mb-3 text-sm font-medium">Failed Accounts</h3>
              {data.failedAccounts.length > 0 ? (
                <div className="space-y-3">
                  {data.failedAccounts.map((account) => (
                    <div key={account.id} className="rounded-medium bg-danger-500/10 p-3">
                      <div className="flex items-center gap-2">
                        <Icon icon="lucide:alert-circle" className="text-danger" />
                        <span className="font-medium">{account.name}</span>
                      </div>
                      <div className="mt-1 text-xs text-foreground-500">{account.reason}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-success">
                  <Icon icon="lucide:check-circle" />
                  <span>No failed accounts</span>
                </div>
              )}
            </div>

            <div className="rounded-medium bg-content2 p-4">
              <h3 className="mb-3 text-sm font-medium">Skipped Accounts</h3>
              {data.skippedAccounts.length > 0 ? (
                <div className="space-y-3">
                  {data.skippedAccounts.map((account) => (
                    <div key={account.id} className="rounded-medium bg-warning-500/10 p-3">
                      <div className="flex items-center gap-2">
                        <Icon icon="lucide:alert-triangle" className="text-warning" />
                        <span className="font-medium">{account.name}</span>
                      </div>
                      <div className="mt-1 text-xs text-foreground-500">{account.reason}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-success">
                  <Icon icon="lucide:check-circle" />
                  <span>No skipped accounts</span>
                </div>
              )}
            </div>
          </div> */}
        </div>
      </CardBody>
    </Card>
  );
};