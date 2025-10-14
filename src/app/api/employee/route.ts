import authorizeRequest from "@/utils/authorizeRequest";
import listEmployee from "@/utils/listEmployees";

export async function GET(request: Request) {
  await authorizeRequest(
    request.headers.get("authorization")?.split("Bearer ")[1].trim() || ""
  );

  const employees = await listEmployee();

  return new Response(JSON.stringify({ employees: employees }), {
    status: 200,
  });
}
