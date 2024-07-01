import authorizeRequest from "@/utils/authorizeRequest";
import updateAccount from "@/utils/updateAccount";

type ResponseData = {
  PK: string;
  SK: string;
  name: string;
  currency: string;
  take: number;
  instantPayoutEnabled: boolean;
  stripeID: string;
  ecwidAppSecretKey: string;
  ecwidPublicKey: string;
  ecwidSecretKey: string;
  "GSI1-PK": string;
};

export async function POST(request: Request, response: Response) {
  const body: ResponseData = await request.json();

  await authorizeRequest(request.headers.get("authorization")?.split("Bearer ")[1].trim() || "");

  await updateAccount({
    PK: body.PK,
    SK: body.SK,
    name: body.name,
    currency: body.currency,
    take: body.take,
    instantPayoutEnabled: body.instantPayoutEnabled,
    stripeID: body.stripeID,
    ecwidAppSecretKey: body.ecwidAppSecretKey,
    ecwidPublicKey: body.ecwidPublicKey,
    ecwidSecretKey: body.ecwidSecretKey,
    "GSI1-PK": body["GSI1-PK"],
    "GSI1-SK": body["GSI1-PK"]
  });

  return Response.json({ 
    name: body.name,
    currency: body.currency,
    take: body.take
  });
};
