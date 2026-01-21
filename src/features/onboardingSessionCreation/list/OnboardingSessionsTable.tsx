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
import { Spacer } from "@heroui/spacer";
import { Spinner } from "@heroui/spinner";

import { useOnboardingSessions } from "../onboardingSessionCreation.service";
import { OnboardingSessionListItem } from "../_shared/onboardingSessionCreation.types";

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
              {(columnKey) => (
                <TableCell>{getKeyValue(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </NextUITable>
    </Card>
  );
};

export default OnboardingSessionsTable;
