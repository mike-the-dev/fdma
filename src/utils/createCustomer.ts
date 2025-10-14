import { ulid } from "ulid";
import { PutCommand, PutCommandOutput } from "@aws-sdk/lib-dynamodb";

import dynamoClient from "./dynamoClient";

export type Customer = {
  PK: string;
  SK: string;
  name: string;
  take: number;
  customerID: number;
};

export type CustomerInputParams = {
  PK: string;
  name: string;
  take: number;
  customerID: number;
};

export type IPutCommandOutput<T> = Omit<PutCommandOutput, "Items"> & {
  Items?: T;
};

const createUser = async (payload: CustomerInputParams): Promise<any> => {
  const UUID: string = payload.PK;
  const CUID: string = `c#${ulid()}`;
  const userInput: Customer = {
    ...payload,
    PK: UUID,
    SK: CUID,
  };

  const command = new PutCommand({
    TableName: process.env.DYNAMODB_TABLE_NAME
      ? process.env.DYNAMODB_TABLE_NAME
      : "",
    Item: {
      ...userInput,
    },
  });

  (await dynamoClient.send(command)) as IPutCommandOutput<Customer>;
};

export default createUser;
