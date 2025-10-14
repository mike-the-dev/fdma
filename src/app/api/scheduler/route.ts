import authorizeRequest from "@/utils/authorizeRequest";
import listSchedulers from "@/utils/listSchedulers";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  await authorizeRequest(
    request.headers.get("authorization")?.split("Bearer ")[1].trim() || ""
  );

  const schedulers = await listSchedulers();

  return new Response(JSON.stringify({ schedulers: schedulers }), {
    status: 200,
  });
}
