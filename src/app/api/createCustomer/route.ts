import createCustomer from "@/utils/createCustomer";

type ResponseData = {
  PK: string
  name: string;
  take: number;
  customerID: number;
};

export async function POST(request: Request, response: Response) {
  const body: ResponseData = await request.json();

  await createCustomer({
    PK: body.PK,
    name: body.name,
    take: body.take,
    customerID: body.customerID
  });

  return Response.json({
    name: body.name,
    take: body.take,
    customerID: body.customerID
  });
};
