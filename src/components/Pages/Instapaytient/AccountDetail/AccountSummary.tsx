import React from "react";
import { Card } from "@heroui/card";
import { CardBody } from "@heroui/card";

export const AccountSummary: React.FC = () => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardBody>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Available Balance</span>
            <span className="text-2xl font-semibold">$24,568.00</span>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Pending</span>
            <span className="text-2xl font-semibold">$3,450.00</span>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Total Transactions</span>
            <span className="text-2xl font-semibold">21</span>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
