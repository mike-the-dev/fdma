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
import { Button } from "@heroui/button";
import { Spacer } from "@heroui/spacer";
import { Spinner } from "@heroui/spinner";
import { User } from "@heroui/user";
import { Tooltip } from "@heroui/tooltip";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
} from "@heroui/dropdown";

import { useOnboardingSessions } from "../onboardingSessionCreation.service";
import { OnboardingSessionListItem } from "../_shared/onboardingSessionCreation.types";
import { useOnboardingSessionRefresh } from "./useOnboardingSessionRefresh";

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

const iconClasses = "text-xl text-default-500 pointer-events-none shrink-0";

const CopyDocumentIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 24 24"
      width="1em"
      {...props}
    >
      <path
        d="M15.5 13.15h-2.17c-1.78 0-3.23-1.44-3.23-3.23V7.75c0-.41-.33-.75-.75-.75H6.18C3.87 7 2 8.5 2 11.18v6.64C2 20.5 3.87 22 6.18 22h5.89c2.31 0 4.18-1.5 4.18-4.18V13.9c0-.42-.34-.75-.75-.75Z"
        fill="currentColor"
        opacity={0.4}
      />
      <path
        d="M17.82 2H11.93C9.67 2 7.84 3.44 7.76 6.01c.06 0 .11-.01.17-.01h5.89C16.13 6 18 7.5 18 10.18V16.83c0 .06-.01.11-.01.16 2.23-.07 4.01-1.55 4.01-4.16V6.18C22 3.5 20.13 2 17.82 2Z"
        fill="currentColor"
      />
      <path
        d="M11.98 7.15c-.31-.31-.84-.1-.84.33v2.62c0 1.1.93 2 2.07 2 .71.01 1.7.01 2.55.01.43 0 .65-.5.35-.8-1.09-1.09-3.03-3.04-4.13-4.16Z"
        fill="currentColor"
      />
    </svg>
  );
};

const DeleteDocumentIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 24 24"
      width="1em"
      {...props}
    >
      <path
        d="M21.07 5.23c-1.61-.16-3.22-.28-4.84-.37v-.01l-.22-1.3c-.15-.92-.37-2.3-2.71-2.3h-2.62c-2.33 0-2.55 1.32-2.71 2.29l-.21 1.28c-.93.06-1.86.12-2.79.21l-2.04.2c-.42.04-.72.41-.68.82.04.41.4.71.82.67l2.04-.2c5.24-.52 10.52-.32 15.82.21h.08c.38 0 .71-.29.75-.68a.766.766 0 0 0-.69-.82Z"
        fill="currentColor"
      />
      <path
        d="M19.23 8.14c-.24-.25-.57-.39-.91-.39H5.68c-.34 0-.68.14-.91.39-.23.25-.36.59-.34.94l.62 10.26c.11 1.52.25 3.42 3.74 3.42h6.42c3.49 0 3.63-1.89 3.74-3.42l.62-10.25c.02-.36-.11-.7-.34-.95Z"
        fill="currentColor"
        opacity={0.399}
      />
      <path
        clipRule="evenodd"
        d="M9.58 17a.75.75 0 0 1 .75-.75h3.33a.75.75 0 0 1 0 1.5h-3.33a.75.75 0 0 1-.75-.75ZM8.75 13a.75.75 0 0 1 .75-.75h5a.75.75 0 0 1 0 1.5h-5a.75.75 0 0 1-.75-.75Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

const VerticalDotsIcon = ({
  size = 24,
  width,
  height,
  ...props
}: React.SVGProps<SVGSVGElement> & {
  size?: number;
}) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height={size || height}
      role="presentation"
      viewBox="0 0 24 24"
      width={size || width}
      {...props}
    >
      <path
        d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 12c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
        fill="currentColor"
      />
    </svg>
  );
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

const columns: {
  key: keyof OnboardingSessionListItem | "actions";
  label: string;
}[] = [
  { key: "customerName", label: "BUSINESS" },
  { key: "stage", label: "STAGE" },
  { key: "status", label: "STATUS" },
  { key: "createdAt", label: "CREATED" },
  { key: "expiresAt", label: "EXPIRES" },
  { key: "actions", label: "ACTIONS" },
];

const OnboardingSessionsTable = (): React.ReactElement => {
  const { data, isLoading, error } = useOnboardingSessions();
  const { handleRefresh, isRefreshing } = useOnboardingSessionRefresh();

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

                if (columnKey === "status") {
                  return (
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span
                          className="inline-block rounded-full"
                          style={{
                            width: "8px",
                            height: "8px",
                            backgroundColor: "#17C964",
                          }}
                        />
                        <span>{String(getKeyValue(item, columnKey))}</span>
                      </div>
                    </TableCell>
                  );
                }

                if (columnKey === "customerName") {
                  return (
                    <TableCell>
                      <Tooltip content={item.customerName} showArrow={true}>
                        <User
                          avatarProps={{
                            radius: "full",
                            size: "sm",
                            name: item.customerName,
                          }}
                          classNames={{
                            description: "text-default-500",
                          }}
                          description={item.email}
                          name={item.companyName}
                        >
                          {item.email}
                        </User>
                      </Tooltip>
                    </TableCell>
                  );
                }

                if (columnKey === "actions") {
                  return (
                    <TableCell>
                      <Dropdown>
                        <DropdownTrigger>
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            className="mx-auto"
                          >
                            <VerticalDotsIcon className="text-default-500" />
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Onboarding session actions" variant="faded">
                          <DropdownSection showDivider title="Actions">
                            <DropdownItem
                              key="refresh-session"
                              description="Refresh the onboarding session"
                              shortcut="⌘R"
                              startContent={<CopyDocumentIcon className={iconClasses} />}
                              onPress={() =>
                                handleRefresh(
                                  item.sessionId,
                                  item.companyName ?? "this business"
                                )
                              }
                            >
                              Refresh session
                            </DropdownItem>
                          </DropdownSection>
                          <DropdownSection title="Danger zone">
                            <DropdownItem
                              key="delete-session"
                              color="danger"
                              className="text-danger"
                              description="Permanently delete the session"
                              shortcut="⌘⇧D"
                              startContent={
                                <DeleteDocumentIcon className={`${iconClasses} text-danger`} />
                              }
                              isDisabled
                            >
                              Revoke session (coming soon)
                            </DropdownItem>
                          </DropdownSection>
                        </DropdownMenu>
                      </Dropdown>
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
