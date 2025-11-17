"use client";

import { Card } from "@heroui/card";
import { Spacer } from "@heroui/spacer";
import { Select, SelectItem } from "@heroui/select";
import { useState, useMemo } from "react";

import { useAccounts } from "@/features/customerInsights/customerInsights.service";

const CustomerInsightDetail = (): React.ReactElement => {
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");
  const { data: accounts, isLoading: accountsLoading } = useAccounts();

  // Find the selected account from the cached accounts list
  const selectedAccount = useMemo(() => {
    if (!selectedAccountId || !accounts) return null;

    return accounts.find((acct: any) => acct.id === selectedAccountId) || null;
  }, [selectedAccountId, accounts]);

  // Extract analytics targets from the cached account data
  // The property is analyticsTargets (camelCase) with snake_case keys inside
  const analyticsTargets = selectedAccount
    ? (selectedAccount as any).analyticsTargets || null
    : null;

  return (
    <Card
      isBlurred
      className="border-none bg-background/60 dark:bg-default-100/50"
      shadow="sm"
      style={{ padding: "12px 12px 12px 12px", width: "100%" }}
    >
      <h3>Customer Insight Detail</h3>
      <p>View analytics targets for a specific account.</p>
      <Spacer y={4} />

      <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
        <div className="flex-1">
          <Select
            isLoading={accountsLoading}
            label="Account"
            placeholder="Select an account to view details"
            selectedKeys={
              selectedAccountId ? new Set([selectedAccountId]) : new Set()
            }
            onSelectionChange={(keys) => {
              const selectedValue = Array.from(keys)[0] as string | undefined;

              setSelectedAccountId(selectedValue ?? "");
            }}
          >
            {(accounts ?? []).map((acct) => (
              <SelectItem key={acct.id}>{acct.name}</SelectItem>
            ))}
          </Select>
        </div>
      </div>

      <Spacer y={4} />

      {selectedAccountId && analyticsTargets && (
        <>
          <h4 className="text-lg font-semibold mb-4">Analytics Targets</h4>

          <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
            <div className="flex-1">
              <Card className="p-4">
                <div className="space-y-2">
                  <p className="text-sm text-foreground-500">
                    Average Spent Target
                  </p>
                  <p className="text-2xl font-bold">
                    {typeof analyticsTargets.avg_spent_cents === "number"
                      ? new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(analyticsTargets.avg_spent_cents / 100)
                      : new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(
                          Number(analyticsTargets.avg_spent_cents || 0) / 100
                        )}
                  </p>
                </div>
              </Card>
            </div>
          </div>

          <Spacer y={4} />

          <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
            <div className="flex-1">
              <Card className="p-4">
                <div className="space-y-2">
                  <p className="text-sm text-foreground-500">
                    Subscription Email Rate Target
                  </p>
                  <p className="text-2xl font-bold">
                    {typeof analyticsTargets.subscription_rate_percent ===
                    "number"
                      ? `${analyticsTargets.subscription_rate_percent}%`
                      : `${Number(analyticsTargets.subscription_rate_percent || 0)}%`}
                  </p>
                </div>
              </Card>
            </div>
            <div className="flex-1">
              <Card className="p-4">
                <div className="space-y-2">
                  <p className="text-sm text-foreground-500">
                    Repeat Customer Rate Target
                  </p>
                  <p className="text-2xl font-bold">
                    {typeof analyticsTargets.repeat_rate_percent === "number"
                      ? `${analyticsTargets.repeat_rate_percent}%`
                      : `${Number(analyticsTargets.repeat_rate_percent || 0)}%`}
                  </p>
                </div>
              </Card>
            </div>
          </div>

          <Spacer y={4} />

          <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
            <div className="flex-1">
              <Card className="p-4">
                <div className="space-y-2">
                  <p className="text-sm text-foreground-500">
                    Retention Customer Rate Target
                  </p>
                  <p className="text-2xl font-bold">
                    {typeof analyticsTargets.retention_rate_percent === "number"
                      ? `${analyticsTargets.retention_rate_percent}%`
                      : `${Number(analyticsTargets.retention_rate_percent || 0)}%`}
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </>
      )}

      {selectedAccountId && !analyticsTargets && (
        <Card className="p-4 bg-warning-50 dark:bg-warning-900/20 border border-warning">
          <p className="text-warning">
            No analytics targets set for this account.
          </p>
        </Card>
      )}
    </Card>
  );
};

export default CustomerInsightDetail;
export { CustomerInsightDetail };
