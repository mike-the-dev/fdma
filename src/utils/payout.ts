import Stripe from 'stripe';

// type PayoutMetaData = Stripe.MetadataParam;
type PayoutMetaData = any;

const prodSecret = process.env.STRIPE_PROD_SECRET ? process.env.STRIPE_PROD_SECRET : "";
const stripe = new Stripe(prodSecret, {
  apiVersion: "2023-10-16"
});

const payout = async (
  amount: number, 
  stripeAccount: string, 
  payoutMetaData: PayoutMetaData, 
  currency?: string,
  isInstantPayout?: boolean
): Promise<void> => {
  const payout = await stripe.payouts.create(
    {
      amount: amount,
      currency: !currency ? "usd" : currency,
      metadata: payoutMetaData,
      method: !isInstantPayout ? "standard" : "instant"
    },
    {
      stripeAccount: stripeAccount,
    }
  );

  console.log("Payout succesfull!: ", payout);
};

export default payout;