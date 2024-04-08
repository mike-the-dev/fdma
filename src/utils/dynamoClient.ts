import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
  region: process.env.AWS_REGION ? process.env.AWS_REGION : "",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY ? process.env.AWS_ACCESS_KEY : "",
    secretAccessKey: process.env.AWS_SECRET_KEY ? process.env.AWS_SECRET_KEY : ""
  }
});
const dynamoClient = DynamoDBDocumentClient.from(client);

export default dynamoClient;