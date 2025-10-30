import Stripe from "stripe";

const createConnectedAccount = async (businessUrl: string): Promise<string> => {
  const prodSecret = process.env.STRIPE_PROD_SECRET
    ? process.env.STRIPE_PROD_SECRET
    : "";
  const stripe = new Stripe(prodSecret, {
    apiVersion: "2025-09-30.clover",
  });

  const account = await stripe.accounts.create({
    country: "US",
    type: "express",
    capabilities: {
      card_payments: {
        requested: true,
      },
      transfers: {
        requested: true,
      },
    },
    business_type: "individual",
    business_profile: {
      url: businessUrl,
    },
    settings: {
      payments: {
        statement_descriptor: "Instapaytient",
      },
    },
  });

  return account.id;
};

export default createConnectedAccount;
