import { cookies } from "next/headers";

export async function GET(request: Request) {
  try {
    (await cookies()).delete("auth-public-token");

    return Response.redirect(new URL("/login", request.url), 307);
  } catch (error: any) {
    console.log("Error: ", error.message);

    return Response.json({
      error: {
        message: error.message,
      },
    });
  }
}
