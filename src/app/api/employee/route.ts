import listEmployee from "@/utils/listEmployees";

export async function GET(request: Request, response: Response) {
  const employees = await listEmployee();

  return new Response(JSON.stringify({ employees: employees }), {
    status: 200,
  });
};