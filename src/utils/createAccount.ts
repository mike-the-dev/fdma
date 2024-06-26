import { ulid } from "ulid";
import { PutCommand, PutCommandOutput } from "@aws-sdk/lib-dynamodb";
import dynamoClient from "./dynamoClient";
import createConnectedAccount from "./createConnectedAccount";
import updateStripeAccount from "./updateStripeAccount";


export type AccountPayload = {
  PK: string;
  SK: string;
  name: string;
  currency: string;
  take: number;
  totalPayoutAmount: number;
  stripeID: string;
};

export type AccountInputParams = {
  name: string;
  currency: string;
  take: number;
  totalPayoutAmount: number;
  businessUrl: string;
};

export type IPutCommandOutput<T> = Omit<PutCommandOutput, "Items"> & {
  Items?: T,
};

const createAccount = async (payload: AccountInputParams): Promise<any> => {
  const stripeID: string = await createConnectedAccount(payload.businessUrl);

  const UID: string = `u#${ulid()}`;
  const userInput: AccountPayload = {
    ...payload,
    PK: UID,
    SK: UID,
    stripeID: stripeID
  };

  const command = new PutCommand({
    TableName: process.env.DYNAMODB_TABLE_NAME ? process.env.DYNAMODB_TABLE_NAME : "",
    Item: {
      ...userInput
    }
  });

  (await dynamoClient.send(command)) as IPutCommandOutput<AccountPayload>;

  await updateStripeAccount(stripeID, UID);
};

export default createAccount;