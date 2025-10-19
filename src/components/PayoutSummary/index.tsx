import React from "react";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import { Icon } from "@iconify/react";
import { formatCurrency, formatDate } from "@/utils/formatters";

interface PayoutSummaryProps {
  processedDate: string;
  subtotal: number;
  payoutAmount: number;
  platformFee: number;
  platformFeePercentage: number;
  currency: string;
  instantPayoutEnabled: boolean;
  customTakeRate: number;
}

export const PayoutSummary: React.FC<PayoutSummaryProps> = ({
  processedDate,
  subtotal,
  payoutAmount,
  platformFee,
  platformFeePercentage,
  currency,
  instantPayoutEnabled,
  customTakeRate
}) => {
  // Extract creation date and scheduled date from the processed date
  // In a real implementation, these would come directly from the scheduler data
  const creationDate = new Date(processedDate);
  // Simulate scheduled date (2 days after creation for demo purposes)
  const scheduledDate = new Date(processedDate);
  scheduledDate.setDate(scheduledDate.getDate() + 2);
  
  return (
    <Card>
      <CardBody className="p-6">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          {/* Left column - Payout status */}
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2">
              <Icon icon="lucide:clock" className="text-warning text-xl" />
              <h3 className="text-xl font-semibold">Payout Scheduled</h3>
            </div>
            
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Icon icon="lucide:calendar-plus" className="text-foreground-500" />
                <span>Created on {formatDate(creationDate.toISOString())}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Icon icon="lucide:calendar-clock" className="text-foreground-500" />
                <span className="font-medium">Scheduled for {formatDate(scheduledDate.toISOString(), true)}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {instantPayoutEnabled ? (
                <Chip color="success" variant="flat" size="sm" startContent={<Icon icon="lucide:zap" />}>
                  Instant Payout Enabled
                </Chip>
              ) : (
                <Chip color="warning" variant="flat" size="sm" startContent={<Icon icon="lucide:clock" />}>
                  Standard Payout
                </Chip>
              )}
            </div>
          </div>
          
          {/* Right column - Payout amounts */}
          <div className="flex-1 bg-content2 p-4 rounded-medium space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-foreground-500">Subtotal</span>
              <span>{formatCurrency(subtotal, currency)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                <span className="text-foreground-500">Platform Fee</span>
                <Chip size="sm" variant="flat" className="text-tiny">
                  2.9% + {customTakeRate}%
                </Chip>
              </div>
              <span className="text-danger">-{formatCurrency(platformFee, currency)}</span>
            </div>
            
            <Divider className="my-2" />
            
            <div className="flex justify-between items-center">
              <span className="font-semibold">Customer Payout</span>
              <span className="text-xl font-bold text-success">
                {formatCurrency(payoutAmount, currency)}
              </span>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};


