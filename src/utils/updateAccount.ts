import { UpdateCommand, UpdateCommandOutput } from "@aws-sdk/lib-dynamodb";
import dynamoClient from "./dynamoClient";


export type Account = {
  PK: string;
  SK: string;
  name: string;
  currency: string;
  take: number;
  instantPayoutEnabled: boolean;
  stripeID: string;
  ecwidAppSecretKey: string;
  ecwidPublicKey: string;
  ecwidSecretKey: string;
  "GSI1-PK": string;
  "GSI1-SK": string;
};

export type AccountInputParams = {
  PK: string;
  SK: string;
  name: string;
  currency: string;
  take: number;
  instantPayoutEnabled: boolean;
  stripeID: string;
  ecwidAppSecretKey: string;
  ecwidPublicKey: string;
  ecwidSecretKey: string;
  "GSI1-PK": string;
  "GSI1-SK": string;
};

export type IUpdateCommandOutput<T> = Omit<UpdateCommandOutput, "Items"> & {
  Items?: T,
};

const updateAccount = async (payload: AccountInputParams): Promise<void> => {
  const userInput: Account = {
    ...payload,
  };

  const command = new UpdateCommand({
    TableName: process.env.DYNAMODB_TABLE_NAME ? process.env.DYNAMODB_TABLE_NAME : "",
    Key: {
      PK: userInput.PK,
      SK: userInput.SK
    },
    UpdateExpression: "set #name = :name, currency = :currency, take = :take, instantPayoutEnabled = :instantPayoutEnabled, stripeID = :stripeID, ecwidAppSecretKey = :ecwidAppSecretKey, ecwidPublicKey = :ecwidPublicKey, ecwidSecretKey = :ecwidSecretKey",
    ExpressionAttributeValues: {
      ":name": userInput.name,
      ":currency": userInput.currency,
      ":take": userInput.take,
      ":instantPayoutEnabled": userInput.instantPayoutEnabled,
      ":stripeID": userInput.stripeID,
      ":ecwidAppSecretKey": userInput.ecwidAppSecretKey,
      ":ecwidPublicKey": userInput.ecwidPublicKey,
      ":ecwidSecretKey": userInput.ecwidSecretKey,
    },
    "ExpressionAttributeNames": {
      "#name": "name"
    }
  });

  (await dynamoClient.send(command)) as IUpdateCommandOutput<Account>;
};

export default updateAccount;