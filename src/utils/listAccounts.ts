import { ScanCommand, ScanCommandOutput } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

import dynamoClient from "./dynamoClient";

export type Account = {
  PK: string;
  SK: string;
  name: string;
  currency: string;
  take: string;
  totalPayoutAmount: string;
};

export type IScanCommandOutput<T> = Omit<ScanCommandOutput, "Items"> & {
  Items?: T;
};

const listAccounts = async (): Promise<Account[]> => {
  const command = new ScanCommand({
    TableName: process.env.DYNAMODB_TABLE_NAME
      ? process.env.DYNAMODB_TABLE_NAME
      : "",
    ConsistentRead: false,
    FilterExpression: "begins_with(#SK, :SK)",
    ExpressionAttributeNames: {
      "#SK": "SK",
    },
    ExpressionAttributeValues: marshall({
      ":SK": "u#",
    }),
  });

  const response = (await dynamoClient.send(command)) as IScanCommandOutput<
    Account[]
  >;

  const Items: Account[] = [];

  response.Items?.forEach((item) => {
    // @ts-ignore
    Items.push(unmarshall(item));
  });

  // Default sort
  Items.sort((a: any, b: any) => (a.name > b.name ? 1 : -1));

  return Items;
};

export default listAccounts;
