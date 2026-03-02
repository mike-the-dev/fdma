"use client";

import React, { use, useState } from "react";
import { Card, CardBody } from "@heroui/card";
import { Button, ButtonGroup } from "@heroui/button";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Spinner } from "@heroui/spinner";
import { Tabs, Tab } from "@heroui/tabs";
import { useQueryClient } from "@tanstack/react-query";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@heroui/modal";
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
import { CreateRefund } from "@/features/instapaytient/refund";
import { ChargesTable } from "@/features/instapaytient/charges";
import { ChargeMappedDTO } from "@/features/instapaytient/charges/_shared/charges.types";
import { RefundContractsTable } from "@/features/instapaytient/refundContracts";
import { PaymentType } from "@/features/instapaytient/refund/_shared/refund.types";
import {
  CreateAccountUser,
  AccountUsersTable,
} from "@/features/instapaytient/accountUsers";

type PageProps = {
  params: Promise<{ id: string }>;
};

const InstapaytientDetailPage = ({ params }: PageProps): React.ReactElement => {
  // Unwrap the params Promise using React.use()
  const { id } = use(params);
  const queryClient = useQueryClient();

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
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const {
    isOpen: isAddUserModalOpen,
    onOpen: onAddUserModalOpen,
    onClose: onAddUserModalClose,
    onOpenChange: onAddUserModalOpenChange,
  } = useDisclosure();
  const {
    isOpen: isViewUsersModalOpen,
    onOpen: onViewUsersModalOpen,
    onOpenChange: onViewUsersModalOpenChange,
  } = useDisclosure();
  const [selectedChargeId, setSelectedChargeId] = useState<string>("");
  const [selectedAmount, setSelectedAmount] = useState<number | undefined>(
    undefined
  );
  const [selectedOrderNumber, setSelectedOrderNumber] = useState<string>("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentType>(
    "no payment type"
  );
  const [selectedCustomerEmail, setSelectedCustomerEmail] = useState<string>("");
  const [selectedCustomerFirstName, setSelectedCustomerFirstName] =
    useState<string>("");
  const [selectedCustomerLastName, setSelectedCustomerLastName] =
    useState<string>("");

  const mapPaymentMethodFromTypes = (
    paymentMethodTypes?: string[]
  ): PaymentType => {
    if (!paymentMethodTypes || paymentMethodTypes.length === 0)
      return "no payment type";
    if (paymentMethodTypes.includes("affirm")) return "affirm";
    if (paymentMethodTypes.includes("stripe_account"))
      return "credit card or debit card";
    return "no payment type";
  };

  const splitName = (fullName?: string | null) => {
    const trimmed = fullName?.trim();
    if (!trimmed) return { firstName: "", lastName: "" };

    const [firstName, ...rest] = trimmed.split(/\s+/);
    return { firstName: firstName || "", lastName: rest.join(" ") || "" };
  };

  const handleOpenRefundModal = (transactionId: string): void => {
    const selectedTransaction = transactions.find(
      (transaction) => transaction.id === transactionId
    );
    const latestCharge = selectedTransaction?.latest_charge;
    // For Affirm rows, contract creation should reference the PaymentIntent ID.
    const paymentId = selectedTransaction?.id;
    const metadata = selectedTransaction?.metadata || {};
    const billingEmail =
      typeof latestCharge === "object" ? latestCharge?.billing_details?.email : "";
    const billingName =
      typeof latestCharge === "object" ? latestCharge?.billing_details?.name : "";
    const nameParts = splitName(billingName);

    setSelectedChargeId(paymentId ?? "");
    setSelectedAmount(selectedTransaction?.amount);
    setSelectedOrderNumber(metadata.orderNumber ?? "");
    setSelectedPaymentMethod(
      mapPaymentMethodFromTypes(selectedTransaction?.payment_method_types)
    );
    setSelectedCustomerEmail(metadata.customerEmail ?? billingEmail ?? "");
    setSelectedCustomerFirstName(
      metadata.customerFirstName ?? nameParts.firstName
    );
    setSelectedCustomerLastName(metadata.customerLastName ?? nameParts.lastName);
    onOpen();
  };

  const handleOpenRefundModalFromCharge = (charge: ChargeMappedDTO): void => {
    const latestCharge = charge.latest_charge;
    const chargeId =
      typeof latestCharge === "string" ? latestCharge : latestCharge?.id;
    const metadata = charge.metadata || {};
    const billingEmail = latestCharge?.billing_details?.email;
    const billingName = latestCharge?.billing_details?.name;
    const nameParts = splitName(billingName);

    setSelectedChargeId(chargeId ?? "");
    setSelectedAmount(charge.amount);
    setSelectedOrderNumber(metadata.orderNumber ?? "");
    setSelectedPaymentMethod(mapPaymentMethodFromTypes(charge.payment_method_types));
    setSelectedCustomerEmail(metadata.customerEmail ?? billingEmail ?? "");
    setSelectedCustomerFirstName(
      metadata.customerFirstName ?? nameParts.firstName
    );
    setSelectedCustomerLastName(metadata.customerLastName ?? nameParts.lastName);
    onOpen();
  };

  const handleAddUserAction = (key: React.Key): void => {
    if (key === "view_users") onViewUsersModalOpen();
  };

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
          <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="mb-2 text-2xl font-semibold text-white">
                Account Details
              </h1>
              <p className="text-gray-500">View and manage manage account.</p>
            </div>
            <div className="flex gap-2">
              {/* <Button
                color="default"
                startContent={<Icon icon="logos:slack-icon" width={18} />}
                variant="flat"
              >
                Share to Slack
              </Button> */}
              <ButtonGroup>
                <Button
                  color="primary"
                  startContent={<Icon icon="lucide:user-plus" width={18} />}
                  onPress={onAddUserModalOpen}
                >
                  Add User
                </Button>
                <Dropdown placement="bottom-end">
                  <DropdownTrigger>
                    <Button isIconOnly color="primary" variant="flat">
                      <Icon icon="lucide:chevron-down" width={18} />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Add user actions"
                    onAction={handleAddUserAction}
                  >
                    <DropdownItem
                      key="view_users"
                      startContent={<Icon icon="lucide:users" width={16} />}
                    >
                      View Users
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </ButtonGroup>
              <ButtonGroup>
                <Button
                  color="default"
                  startContent={<Icon icon="lucide:settings" width={18} />}
                  variant="flat"
                >
                  Settings
                </Button>
                <Dropdown placement="bottom-end">
                  <DropdownTrigger>
                    <Button isIconOnly color="default" variant="flat">
                      <Icon icon="lucide:chevron-down" width={18} />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Settings actions">
                    <DropdownItem
                      key="disable_account"
                      className="text-danger"
                      color="danger"
                      startContent={<Icon icon="lucide:user-x" width={16} />}
                    >
                      Disable Account
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </ButtonGroup>
            </div>
          </div>

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
            <Tabs aria-label="Account transaction tabs" radius="full">
              <Tab key="transactions" title="Affirm">
                <div className="mt-4">
                  <TransactionsTable
                    error={transactionsError}
                    isLoading={transactionsLoading}
                    selectedKeys={new Set()}
                    transactions={transactions}
                    onSelectionChange={() => {}}
                    onRefund={handleOpenRefundModal}
                  />
                </div>
              </Tab>
              <Tab key="refunds" title="Authorize.net">
                <div className="mt-4">
                  <ChargesTable
                    stripeAccount={account.payout?.stripeId ?? undefined}
                    onRefund={handleOpenRefundModalFromCharge}
                  />
                </div>
              </Tab>
              <Tab key="refund-contracts" title="Refund Contracts">
                <div className="mt-4">
                  <RefundContractsTable accountId={account.id} />
                </div>
              </Tab>
            </Tabs>
          </div>
        </Card>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex items-center gap-2">
                <Icon
                  className="text-xl text-primary-500"
                  icon="lucide:receipt-text"
                />
                <span>Initiate Refund Contract</span>
              </ModalHeader>
              <ModalBody className="pb-6">
                <CreateRefund
                  accountId={account.id}
                  businessName={account.company || account.name}
                  initialAmount={selectedAmount}
                  initialChargeId={selectedChargeId}
                  initialPaymentMethod={selectedPaymentMethod}
                  initialCustomerEmail={selectedCustomerEmail}
                  initialCustomerFirstName={selectedCustomerFirstName}
                  initialCustomerLastName={selectedCustomerLastName}
                  initialOrderNumber={selectedOrderNumber}
                  onRefundCreated={async () => {
                    await Promise.all([
                      queryClient.invalidateQueries({ queryKey: ["transactions"] }),
                      queryClient.invalidateQueries({ queryKey: ["charges"] }),
                      queryClient.invalidateQueries({ queryKey: ["refundContracts"] }),
                    ]);
                    onClose();
                  }}
                />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isAddUserModalOpen}
        onOpenChange={onAddUserModalOpenChange}
        size="lg"
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex items-center gap-2">
                <Icon
                  className="text-xl text-primary-500"
                  icon="lucide:user-plus"
                />
                <span>Add User</span>
              </ModalHeader>
              <ModalBody className="pb-6">
                <CreateAccountUser
                  accountId={account.id}
                  onUserCreated={onAddUserModalClose}
                />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isViewUsersModalOpen}
        onOpenChange={onViewUsersModalOpenChange}
        size="3xl"
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex items-center gap-2">
                <Icon className="text-xl text-primary-500" icon="lucide:users" />
                <span>View Users</span>
              </ModalHeader>
              <ModalBody className="pb-6">
                <AccountUsersTable accountId={account.id} />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default InstapaytientDetailPage;
