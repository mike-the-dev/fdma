import Stripe from "stripe";

const updateStripeAccount = async (
  stripeID: string,
  accountID: string
): Promise<void> => {
  const prodSecret = process.env.STRIPE_PROD_SECRET
    ? process.env.STRIPE_PROD_SECRET
    : "";
  const stripe = new Stripe(prodSecret, {
    apiVersion: "2025-10-29.clover",
  });

  const account = await stripe.accounts.update(stripeID, {
    metadata: {
      account_id: accountID,
    },
  });

  console.log(
    `✅ Account ${stripeID} has been updated.`,
    account.metadata?.account_id
  );
};

export default updateStripeAccount;
