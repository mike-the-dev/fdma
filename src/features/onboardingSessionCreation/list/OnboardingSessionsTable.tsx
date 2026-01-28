"use client";

import {
  Table as NextUITable,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from "@heroui/table";
import { Card } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Spacer } from "@heroui/spacer";
import { Spinner } from "@heroui/spinner";

import { useOnboardingSessions } from "../onboardingSessionCreation.service";
import { OnboardingSessionListItem } from "../_shared/onboardingSessionCreation.types";

const formatSessionDate = (dateString: string): string => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "N/A";

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
};

type StageChipConfig = {
  label: string;
  color: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
};

const stageChipConfig: Record<string, StageChipConfig> = {
  collect_stripe: { label: "Collect Stripe", color: "primary" },
  confirm_stripe: { label: "Confirm Stripe", color: "secondary" },
  collect_deployment: { label: "Collect Deployment", color: "warning" },
  confirm_deployment: { label: "Confirm Deployment", color: "warning" },
  complete: { label: "Complete", color: "success" },
};

const columns: { key: keyof OnboardingSessionListItem; label: string }[] = [
  { key: "companyName", label: "COMPANY" },
  { key: "customerName", label: "CUSTOMER" },
  { key: "email", label: "EMAIL" },
  { key: "stage", label: "STAGE" },
  { key: "status", label: "STATUS" },
  { key: "createdAt", label: "CREATED" },
  { key: "expiresAt", label: "EXPIRES" },
];

const OnboardingSessionsTable = (): React.ReactElement => {
  const { data, isLoading, error } = useOnboardingSessions();

  if (isLoading) {
    return (
      <Card
        isBlurred
        className="border-none bg-background/60 dark:bg-default-100/50"
        shadow="sm"
        style={{ padding: "12px 12px 12px 12px", width: "100%" }}
      >
        <Spinner color="secondary" />
        <Spacer y={2} />
        <p>Loading onboarding sessions...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card
        isBlurred
        className="border-none bg-background/60 dark:bg-default-100/50"
        shadow="sm"
        style={{ padding: "12px 12px 12px 12px", width: "100%" }}
      >
        <h3>Error</h3>
        <p className="text-small text-danger">{error.message}</p>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card
        isBlurred
        className="border-none bg-background/60 dark:bg-default-100/50"
        shadow="sm"
        style={{ padding: "12px 12px 12px 12px", width: "100%" }}
      >
        <h3>Onboarding Sessions</h3>
        <p>No onboarding sessions found.</p>
      </Card>
    );
  }

  return (
    <Card
      isBlurred
      className="border-none bg-background/60 dark:bg-default-100/50"
      shadow="sm"
      style={{ padding: "12px 12px 12px 12px", width: "100%" }}
    >
      <h3>Onboarding Sessions</h3>
      <p>Current onboarding sessions created by admins.</p>
      <Spacer y={4} />
      <NextUITable aria-label="Onboarding sessions table" color="default">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={data}>
          {(item) => (
            <TableRow key={item.sessionId}>
              {(columnKey) => {
                if (columnKey === "createdAt" || columnKey === "expiresAt") {
                  return (
                    <TableCell>
                      {formatSessionDate(String(getKeyValue(item, columnKey)))}
                    </TableCell>
                  );
                }

                if (columnKey === "stage") {
                  const stage = String(getKeyValue(item, columnKey));
                  const config = stageChipConfig[stage] || {
                    label: stage,
                    color: "default",
                  };

                  return (
                    <TableCell>
                      <Chip color={config.color} size="sm" variant="flat">
                        {config.label}
                      </Chip>
                    </TableCell>
                  );
                }

                return <TableCell>{getKeyValue(item, columnKey)}</TableCell>;
              }}
            </TableRow>
          )}
        </TableBody>
      </NextUITable>
    </Card>
  );
};

export default OnboardingSessionsTable;
