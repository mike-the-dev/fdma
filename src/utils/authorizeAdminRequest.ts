import { GetCommand, GetCommandOutput } from "@aws-sdk/lib-dynamodb";

import dynamoClient from "./dynamoClient";

interface PayoutUserAccount {
  SK: string;
  PK: string;
  daily_admin_key: string;
}

export type IGetCommandOutput<T> = Omit<GetCommandOutput, "Item"> & {
  Item?: T;
};

const authorizeRequest = async (key: string): Promise<boolean> => {
  const command = new GetCommand({
    TableName: "GlobalSettings-lkkk7azmhvfyzkvrihn7p5mbay-production-restore",
    Key: {
      id: "e5335ec9-32e5-4829-8a4c-bbdb7d5249b3",
    },
  });

  const response = (await dynamoClient.send(
    command
  )) as IGetCommandOutput<PayoutUserAccount>;

  if (response.Item?.daily_admin_key !== key) {
    console.log(
      "❌ User is not authorized to use services.",
      response.Item?.daily_admin_key,
      key
    );

    return false;
  }

  console.log("✅ You are authorized to use services.");

  return true;
};

export default authorizeRequest;
