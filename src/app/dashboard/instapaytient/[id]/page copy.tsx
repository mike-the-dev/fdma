"use client";

import React, { useState, useEffect, use } from "react";
import { Spinner } from "@heroui/spinner";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Tabs, Tab } from "@heroui/tabs";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";
import { Button } from "@heroui/button";
import { Badge } from "@heroui/badge";
import { Tooltip } from "@heroui/tooltip";
import { Icon } from "@iconify/react";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { useAuthContext } from "@/context/AuthContext";
import apiClient from "@/utils/apiClient";

// Define the PaymentIntent interface
interface PaymentIntent {
  id: string;
  object: 'payment_intent';
  amount: number;
  amount_capturable: number;
  amount_details?: {
    shipping?: {
      amount: number;
      from_postal_code: string | null;
      to_postal_code: string | null;
    };
    tax?: {
      total_tax_amount: number;
    };
    tip?: {
      amount?: number;
    };
  };
  amount_received: number;
  application: string | null;
  application_fee_amount: number | null;
  automatic_payment_methods: any | null;
  canceled_at: number | null;
  cancellation_reason: string | null;
  capture_method: string;
  client_secret: string | null;
  confirmation_method: string;
  created: number;
  currency: string;
  customer: string | null;
  description: string | null;
  excluded_payment_method_types: Array<string> | null;
  last_payment_error: any | null;
  latest_charge: string | null;
  livemode: boolean;
  metadata: Record<string, any>;
  next_action: any | null;
  on_behalf_of: string | null;
  payment_method: string | null;
  payment_method_configuration_details: any | null;
  payment_method_options: any | null;
  payment_method_types: Array<string>;
  processing: any | null;
  receipt_email: string | null;
  review: string | null;
  setup_future_usage: string | null;
  shipping: any | null;
  source: string | null;
  statement_descriptor: string | null;
  statement_descriptor_suffix: string | null;
  status: string;
  transfer_data: any | null;
  transfer_group: string | null;
}

type PageProps = {
  params: Promise<{ id: string }>;
};

