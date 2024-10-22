import * as jose from "jose";
import { NextResponse } from "next/server";

export async function middleware(req: Request) {
  const accessToken = req.headers.get("authorization")?.split(" ")[1];

  if (!accessToken) {
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
      accessToken,
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
  matcher: [
    "/api/categories/:path*",
    "/api/products/:path*",
    "/api/carts/:path*",
    "/api/users/:path/cart/:path*",
  ],
};
