import authorizeRequest from "@/utils/authorizeRequest";
import listAccounts from "@/utils/listAccounts";

export const dynamic = "force-dynamic";

export async function GET(request: Request, response: Response) {
  await authorizeRequest(request.headers.get("authorization")?.split("Bearer ")[1].trim() || "");

  const accounts = await listAccounts();

  return new Response(JSON.stringify({ accounts: accounts }), {
    status: 200,
  });

};