"use client";

import React, { use } from "react";
import { Card, CardBody } from "@heroui/card";
import { Spinner } from "@heroui/spinner";
import { Icon } from "@iconify/react";

import { useAccount } from "@/features/instapaytient/account/useAccount";
import { AccountSummary } from "@/components/Pages/Instapaytient/AccountDetail/AccountSummary";
import { TransactionsTable } from "@/components/Pages/Instapaytient/AccountDetail/TransactionsTable";
import { AccountDetails } from "@/components/Pages/Instapaytient/AccountDetail/AccountDetails";
import { AccountReadiness } from "@/components/Pages/Instapaytient/AccountDetail/AccountReadiness";
import { AccountReadinessSkeleton } from "@/components/Pages/Instapaytient/AccountDetail/AccountReadinessSkeleton";
import { BankAccountDetails } from "@/components/Pages/Instapaytient/AccountDetail/BankAccountDetails";
import { BankAccountDetailsSkeleton } from "@/components/Pages/Instapaytient/AccountDetail/BankAccountDetailsSkeleton";
import { BusinessProfile } from "@/components/Pages/Instapaytient/AccountDetail/BusinessProfile";

type PageProps = {
  params: Promise<{ id: string }>;
};

const InstapaytientDetailPage = ({ params }: PageProps): React.ReactElement => {
  // Unwrap the params Promise using React.use()
  const { id } = use(params);

  const {
    account,
    isLoading,
    error,
    refetch,
    transactions,
    transactionsLoading,
    transactionsError,
    stripeAccount,
    stripeAccountLoading,
    stripeAccountError,
  } = useAccount(id);

  // Readiness data
  const readinessData = {
    affirm: {
      enabled: true,
    },
    readiness: {
      affirmEnabled: true,
      bankAccountLinked: true,
      stripeLinked: false,
    },
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-8 gap-4">
        <Spinner color="primary" size="lg" />
        <p className="text-default-500">Loading account details...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-6xl mx-auto mt-10">
        <Card
          isBlurred
          className="border-none bg-background/60 dark:bg-default-100/50"
          shadow="sm"
        >
          <CardBody className="text-center p-6">
            <Icon
              className="text-danger mx-auto mb-4"
              icon="lucide:alert-circle"
              width={48}
            />
            <h2 className="text-xl font-semibold text-danger mb-2">
              Error Loading Account
            </h2>
            <p className="text-foreground-500 mb-4">{error}</p>
            <button
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-600"
              onClick={refetch}
            >
              Try Again
            </button>
          </CardBody>
        </Card>
      </div>
    );
  }

  // No account data
  if (!account) {
    return (
      <div className="max-w-6xl mx-auto mt-10">
        <Card
          isBlurred
          className="border-none bg-background/60 dark:bg-default-100/50"
          shadow="sm"
        >
          <CardBody className="text-center p-6">
            <Icon
              className="text-foreground-500 mx-auto mb-4"
              icon="lucide:file-x"
              width={48}
            />
            <h2 className="text-xl font-semibold mb-2">Account Not Found</h2>
            <p className="text-foreground-500">
              The requested account could not be found.
            </p>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <Card
          isBlurred
          className="border-none bg-background/60 dark:bg-default-100/50"
          shadow="sm"
          style={{ padding: "12px 12px 12px 12px", width: "100%" }}
        >
          <h1 className="mb-2 text-2xl font-semibold text-white">
            Account Details
          </h1>
          <p className="mb-6 text-gray-500">View and manage manage account.</p>

          <AccountDetails account={account} />

          <div className="mt-12" />

          {/* New Account Readiness component */}
          {stripeAccountLoading ? (
            <AccountReadinessSkeleton />
          ) : (
            <AccountReadiness
              account={account}
              stripeAccount={stripeAccount}
              stripeAccountError={stripeAccountError}
              stripeAccountLoading={stripeAccountLoading}
            />
          )}

          <div className="mt-12" />

          <BusinessProfile 
            stripeAccount={stripeAccount}
            stripeAccountError={stripeAccountError}
            stripeAccountLoading={stripeAccountLoading}
          />

          <div className="mt-12" />

          {/* New Bank Account Details component */}
          {stripeAccountLoading ? (
            <BankAccountDetailsSkeleton />
          ) : (
            <BankAccountDetails
              stripeAccount={stripeAccount}
              stripeAccountError={stripeAccountError}
              stripeAccountLoading={stripeAccountLoading}
            />
          )}

          <div className="mt-12" />

          <AccountSummary />

          <div className="mt-8">
            <h2 className="mb-4 text-xl font-medium text-white">
              Transactions
            </h2>
            <TransactionsTable
              error={transactionsError}
              isLoading={transactionsLoading}
              selectedKeys={new Set()}
              transactions={transactions}
              onSelectionChange={() => {}}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default InstapaytientDetailPage;
