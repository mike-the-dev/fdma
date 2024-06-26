import authorizeRequest from "@/utils/authorizeRequest";
import createUser from "@/utils/createUser";

type ResponseData = {
  name: string;
  currency: string;
  take: number;
  totalPayoutAmount: number;
};

export async function POST(request: Request, response: Response) {
  const body: ResponseData = await request.json();

  await authorizeRequest(request.headers.get("authorization")?.split("Bearer ")[1].trim() || "");

  await createUser({
    name: body.name,
    currency: body.currency,
    take: body.take,
    totalPayoutAmount: 0
  });

  return Response.json({ 
    name: body.name,
    currency: body.currency,
    take: body.take,
    totalPayoutAmount: 0
  });
};
