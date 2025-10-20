"use client";

import React, { useState, useEffect, use } from "react";
import { Card, CardBody, CardHeader, CardFooter } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@heroui/table";
import { Badge } from "@heroui/badge";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Spinner } from "@heroui/spinner";
import { Icon } from "@iconify/react";
import { formatCurrency, calculatePlatformFee } from "@/utils/formatters";
import type { PayoutPayload } from "@/types/Payout";
import { PayoutSummary } from "@/components/PayoutSummary";
import { TransactionDetails } from "@/components/TransactionDetails";
import { AccountDetails } from "@/components/AccountDetails";
import { useAuthContext } from "@/context/AuthContext";
import apiClient from "@/utils/apiClient";

type PageProps = {
  params: Promise<{ id: string }>;
};

const SchedulerDetailPage = ({ params }: PageProps): React.ReactElement => {
  // Unwrap the params Promise using React.use()
  const { id } = use(params);
  
  const { isAuthenticated, isLoading: authLoading } = useAuthContext();
  const [payout, setPayout] = useState<PayoutPayload | null>(null);
  const [schedulerData, setSchedulerData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPayoutDetails = async () => {
    try {
      // The backend returns the full scheduler object, but we need to extract the payload from Target.Input
      const response = await apiClient.get<any>(`/api/user/schedulers/${id}`);
      
      console.log("[SchedulerDetailPage] scheduler response:", response.data);
      
      // Store the full scheduler data for platform extraction
      setSchedulerData(response.data);
      
      // Extract the payload from Target.Input (which is a stringified JSON)
      if (response.data?.Target?.Input) {
        const targetInput = JSON.parse(response.data.Target.Input);
        const payoutPayload = targetInput.payload;
        
        console.log("[SchedulerDetailPage] extracted payload:", payoutPayload);
        setPayout(payoutPayload);
      } else {
        throw new Error("No payload found in scheduler target input");
      }
    } catch (err: any) {
      console.error("Error fetching payout details:", err);

      // If it's a token expiration error, don't show error message as user will be logged out
      if (err.isTokenExpired) {
        return;
      }

      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to load payout details";

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to extract platform from Target.Input JSON
  const extractPlatform = (schedulerData: any): string => {
    try {
      if (schedulerData?.Target?.Input) {
        const inputData = JSON.parse(schedulerData.Target.Input);
        console.log("[SchedulerDetailPage] Target.Input parsed:", inputData);

        // Check for platform field at root level (Ecwid)
        if (inputData.platform) {
          console.log("[SchedulerDetailPage] Found platform field:", inputData.platform);
          return inputData.platform;
        }

        // Check for Instapaytient structure - look for specific fields that indicate Instapaytient
        if (
          inputData.payload?.payout_account_id ||
          inputData.payload?.stripe_account_id
        ) {
          console.log("[SchedulerDetailPage] Detected Instapaytient structure");
          return "instapaytient";
        }

        console.log("[SchedulerDetailPage] No platform detected, returning N/A");
        return "N/A";
      }

      console.log("[SchedulerDetailPage] No Target.Input found");
      return "N/A";
    } catch (error) {
      console.error("Error parsing Target.Input for platform:", error);
      return "N/A";
    }
  };

  useEffect(() => {
    // Only fetch payout details when authentication is complete and user is authenticated
    if (!authLoading && isAuthenticated && id) {
      fetchPayoutDetails();
    }
  }, [authLoading, isAuthenticated, id]);

  // Loading state
  if (authLoading || isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <Spinner color="secondary" />
          <p>Loading payout details...</p>
        </div>
      </div>
    );
  }

  // Platform not supported state
  if (schedulerData && extractPlatform(schedulerData) !== "instapaytient") {
    const detectedPlatform = extractPlatform(schedulerData);
    console.log("[SchedulerDetailPage] Platform not supported:", detectedPlatform);
    
    return (
      <div className="max-w-6xl mx-auto mt-10">
        <Card isBlurred className="border-none bg-background/60 dark:bg-default-100/50" shadow="sm">
          <CardBody className="text-center p-6">
            <Icon icon="lucide:alert-triangle" width={48} className="text-warning mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-warning mb-2">Platform Not Supported</h2>
            <p className="text-foreground-500 mb-4">Other platforms outside of Instapaytient are not supported</p>
            <p className="text-tiny text-foreground-400 mt-2">Detected platform: {detectedPlatform}</p>
          </CardBody>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-6xl mx-auto mt-10">
        <Card isBlurred className="border-none bg-background/60 dark:bg-default-100/50" shadow="sm">
          <CardBody className="text-center p-6">
            <Icon icon="lucide:alert-circle" width={48} className="text-danger mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-danger mb-2">Error Loading Payout</h2>
            <p className="text-foreground-500 mb-4">{error}</p>
            <Button 
              color="primary" 
              onClick={() => fetchPayoutDetails()}
              startContent={<Icon icon="lucide:refresh-cw" width={18} />}
            >
              Try Again
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  // No payout data
  if (!payout) {
    return (
      <div className="max-w-6xl mx-auto mt-10">
        <Card isBlurred className="border-none bg-background/60 dark:bg-default-100/50" shadow="sm">
          <CardBody className="text-center p-6">
            <Icon icon="lucide:file-x" width={48} className="text-foreground-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Payout Not Found</h2>
            <p className="text-foreground-500">The requested payout could not be found.</p>
          </CardBody>
        </Card>
      </div>
    );
  }

  const {
    order_id,
    cart_items,
    current_subtotal_price,
    tenderTransaction_processedAt,
    tenderTransaction_amount,
    account,
    customer_name
  } = payout;

  // Calculate platform fee: custom take rate + 2.9%
  const customTakeRate: number = account?.payout?.take ?? 0;
  const platformFee: number = calculatePlatformFee(current_subtotal_price ?? 0, customTakeRate);
  const payoutAmount: number = (current_subtotal_price ?? 0) - platformFee;
  const platformFeePercentage: number = customTakeRate + 2.9; // Custom take in % + 2.9%
  const currency: string = tenderTransaction_amount?.tenderTransaction_amount_currencyCode ?? "USD";

  return (
    <div className="max-w-6xl mx-auto mt-10">
      <Card isBlurred className="border-none bg-background/60 dark:bg-default-100/50" shadow="sm">
        <CardBody className="space-y-6 p-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-semibold text-foreground">Scheduled Payout</h1>
                <Chip color="warning" variant="flat" size="sm">Pending</Chip>
              </div>
              <p className="text-foreground-500">{id}</p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="flat" 
                color="default" 
                startContent={<Icon icon="logos:slack-icon" width={18} />}
              >
                Share to Slack
              </Button>
              <Button 
                variant="flat" 
                color="default" 
                startContent={<Icon icon="lucide:download" width={18} />}
              >
                Download Receipt
              </Button>
              <Button 
                color="primary" 
                startContent={<Icon icon="lucide:printer" width={18} />}
              >
                Print
              </Button>
            </div>
          </div>

          {/* Payout Summary Card */}
          <PayoutSummary 
            processedDate={tenderTransaction_processedAt ?? ""}
            subtotal={current_subtotal_price ?? 0}
            payoutAmount={payoutAmount}
            platformFee={platformFee}
            platformFeePercentage={platformFeePercentage}
            currency={currency}
            instantPayoutEnabled={account?.payout?.instant_payout_enabled ?? false}
            customTakeRate={customTakeRate}
          />

          {/* Transaction and Account Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TransactionDetails payout={payout} orderId={order_id} />
            <AccountDetails account={account} />
          </div>

          {/* Cart Items */}
          <Card>
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Items ({cart_items?.length ?? 0})</h2>
              <Badge color="primary" variant="flat">
                {formatCurrency(current_subtotal_price ?? 0, currency)}
              </Badge>
            </CardHeader>
            <Divider />
            <CardBody>
              <Table removeWrapper aria-label="Cart items">
                <TableHeader>
                  <TableColumn>ITEM</TableColumn>
                  <TableColumn>PRICE</TableColumn>
                  <TableColumn>QTY</TableColumn>
                  <TableColumn align="end">TOTAL</TableColumn>
                </TableHeader>
                <TableBody>
                  {cart_items?.map((item) => (
                    <TableRow key={item.serviceID}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar
                            src={item.imageUrl}
                            size="md"
                            radius="sm"
                          />
                          <div>
                            <p className="font-medium">{item.name}</p>
                            {item.variant && (
                              <p className="text-tiny text-foreground-500">Variant: {item.variant}</p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{formatCurrency(typeof item.price === 'string' ? parseFloat(item.price) : item.price, currency)}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(item.total, currency)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardBody>
            <Divider />
            <CardFooter className="flex justify-between">
              <div className="flex items-center gap-2">
                <Icon icon="lucide:user" className="text-foreground-500" />
                <span>Customer: <span className="font-medium">{customer_name}</span></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-foreground-500">Subtotal:</span>
                <span className="font-semibold">{formatCurrency(current_subtotal_price ?? 0, currency)}</span>
              </div>
            </CardFooter>
          </Card>
        </CardBody>
      </Card>
    </div>
  );
};

export default SchedulerDetailPage;


