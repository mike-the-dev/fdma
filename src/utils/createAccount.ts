import createConnectedAccount from "./createConnectedAccount";

export type AccountInputParams = {
  businessName: string;
  businessUrl: string;
};

const createAccount = async (payload: AccountInputParams): Promise<string> => {
  const stripeID: string = await createConnectedAccount({
    businessName: payload.businessName,
    businessUrl: payload.businessUrl,
  });

  return stripeID;
};

export default createAccount;
