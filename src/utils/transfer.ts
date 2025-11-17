import Stripe from "stripe";

const prodSecret = process.env.STRIPE_PROD_SECRET
  ? process.env.STRIPE_PROD_SECRET
  : "";
const stripe = new Stripe(prodSecret, {
  apiVersion: "2025-10-29.clover",
});

const transfer = async (
  amount: number,
  stripeAccount: string
): Promise<void> => {
  const transfer = await stripe.transfers.create({
    amount: amount,
    currency: "usd",
    destination: stripeAccount,
  });

  console.log("transfer complete: ", transfer);
};

export default transfer;
