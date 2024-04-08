import listCustomer from "@/utils/listCustomers";

type ResponseData = {
  ID: string;
};

export async function POST(request: Request, response: Response) {
  const body: ResponseData = await request.json();

  const customers = await listCustomer(body.ID);

  return Response.json({
    customers: customers
  });
};