import { NextRequest, NextResponse } from "next/server";
import authorizeRequest from "./utils/authorizeRequest";
import { cookies } from "next/headers";

const protectedRoutes = ["/dashboard", "/dashboard/home", "/dashboard/account-creation"];

export default async (request: NextRequest) => {
  const key: string = cookies().get("auth-public-token")?.value || "";
  const hasSession: boolean = await authorizeRequest(key);

  if (hasSession && ["/", "/login"].includes(request.nextUrl.pathname)) {
    const absoluteURL: URL = new URL("/dashboard/home", request.nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());
  };

  if (!hasSession && protectedRoutes.includes(request.nextUrl.pathname)) {
    const absoluteURL: URL = new URL("/login", request.nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());
  };
};