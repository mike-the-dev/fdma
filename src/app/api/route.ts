import listAccounts from "@/utils/listAccounts";

export const dynamic = "force-dynamic";

export async function GET(request: Request, response: Response) {
  const accounts = await listAccounts();

  return new Response(JSON.stringify({ accounts: accounts }), {
    status: 200,
  });
};