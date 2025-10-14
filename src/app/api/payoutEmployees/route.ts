import authorizeRequest from "@/utils/authorizeRequest";
import payoutEmployees from "@/utils/payoutEmployees";

type ResponseData = {
  amount: number;
  payout_account_id: string;
  order_name: string;
};

export async function POST(request: Request) {
  await authorizeRequest(
    request.headers.get("authorization")?.split("Bearer ")[1].trim() || ""
  );

  const body: ResponseData = await request.json();

  await payoutEmployees({
    current_subtotal_price: body.amount,
    payout_account_id: body.payout_account_id,
    order_name: body.order_name,
  });

  return Response.json({
    amount: body.amount,
  });
}
