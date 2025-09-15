import { ScanCommand, ScanCommandOutput } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import dynamoClient from "./dynamoClient";


export type AccountInstapaytient = {
  entity: string;
  _createdAt_: string;
  payout?: {
    name: string;
    total_payout_amount: number;
    take: number;
    currency: string;
    instant_payout_enabled: boolean;
    stripe_id: string;
  };
  company: string;
  'GSI1-SK': string;
  SK: string;
  'GSI1-PK': string;
  PK: string;
  name: string;
  _lastUpdated_: string;
  state: string;
};

export type IScanCommandOutput<T> = Omit<ScanCommandOutput, "Items"> & {
  Items?: T,
};

const listAccountsInstapaytient = async (): Promise<AccountInstapaytient[]> => {
  const Items: AccountInstapaytient[] = [];
  let lastEvaluatedKey: any = undefined;

  do {
    const command = new ScanCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME_INSTAPAYTIENT ? process.env.DYNAMODB_TABLE_NAME_INSTAPAYTIENT : "",
      "ConsistentRead": false,
      "FilterExpression": "begins_with(#PK, :PK) AND begins_with(#SK, :SK)",
      "ExpressionAttributeNames": {
        "#PK": "PK",
        "#SK": "SK"
      },
      "ExpressionAttributeValues": marshall({ 
        ":PK": "A#",
        ":SK": "A#"
       }),
      ...(lastEvaluatedKey && { ExclusiveStartKey: lastEvaluatedKey })
    });

    const response = (await dynamoClient.send(command)) as IScanCommandOutput<AccountInstapaytient[]>;
    
    response.Items?.forEach((item) => {
      // @ts-ignore
      Items.push(unmarshall(item));
    });

    lastEvaluatedKey = response.LastEvaluatedKey;
  } while (lastEvaluatedKey);

  // Default sort by company
  Items.sort((a: any, b: any) => (a.company > b.company) ? 1 : -1); 

  return Items;
};

export default listAccountsInstapaytient;
