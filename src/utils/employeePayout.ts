import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import currencyFormatter from "currency-formatter";

import dynamoClient from "./dynamoClient";
import transfer from "./transfer";
import payout from "./payout";
import setTotalPayoutAmount from "./setTotalPayoutAmount";
import getPayoutUser from "./getPayoutUser";

/**
 * Employee Pay outs.
 * @param employeeID The ID of a employee in DynamoDB.
 * @param stripeID The ID of a stripe user.
 * @param customerID The ID of a customer from Shopify also stored in DynamoDB.
 * @param currentSubtotalPrice Sub total price from Shopify.
 * @param payoutMetaData Custom metadata object for a Payout.
 */

const employeePayout = async (
  employeeID: string,
  stripeID: string,
  customerID: string,
  currentSubtotalPrice: number,
  payoutMetaData: any
): Promise<void> => {
  const command = new QueryCommand({
    TableName: process.env.DYNAMODB_TABLE_NAME
      ? process.env.DYNAMODB_TABLE_NAME
      : "",
    KeyConditionExpression: "#pk = :pk And begins_with(#sk, :sk)",
    ExpressionAttributeNames: {
      "#pk": "PK",
      "#sk": "SK",
    },
    ExpressionAttributeValues: {
      ":pk": `${employeeID}`,
      ":sk": "c#",
    },
    ConsistentRead: true,
    ScanIndexForward: true,
  });

  const response = await dynamoClient.send(command);

  const customer =
    response.Items?.filter((customer) => customer.customerID === customerID) ||
    [];

  if (customer.length === 0)
    return console.log(
      `Employee ${employeeID} is not assigned to this customer.`
    );

  // *** RUN JOYMD TAKE & CREDIT CARD TAKE ***
  const transactionTake: number = customer[0].take;
  const companyTake: number = transactionTake;

  // *** RUN CONVERSION TO USD DOLLAR AMOUNT ***
  const take: number = Math.round(companyTake * currentSubtotalPrice);
  const amountToPayout: number = take;
  const payoutAmountAsText: string = currencyFormatter.format(
    amountToPayout / 100,
    { code: "USD" }
  );

  // *** Transfer and Payout ***
  await transfer(amountToPayout, stripeID);

  // *** Payout user. ***
  await payout(amountToPayout, stripeID, payoutMetaData);

  // *** Increment amount to toal payout. ***
  const account = await getPayoutUser(employeeID);

  if (!account)
    throw new Error("No account was found by this account ID in Database.");
  await setTotalPayoutAmount(account, amountToPayout);

  // Stripe ID Of Employee Needed.
  console.log("STRIPE ID OF EMPLOYEE: ", stripeID);
  console.log(
    `${employeeID} payoutAmountAsText from ${customer[0].name} sale of ${currencyFormatter.format(currentSubtotalPrice, { code: "USD" })}: `,
    payoutAmountAsText
  );
  console.log(`${employeeID} amountToPayout: `, amountToPayout);
};

export default employeePayout;
