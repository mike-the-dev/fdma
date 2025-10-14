import { QueryCommand, QueryCommandOutput } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

import dynamoClient from "./dynamoClient";

export type Customer = {
  PK: string;
  SK: string;
  name: string;
  take: number;
  customerID: string;
};

export type IQueryCommandOutput<T> = Omit<QueryCommandOutput, "Items"> & {
  Items?: T;
};

const listCustomers = async (PK: string): Promise<Customer[]> => {
  const command = new QueryCommand({
    TableName: process.env.DYNAMODB_TABLE_NAME
      ? process.env.DYNAMODB_TABLE_NAME
      : "",
    ConsistentRead: false,
    KeyConditionExpression: "#PK = :PK AND begins_with(#SK, :SK)",
    ExpressionAttributeNames: {
      "#PK": "PK",
      "#SK": "SK",
    },
    ExpressionAttributeValues: marshall({
      ":PK": PK,
      ":SK": "c#",
    }),
  });

  const response = (await dynamoClient.send(command)) as IQueryCommandOutput<
    Customer[]
  >;

  const Items: Customer[] = [];

  response.Items?.forEach((item) => {
    // @ts-ignore
    Items.push(unmarshall(item));
  });

  // Default sort
  Items.sort((a: any, b: any) => (a.name > b.name ? 1 : -1));

  return Items;
};

export default listCustomers;
