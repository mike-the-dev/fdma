import { ulid } from "ulid";
import { PutCommand, PutCommandOutput } from "@aws-sdk/lib-dynamodb";
import dynamoClient from "./dynamoClient";


export type Account = {
  PK: string;
  SK: string;
  name: string;
  currency: string;
  take: number;
  totalPayoutAmount: number;
};

export type AccountInputParams = {
  name: string;
  currency: string;
  take: number;
  totalPayoutAmount: number;
};

export type IPutCommandOutput<T> = Omit<PutCommandOutput, "Items"> & {
  Items?: T,
};

const createUser = async (payload: AccountInputParams): Promise<any> => {
  const UID: string = `u#${ulid()}`;
  const userInput: Account = {
    ...payload,
    PK: UID,
    SK: UID
  };

  const command = new PutCommand({
    TableName: process.env.DYNAMODB_TABLE_NAME ? process.env.DYNAMODB_TABLE_NAME : "",
    Item: {
      ...userInput
    }
  });

  (await dynamoClient.send(command)) as IPutCommandOutput<Account>;
};

export default createUser;