const InstapaytientDetailPage = ({ params }: PageProps): React.ReactElement => {
  // Unwrap the params Promise using React.use()
  const { id } = use(params);
  
  const { isAuthenticated, isLoading: authLoading } = useAuthContext();
  const [paymentIntentData, setPaymentIntentData] = useState<PaymentIntent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'succeeded':
        return 'success';
      case 'processing':
        return 'primary';
      case 'requires_action':
      case 'requires_capture':
      case 'requires_confirmation':
      case 'requires_payment_method':
        return 'warning';
      case 'canceled':
        return 'danger';
      default:
        return 'default';
    }
  };

  const fetchPaymentIntentDetails = async () => {
    try {
      // TODO: Replace with actual API endpoint for payment intent details
      const response = await apiClient.get<PaymentIntent>(`/api/user/instapaytient/${id}`);
      
      console.log("[InstapaytientDetailPage] payment intent response:", response.data);
      
      setPaymentIntentData(response.data);
    } catch (err: any) {
      console.error("Error fetching payment intent details:", err);

      // If it's a token expiration error, don't show error message as user will be logged out
      if (err.isTokenExpired) {
        return;
      }

      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to load payment intent details";

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch payment intent details when authentication is complete and user is authenticated
    if (!authLoading && isAuthenticated && id) {
      fetchPaymentIntentDetails();
    }
  }, [authLoading, isAuthenticated, id]);

  // Loading state
  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-8 gap-4">
        <Spinner size="lg" color="primary" />
        <p className="text-default-500">Loading payment details...</p>
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
            <h2 className="text-xl font-semibold text-danger mb-2">Error Loading Payment Intent</h2>
            <p className="text-foreground-500 mb-4">{error}</p>
            <Button 
              color="primary" 
              onClick={() => fetchPaymentIntentDetails()}
              startContent={<Icon icon="lucide:refresh-cw" width={18} />}
            >
              Try Again
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  // No payment intent data
  if (!paymentIntentData) {
    return (
      <div className="max-w-6xl mx-auto mt-10">
        <Card isBlurred className="border-none bg-background/60 dark:bg-default-100/50" shadow="sm">
          <CardBody className="text-center p-6">
            <Icon icon="lucide:file-x" width={48} className="text-foreground-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Payment Intent Not Found</h2>
            <p className="text-foreground-500">The requested payment intent could not be found.</p>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Payment Intent Details</h1>
          <p className="text-default-500">View and manage payment intent information</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="flat" 
            color="primary"
            startContent={<Icon icon="lucide:arrow-left" />}
          >
            Back to List
          </Button>
          <Button 
            color="primary"
            startContent={<Icon icon="lucide:refresh-cw" />}
            onClick={() => fetchPaymentIntentDetails()}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Summary Card */}
      <Card className="overflow-visible">
        <CardHeader className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">{paymentIntentData.id}</h2>
              <Chip 
                color={getStatusColor(paymentIntentData.status)} 
                variant="flat"
                className="capitalize"
              >
                {paymentIntentData.status}
              </Chip>
              {paymentIntentData.livemode ? (
                <Badge color="success" variant="flat" content="Live" placement="top-right">
                  <Icon icon="lucide:zap" className="text-lg" />
                </Badge>
              ) : (
                <Badge color="warning" variant="flat" content="Test" placement="top-right">
                  <Icon icon="lucide:flask-conical" className="text-lg" />
                </Badge>
              )}
            </div>
            <p className="text-default-500">Created {formatDate(new Date(paymentIntentData.created * 1000).toISOString())}</p>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-2xl font-semibold">
              {formatCurrency(paymentIntentData.amount, paymentIntentData.currency)}
            </div>
            <div className="text-default-500 text-sm uppercase">
              {paymentIntentData.currency}
            </div>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-default-500 text-sm">Payment Method</p>
              <div className="flex items-center gap-2 mt-1">
                <Icon 
                  icon="logos:affirm" 
                  className="h-6 w-auto" 
                  fallback={<Icon icon="lucide:credit-card" className="text-xl" />} 
                />
                <span className="capitalize">{paymentIntentData.payment_method_types.join(', ')}</span>
              </div>
            </div>
            <div>
              <p className="text-default-500 text-sm">Capture Method</p>
              <p className="capitalize mt-1">{paymentIntentData.capture_method}</p>
            </div>
            <div>
              <p className="text-default-500 text-sm">Amount Received</p>
              <p className="mt-1">{formatCurrency(paymentIntentData.amount_received, paymentIntentData.currency)}</p>
            </div>
            <div>
              <p className="text-default-500 text-sm">Latest Charge</p>
              <p className="mt-1 font-mono text-sm">{paymentIntentData.latest_charge}</p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Tabs */}
      <Card className="overflow-visible">
        <Tabs 
          aria-label="Payment Intent Details" 
          selectedKey={activeTab}
          onSelectionChange={(key: React.Key) => setActiveTab(key as string)}
          className="w-full"
        >
          <Tab key="overview" title={
            <div className="flex items-center gap-2">
              <Icon icon="lucide:layout-dashboard" />
              <span>Overview</span>
            </div>
          }>
            <div className="p-4 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Information */}
                <Card shadow="sm">
                  <CardHeader className="flex justify-between">
                    <h3 className="text-lg font-semibold">Customer Information</h3>
                  </CardHeader>
                  <Divider />
                  <CardBody>
                    {paymentIntentData.metadata?.customerFirstName ? (
                      <div className="space-y-4">
                        <div>
                          <p className="text-default-500 text-sm">Name</p>
                          <p>{paymentIntentData.metadata.customerFirstName} {paymentIntentData.metadata.customerLastName}</p>
                        </div>
                        <div>
                          <p className="text-default-500 text-sm">Email</p>
                          <p>{paymentIntentData.metadata.customerEmail}</p>
                        </div>
                        <div>
                          <p className="text-default-500 text-sm">Phone</p>
                          <p>{paymentIntentData.metadata.customerPhone}</p>
                        </div>
                      </div>
                    ) : paymentIntentData.customer ? (
                      <div>
                        <p className="text-default-500 text-sm">Customer ID</p>
                        <p>{paymentIntentData.customer}</p>
                      </div>
                    ) : (
                      <p className="text-default-500">No customer information available</p>
                    )}
                  </CardBody>
                </Card>

                {/* Billing Information */}
                <Card shadow="sm">
                  <CardHeader className="flex justify-between">
                    <h3 className="text-lg font-semibold">Billing Information</h3>
                  </CardHeader>
                  <Divider />
                  <CardBody>
                    {paymentIntentData.metadata?.billingAddressFull ? (
                      <div className="space-y-4">
                        <div>
                          <p className="text-default-500 text-sm">Address</p>
                          <p>{paymentIntentData.metadata.billingAddressStreet}</p>
                          <p>
                            {paymentIntentData.metadata.billingAddressCity}, {paymentIntentData.metadata.billingAddressState} {paymentIntentData.metadata.billingAddressZip}
                          </p>
                          <p>{paymentIntentData.metadata.billingAddressCountry}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-default-500">No billing information available</p>
                    )}
                  </CardBody>
                </Card>
              </div>

              {/* Order Details */}
              <Card shadow="sm">
                <CardHeader className="flex justify-between">
                  <h3 className="text-lg font-semibold">Order Details</h3>
                  {paymentIntentData.metadata?.orderNumber && (
                    <Chip variant="flat">Order #{paymentIntentData.metadata.orderNumber}</Chip>
                  )}
                </CardHeader>
                <Divider />
                <CardBody>
                  {paymentIntentData.metadata?.cartItems ? (
                    <Table removeWrapper aria-label="Order Items">
                      <TableHeader>
                        <TableColumn>ITEM</TableColumn>
                        <TableColumn>QUANTITY</TableColumn>
                        <TableColumn>PRICE</TableColumn>
                      </TableHeader>
                      <TableBody>
                        {JSON.parse(paymentIntentData.metadata.cartItems).map((item: any, index: number) => (
                          <TableRow key={index}>
                            <TableCell>{item.serviceID}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>{formatCurrency(item.total, paymentIntentData.currency)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-default-500">No order details available</p>
                  )}
                </CardBody>
              </Card>

              {/* Amount Details */}
              <Card shadow="sm">
                <CardHeader>
                  <h3 className="text-lg font-semibold">Amount Details</h3>
                </CardHeader>
                <Divider />
                <CardBody>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-default-500">Subtotal</span>
                      <span>{formatCurrency(paymentIntentData.amount, paymentIntentData.currency)}</span>
                    </div>
                    {paymentIntentData.amount_details?.shipping?.amount !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-default-500">Shipping</span>
                        <span>{formatCurrency(paymentIntentData.amount_details.shipping.amount, paymentIntentData.currency)}</span>
                      </div>
                    )}
                    {paymentIntentData.amount_details?.tax?.total_tax_amount !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-default-500">Tax</span>
                        <span>{formatCurrency(paymentIntentData.amount_details.tax.total_tax_amount, paymentIntentData.currency)}</span>
                      </div>
                    )}
                    {paymentIntentData.amount_details?.tip?.amount !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-default-500">Tip</span>
                        <span>{formatCurrency(paymentIntentData.amount_details.tip.amount, paymentIntentData.currency)}</span>
                      </div>
                    )}
                    <Divider />
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>{formatCurrency(paymentIntentData.amount, paymentIntentData.currency)}</span>
                    </div>
                    <div className="flex justify-between text-success">
                      <span>Amount Received</span>
                      <span>{formatCurrency(paymentIntentData.amount_received, paymentIntentData.currency)}</span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          </Tab>
          
          <Tab key="payment-details" title={
            <div className="flex items-center gap-2">
              <Icon icon="lucide:credit-card" />
              <span>Payment Details</span>
            </div>
          }>
            <div className="p-4 space-y-6">
              <Card shadow="sm">
                <CardHeader>
                  <h3 className="text-lg font-semibold">Payment Method Details</h3>
                </CardHeader>
                <Divider />
                <CardBody>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-default-500 text-sm">Payment Method ID</p>
                      <p className="font-mono text-sm mt-1">{paymentIntentData.payment_method}</p>
                    </div>
                    <div>
                      <p className="text-default-500 text-sm">Payment Method Types</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {paymentIntentData.payment_method_types.map((type, index) => (
                          <Chip key={index} variant="flat" className="capitalize">{type}</Chip>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-default-500 text-sm">Confirmation Method</p>
                      <p className="capitalize mt-1">{paymentIntentData.confirmation_method}</p>
                    </div>
                    <div>
                      <p className="text-default-500 text-sm">Capture Method</p>
                      <p className="capitalize mt-1">{paymentIntentData.capture_method}</p>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Payment Method Options */}
              <Card shadow="sm">
                <CardHeader>
                  <h3 className="text-lg font-semibold">Payment Method Options</h3>
                </CardHeader>
                <Divider />
                <CardBody>
                  {paymentIntentData.payment_method_options ? (
                    <div className="space-y-4">
                      {Object.entries(paymentIntentData.payment_method_options).map(([key, value]) => (
                        <div key={key}>
                          <p className="text-default-500 text-sm capitalize">{key}</p>
                          <pre className="bg-content2 p-3 rounded-medium mt-1 overflow-auto text-sm">
                            {JSON.stringify(value, null, 2)}
                          </pre>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-default-500">No payment method options available</p>
                  )}
                </CardBody>
              </Card>

              {/* Latest Charge */}
              <Card shadow="sm">
                <CardHeader>
                  <h3 className="text-lg font-semibold">Latest Charge</h3>
                </CardHeader>
                <Divider />
                <CardBody>
                  <div className="space-y-4">
                    <div>
                      <p className="text-default-500 text-sm">Charge ID</p>
                      <p className="font-mono text-sm mt-1">{paymentIntentData.latest_charge}</p>
                    </div>
                    <div className="flex justify-end">
                      <Button 
                        color="primary" 
                        variant="flat"
                        startContent={<Icon icon="lucide:external-link" />}
                      >
                        View Charge Details
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          </Tab>
          
          <Tab key="metadata" title={
            <div className="flex items-center gap-2">
              <Icon icon="lucide:tag" />
              <span>Metadata</span>
            </div>
          }>
            <div className="p-4">
              <Card shadow="sm">
                <CardHeader>
                  <h3 className="text-lg font-semibold">Metadata</h3>
                </CardHeader>
                <Divider />
                <CardBody>
                  {Object.keys(paymentIntentData.metadata || {}).length > 0 ? (
                    <Table removeWrapper aria-label="Metadata">
                      <TableHeader>
                        <TableColumn>KEY</TableColumn>
                        <TableColumn>VALUE</TableColumn>
                      </TableHeader>
                      <TableBody>
                        {Object.entries(paymentIntentData.metadata || {}).map(([key, value]) => (
                          <TableRow key={key}>
                            <TableCell className="font-medium">{key}</TableCell>
                            <TableCell>
                              {typeof value === 'string' && value.startsWith('[') && value.endsWith(']') ? (
                                <Tooltip content="View JSON">
                                  <Button 
                                    size="sm" 
                                    variant="light"
                                    onPress={() => {
                                      try {
                                        alert(JSON.stringify(JSON.parse(value as string), null, 2));
                                      } catch (e) {
                                        alert(value);
                                      }
                                    }}
                                  >
                                    <Icon icon="lucide:code" className="mr-1" /> View JSON
                                  </Button>
                                </Tooltip>
                              ) : (
                                <span>{value as string}</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-default-500">No metadata available</p>
                  )}
                </CardBody>
              </Card>
            </div>
          </Tab>
          
          <Tab key="raw" title={
            <div className="flex items-center gap-2">
              <Icon icon="lucide:code" />
              <span>Raw Data</span>
            </div>
          }>
            <div className="p-4">
              <Card shadow="sm">
                <CardHeader>
                  <h3 className="text-lg font-semibold">Raw Payment Intent Data</h3>
                </CardHeader>
                <Divider />
                <CardBody>
                  <pre className="bg-content2 p-4 rounded-medium overflow-auto text-sm">
                    {JSON.stringify(paymentIntentData, null, 2)}
                  </pre>
                </CardBody>
              </Card>
            </div>
          </Tab>
        </Tabs>
      </Card>
    </div>
  );
};

export default InstapaytientDetailPage;
