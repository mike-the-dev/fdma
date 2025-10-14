import { cookies } from "next/headers";

import authorizeRequest from "@/utils/authorizeRequest";

// type ResponseData = {
// };

export async function POST(request: Request) {
  try {
    // const body: ResponseData = await request.json();
    const key: string =
      request.headers.get("authorization")?.split("Bearer ")[1].trim() || "";

    const hasSession = await authorizeRequest(key);

    if (!hasSession) throw new Error("Could not login user. Key is invalid.");

    (await cookies()).set("auth-public-token", key, {
      httpOnly: true,
      secure: true,
      maxAge: 86400000,
      expires: new Date(Date.now() + 86400000),
    });

    return Response.json({
      isAuthorized: true,
    });
  } catch (error: any) {
    console.log("Error: ", error.message);

    return Response.json({
      error: {
        message: error.message,
      },
    });
  }
}
