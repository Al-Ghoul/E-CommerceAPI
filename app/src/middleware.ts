import { NextResponse, type NextRequest } from "next/server";
import { VerifyAccessToken } from "./utils";

export async function middleware(req: NextRequest) {
  const accessToken =
    req.headers.get("authorization")?.split(" ")[1] ||
    req.cookies.get("access_token")?.value;

  try {
    await VerifyAccessToken(accessToken);
  } catch {
    if (req.nextUrl.pathname === "/cart") {
      return NextResponse.redirect(
        new URL(`/?error=AuthRequired&next=${req.nextUrl.pathname}`, req.url),
      );
    } else if (req.nextUrl.pathname.includes("orders")) {
      return NextResponse.redirect(
        new URL(`/?error=AuthRequired&next=${req.nextUrl.pathname}`, req.url),
      );
    } else if (req.nextUrl.pathname.endsWith("/logout")) {
      const res = NextResponse.redirect(
        new URL(`/?error=AuthRequired&next=/`, req.url),
      );
      res.cookies.delete("access_token");
      res.cookies.delete("refresh_token");
      return res;
    }

    return new NextResponse(
      JSON.stringify({
        status: "error",
        statusCode: 401,
        message: "Can not access this resource",
        detail: "Invalid Token",
      }),
      { status: 401 },
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/auth/logout",
    "/cart",
    "/orders/:path*",
    "/api/carts/:path*",
    "/api/users/:path/cart/:path*",
  ],
};
