import { GetCommand, GetCommandOutput } from "@aws-sdk/lib-dynamodb";
import dynamoClient from "./dynamoClient";

interface PayoutUserAccount {
  SK: string;
  PK: string;
  name: string;
  take: number;
  currency: string;
  totalPayoutAmount: number;
  instantPayoutEnabled: boolean;
};

export type IGetCommandOutput<T> = Omit<GetCommandOutput, "Item"> & {
  Item?: T;
};

const getPayoutUser = async (id: string): Promise<PayoutUserAccount | undefined> => {
  const command = new GetCommand({
    TableName: process.env.DYNAMODB_TABLE_NAME ? process.env.DYNAMODB_TABLE_NAME : "",
    Key: {
      PK: id,
      SK: id
    }
  });

  const response = (await dynamoClient.send(command)) as IGetCommandOutput<PayoutUserAccount>;

  return response.Item;
};

export default getPayoutUser;