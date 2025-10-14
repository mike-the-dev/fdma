import currencyFormatter from "currency-formatter";

import transfer from "./transfer";
import payout from "./payout";
import getPayoutUser from "./getPayoutUser";
import setTotalPayoutAmount from "./setTotalPayoutAmount";

import { PayoutMetaData } from "@/utils/payoutEmployees";

/**
 * Founder Pay outs.
 * @param accountID The ID of the founders user account.
 * @param stripeID The ID of a stripe user.
 * @param payoutTake The payout percentage for paying out a founder as integer.
 * @param currentSubtotalPrice Sub total price from shopify.
 */

const founderPayout = async (
  accountID: string,
  stripeID: string,
  payoutTake: number,
  currentSubtotalPrice: number,
  payoutMetaData: PayoutMetaData
): Promise<void> => {
  // *** RUN JOYMD TAKE & CREDIT CARD TAKE ***
  const transactionTake: number = payoutTake;
  const companyTake: number = transactionTake;

  // *** RUN CONVERSION TO USD DOLLAR AMOUNT ***
  const take: number = Math.round(companyTake * currentSubtotalPrice);
  const amountToPayout: number = take;
  const payoutAmountAsText: string = currencyFormatter.format(
    amountToPayout / 100,
    { code: "USD" }
  );

  await transfer(amountToPayout, stripeID);
  await payout(amountToPayout, stripeID, payoutMetaData);

  // *** Increment amount to toal payout. ***
  const account = await getPayoutUser(accountID);

  if (!account)
    throw new Error("No account was found by this account ID in Database.");
  await setTotalPayoutAmount(account, amountToPayout);

  // Stripe ID Of Employee Needed.
  console.log("STRIPE ID OF Founder: ", stripeID);
  console.log(
    `Founder payoutAmountAsText from sale of ${currencyFormatter.format(currentSubtotalPrice, { code: "USD" })}: `,
    payoutAmountAsText
  );
  console.log(`Founder amountToPayout: `, amountToPayout);
};

export default founderPayout;
