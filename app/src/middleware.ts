import * as jose from "jose";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const accecssToken = req.headers.get("authorization")?.split(" ")[1];

  if (!accecssToken) {
    return new NextResponse(
      JSON.stringify({
        status: "error",
        statusCode: 401,
        message: "Missing access token",
        detail: "Please re-login",
      }),
      { status: 401 },
    );
  }

  try {
    await jose.jwtVerify(
      accecssToken,
      new TextEncoder().encode(process.env.TOKEN_SECRET),
      {
        typ: "access",
        issuer: process.env.TOKEN_ISSUER,
        audience: process.env.TOKEN_ISSUER,
      },
    );
  } catch (e) {
    return new NextResponse(
      JSON.stringify({
        status: "error",
        statusCode: 401,
        message: "Invalid or expired access token",
        detail: "Please re-login",
      }),
      { status: 401 },
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/customers/:path*"],
};
