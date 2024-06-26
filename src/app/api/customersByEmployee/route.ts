import authorizeRequest from "@/utils/authorizeRequest";
import listCustomer from "@/utils/listCustomers";

type ResponseData = {
  ID: string;
};

export async function POST(request: Request, response: Response) {
  const body: ResponseData = await request.json();

  await authorizeRequest(request.headers.get("authorization")?.split("Bearer ")[1].trim() || "");

  const customers = await listCustomer(body.ID);

  return Response.json({
    customers: customers
  });
};