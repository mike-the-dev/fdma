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

import { useStripeRedirectSessions } from "../stripeRedirectSessions.service";
import { StripeRedirectSessionDto } from "../_shared/stripeRedirectSessions.types";

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

type ColumnConfig = {
  key: keyof StripeRedirectSessionDto;
  label: string;
};

const columns: ColumnConfig[] = [
  { key: "sessionId", label: "SESSION" },
  { key: "stripeId", label: "STRIPE ID" },
  { key: "status", label: "STATUS" },
  { key: "createdAt", label: "CREATED" },
  { key: "expiresAt", label: "EXPIRES" },
];

const StripeRedirectSessionsTable = (): React.ReactElement => {
  const { data, isLoading, error } = useStripeRedirectSessions();

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
        <p>Loading Stripe redirect sessions...</p>
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
        <h3>Stripe Redirect Sessions</h3>
        <p>No Stripe redirect sessions found.</p>
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
      <h3>Stripe Redirect Sessions</h3>
      <p>Current Stripe redirect sessions created by admins.</p>
      <Spacer y={4} />
      <NextUITable aria-label="Stripe redirect sessions table" color="default">
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

                return (
                  <TableCell>{String(getKeyValue(item, columnKey))}</TableCell>
                );
              }}
            </TableRow>
          )}
        </TableBody>
      </NextUITable>
    </Card>
  );
};

export default StripeRedirectSessionsTable;
