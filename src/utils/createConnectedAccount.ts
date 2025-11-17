import Stripe from "stripe";

type CreateConnectedAccountParams = {
  businessName: string;
  businessUrl: string;
};

const createConnectedAccount = async ({
  businessName,
  businessUrl,
}: CreateConnectedAccountParams): Promise<string> => {
  const prodSecret = process.env.STRIPE_PROD_SECRET
    ? process.env.STRIPE_PROD_SECRET
    : "";
  const stripe = new Stripe(prodSecret, {
    apiVersion: "2025-10-29.clover",
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
      affirm_payments: {
        requested: true,
      },
    },
    business_type: "individual",
    business_profile: {
      name: businessName,
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
