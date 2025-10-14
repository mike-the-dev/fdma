import { PutCommand } from "@aws-sdk/lib-dynamodb";

import dynamoClient from "./dynamoClient";

interface PayoutUserAccount {
  SK: string;
  PK: string;
  name: string;
  take: number;
  currency: string;
  totalPayoutAmount: number;
}

const setTotalPayoutAmount = async (
  payoutUserAccount: PayoutUserAccount,
  amount: number
): Promise<PayoutUserAccount> => {
  const newTotalPayoutAmount: number =
    amount + payoutUserAccount.totalPayoutAmount;

  const command = new PutCommand({
    TableName: process.env.DYNAMODB_TABLE_NAME
      ? process.env.DYNAMODB_TABLE_NAME
      : "",
    Item: {
      ...payoutUserAccount,
      totalPayoutAmount: newTotalPayoutAmount,
    },
  });

  await dynamoClient.send(command);

  return { ...payoutUserAccount, totalPayoutAmount: newTotalPayoutAmount };
};

export default setTotalPayoutAmount;
