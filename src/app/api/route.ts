import listAccounts from "@/utils/listAccounts";

export async function GET(request: Request, response: Response) {
  const accounts = await listAccounts();

  return new Response(JSON.stringify({ accounts: accounts }), {
    status: 200,
  });
};