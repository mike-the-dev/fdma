import createAccount from "@/utils/createAccount";

type ResponseData = {
  businessUrl: string;
};

export async function POST(request: Request) {
  try {
    const body: ResponseData = await request.json();

    const stripeID = await createAccount({
      businessUrl: body.businessUrl,
    });

    return Response.json({
      businessUrl: body.businessUrl,
      stripeID: stripeID,
    });
  } catch (error: any) {
    console.log("Error: ", error.message || error.raw.message);

    return Response.json({
      error: {
        message: error.raw ? error.raw.message : error.message,
      },
    });
  }
}
