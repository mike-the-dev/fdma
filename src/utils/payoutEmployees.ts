import getPayoutUser from "@/utils/getPayoutUser";
import companyPayout from "@/utils/companyPayout";

export type PayoutEmployeesInputParams = {
  current_subtotal_price: number;
  payout_account_id: string;
  order_name: string;
};

export interface PayoutMetaData {
  payout_from: string;
  order_number: string;
};

const payoutEmployees = async (payload: PayoutEmployeesInputParams): Promise<any> => {
  const shopifyData = payload;

  if (!shopifyData.payout_account_id) throw new Error("Account ID for payout user was not given");

  const account = await getPayoutUser(shopifyData.payout_account_id);

  if (!account) throw new Error("No account was found by this account ID in Database.");
  if (!shopifyData.current_subtotal_price) throw new Error(`Current sub total price not available. Check Shopify flow app settings to make sure action as been set up properly. current_subtotal_price: ${shopifyData.current_subtotal_price} payout_account_id: ${shopifyData.payout_account_id}`);


  let currentSubtotalPrice: number | undefined = undefined;

  //  *** SUBTOTAL PRICE FROM SHOPIFY ***
  currentSubtotalPrice = shopifyData.current_subtotal_price;

  // *** Create meta data for payout ***
  const payoutMetaDeta: PayoutMetaData = {
    payout_from: account.name,
    order_number: shopifyData.order_name
  };

  console.log("payoutMetaData ", payoutMetaDeta);

  // *** Payout To Company Employees ***
  await companyPayout(shopifyData.payout_account_id, currentSubtotalPrice, payoutMetaDeta);
};

export default payoutEmployees;