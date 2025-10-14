import { ScanCommand, ScanCommandOutput } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

import dynamoClient from "./dynamoClient";

export type Employee = {
  PK: string;
  SK: string;
  name: string;
  stripeID: string;
  totalPayoutAmount: number;
};

export type IScanCommandOutput<T> = Omit<ScanCommandOutput, "Items"> & {
  Items?: T;
};

const listEmployees = async (): Promise<Employee[]> => {
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
      ":SK": "e#",
    }),
  });

  const response = (await dynamoClient.send(command)) as IScanCommandOutput<
    Employee[]
  >;

  const Items: Employee[] = [];

  response.Items?.forEach((item) => {
    // @ts-ignore
    if (
      // @ts-ignore
      unmarshall(item).name === "Henry" ||
      // @ts-ignore
      unmarshall(item).name === "Michael" ||
      // @ts-ignore
      unmarshall(item).name === "Sally"
    )
      return;
    // @ts-ignore
    Items.push(unmarshall(item));
  });

  // Default sort
  Items.sort((a: any, b: any) => (a.name > b.name ? 1 : -1));

  return Items;
};

export default listEmployees;
