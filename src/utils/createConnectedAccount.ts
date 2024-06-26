import Stripe from "stripe";

const createConnectedAccount = async (businessUrl: string): Promise<string> => {
  const prodSecret = process.env.STRIPE_PROD_SECRET ? process.env.STRIPE_PROD_SECRET : "";
  const stripe = new Stripe(prodSecret, {
    apiVersion: "2023-10-16"
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
        statement_descriptor: "JOY MD"
      }
    }
  });

  return account.id;
};

export default createConnectedAccount;