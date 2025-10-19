import React from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Chip } from "@heroui/chip";
import { Icon } from "@iconify/react";
import type { PayoutPayload } from "@/types/Payout";
import { formatDate } from "@/utils/formatters";

interface TransactionDetailsProps {
  payout: PayoutPayload;
  orderId?: string;
}

export const TransactionDetails: React.FC<TransactionDetailsProps> = ({ payout, orderId }) => {
  const {
    tenderTransaction_id,
    tenderTransaction_paymentMethod,
    tenderTransaction_processedAt,
    tenderTransaction_remoteReference,
    tenderTransaction_test,
    tenderTransaction_transactionDetails
  } = payout;

  const paymentMethodIcon = tenderTransaction_paymentMethod === "CREDIT_CARD" 
    ? "lucide:credit-card" 
    : "lucide:wallet";

  const creditCardCompany = "Visa"; // Hardcoded for now, will be dynamic later

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold">Transaction Details</h2>
      </CardHeader>
      <Divider />
      <CardBody className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-foreground-500">Transaction ID</span>
          <div className="flex items-center gap-2">
            <span className="font-medium">{tenderTransaction_id || "N/A"}</span>
            {tenderTransaction_id && (
              <Icon icon="lucide:copy" className="text-foreground-400 cursor-pointer" width={16} />
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-foreground-500">Payment Method</span>
          <div className="flex items-center gap-2">
            <Icon icon={paymentMethodIcon} className="text-foreground-500" />
            <span className="capitalize">
              {tenderTransaction_paymentMethod ? tenderTransaction_paymentMethod.replace('_', ' ') : "N/A"}
            </span>
            {creditCardCompany && (
              <Chip size="sm" variant="flat" color="default">
                {creditCardCompany}
              </Chip>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-foreground-500">Processed Date</span>
          <span>{tenderTransaction_processedAt ? formatDate(tenderTransaction_processedAt, true) : "N/A"}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-foreground-500">Reference</span>
          <span className="font-mono text-sm">{tenderTransaction_remoteReference || "N/A"}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-foreground-500">Order ID</span>
          <span className="font-mono text-sm">{orderId || "N/A"}</span>
        </div>

        {tenderTransaction_test && (
          <div className="flex items-center justify-end mt-2">
            <Chip color="warning" size="sm" variant="flat">Test Transaction</Chip>
          </div>
        )}
      </CardBody>
    </Card>
  );
};


