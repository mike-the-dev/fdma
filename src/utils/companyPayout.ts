import { PayoutMetaData } from "@/utils/payoutEmployees";
import founderPayout from "@/utils/founderPayout";
import employeePayout from "@/utils/employeePayout";

/**
 * Pay outs to employees in company.
 * @param payoutAccountID A string that represents the customer ID.
 * @param currentSubtotalPrice Sub total price from shopify.
 */

const companyPayout = async (
  payoutAccountID: string,
  currentSubtotalPrice: number,
  payoutMetaData: PayoutMetaData
): Promise<void> => {
  const stripeIDs: { accountID: string; stripeID: string; take: number }[] = [
    // Michael
    {
      accountID: "e#01HE9A1R4140ZZRB2KNSCWTR4S",
      stripeID: "acct_1NlGo22VtceChzVP",
      take: 1,
    },
    // Henry
    {
      accountID: "e#01HE9A3S9QFQMJQC0328HWNFN7",
      stripeID: "acct_1NlGoNFbIMQZZWcr",
      take: 1,
    },
    // Sally
    {
      accountID: "e#01H96PE28NS6D76CVTJRKDYD9K",
      stripeID: "acct_1NlGnKFZCuSOUdyG",
      take: 0.35,
    },
  ];

  stripeIDs.forEach(
    async (founder) =>
      await founderPayout(
        founder.accountID,
        founder.stripeID,
        founder.take,
        currentSubtotalPrice,
        payoutMetaData
      )
  );

  const employeeIdentifications: { id: string; stripeID: string }[] = [
    { id: "e#01H950JX5NKCDEF90EXV8JVVDZ", stripeID: "acct_1Nl3CeFVQymOzZNO" },
    { id: "e#01H96CCFV2SY0YKFR8KS2NCSAB", stripeID: "acct_1NlFDPFbnijrQ8kE" },
    { id: "e#01H96PGZRNNEKTH516JFQHX1AQ", stripeID: "acct_1NlGniFWbUpkJNby" },
    { id: "e#01H96NWJM68RD6QRK584TSKZ4P", stripeID: "acct_1NlGyWFJfn8FS8Me" },
  ];

  employeeIdentifications.forEach(
    async (employee) =>
      await employeePayout(
        employee.id,
        employee.stripeID,
        payoutAccountID,
        currentSubtotalPrice,
        payoutMetaData
      )
  );
};

export default companyPayout;
