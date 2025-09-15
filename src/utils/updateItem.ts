import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import dynamoClient from "./dynamoClient";

/**
 * @author mike-the-dev (Michael Camacho)
 * @editor mike-the-dev (Michael Camacho)
 * @lastUpdated 2025-01-27
 * @name updateItem
 * @description Utility function to perform a partial update on a DynamoDB item using the UpdateCommand.
 * Accepts a generic type to strongly type-check update values.
 * @param keys - { PK: string, SK: string } - Primary keys of the item to update.
 * @param updates - Partial<T> - The subset of values to update.
 * @param tableName - Optional table name override. Defaults to DYNAMODB_TABLE_NAME_INSTAPAYTIENT.
 * @returns Promise<void>
 */
const updateItem = async <T>(keys: { PK: string; SK: string }, updates: Partial<T>, tableName?: string): Promise<void> => {
  // Only log if GSI fields are present
  const hasGSIFields = Object.keys(updates).some(key => key.includes('GSI'));
  const hasCreatedAt = Object.keys(updates).some(key => key.includes('_createdAt_'));
  
  const ExpressionAttributeNames: Record<string, string> = {};
  const ExpressionAttributeValues: Record<string, any> = {};
  const UpdateExpressionParts: string[] = [];

  for (const key in updates) {
    // Skip undefined values
    if (updates[key as keyof T] === undefined) {
      continue;
    }
    
    // Only apply hyphen-to-underscore replacement for GSI fields
    const isGSIField = key.startsWith('GSI');
    const expressionName = isGSIField && key.includes('-') ? key.replace(/-/g, '_') : key;
    const nameKey = `#${expressionName}`;
    const valueKey = `:${expressionName}`;
    ExpressionAttributeNames[nameKey] = key;
    ExpressionAttributeValues[valueKey] = updates[key as keyof T];
    UpdateExpressionParts.push(`${nameKey} = ${valueKey}`);
  }

  if (hasGSIFields || hasCreatedAt) {
    console.log("🔍 updateItem DEBUG - ExpressionAttributeNames:", ExpressionAttributeNames);
    console.log("🔍 updateItem DEBUG - ExpressionAttributeValues:", ExpressionAttributeValues);
    console.log("🔍 updateItem DEBUG - UpdateExpressionParts:", UpdateExpressionParts);
  }

  const command = new UpdateCommand({
    TableName: tableName || process.env.DYNAMODB_TABLE_NAME_INSTAPAYTIENT || "",
    Key: keys,
    UpdateExpression: `SET ${UpdateExpressionParts.join(", ")}`,
    ExpressionAttributeNames,
    ExpressionAttributeValues
  });

  await dynamoClient.send(command);
};

export default updateItem;
