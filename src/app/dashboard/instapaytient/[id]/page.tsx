"use client";

import React, { use } from "react";
import { Card, CardBody } from "@heroui/card";
import { Spinner } from "@heroui/spinner";
import { Icon } from "@iconify/react";
import { useAccount } from "@/features/instapaytient/account/useAccount";
import { AccountSummary } from "@/components/Pages/Instapaytient/AccountDetail/AccountSummary";
import { TransactionsTable } from "@/components/Pages/Instapaytient/AccountDetail/TransactionsTable";

type PageProps = {
  params: Promise<{ id: string }>;
};

const InstapaytientDetailPage = ({ params }: PageProps): React.ReactElement => {
  // Unwrap the params Promise using React.use()
  const { id } = use(params);
  
  const { account, isLoading, error, refetch } = useAccount(id);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-8 gap-4">
        <Spinner size="lg" color="primary" />
        <p className="text-default-500">Loading account details...</p>
      </div>
    );
  };

  // Error state
  if (error) {
    return (
      <div className="max-w-6xl mx-auto mt-10">
        <Card isBlurred className="border-none bg-background/60 dark:bg-default-100/50" shadow="sm">
          <CardBody className="text-center p-6">
            <Icon icon="lucide:alert-circle" width={48} className="text-danger mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-danger mb-2">Error Loading Account</h2>
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
  };

  // No account data
  if (!account) {
    return (
      <div className="max-w-6xl mx-auto mt-10">
        <Card isBlurred className="border-none bg-background/60 dark:bg-default-100/50" shadow="sm">
          <CardBody className="text-center p-6">
            <Icon icon="lucide:file-x" width={48} className="text-foreground-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Account Not Found</h2>
            <p className="text-foreground-500">The requested account could not be found.</p>
          </CardBody>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-2 text-2xl font-semibold text-gray-900">Account Details</h1>
        <p className="mb-6 text-gray-500">View and manage your account transactions</p>
        
        <AccountSummary />
        
        <div className="mt-8">
          <h2 className="mb-4 text-xl font-medium text-gray-900">Transactions</h2>
          <TransactionsTable />
        </div>
      </div>
    </div>
  );
};

export default InstapaytientDetailPage;
