import createConnectedAccount from "./createConnectedAccount";


export type AccountInputParams = {
  businessUrl: string;
};

const createAccount = async (payload: AccountInputParams): Promise<string> => {
  const stripeID: string = await createConnectedAccount(payload.businessUrl);
  return stripeID;
};

export default createAccount;