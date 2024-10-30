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
      return NextResponse.redirect(new URL("/?error=AuthRequired", req.url));
    }
    return new NextResponse(
      JSON.stringify({
        status: "error",
        statusCode: 401,
        message: "Can not access this resource",
        detail: "Please login",
      }),
      { status: 401 },
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/cart", "/api/carts/:path*", "/api/users/:path/cart/:path*"],
};
