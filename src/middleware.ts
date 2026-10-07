import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const protectedPath = ["/dashboard", "/seller", "/admin", "/checkout"];
  if (protectedPath.some((path) => request.nextUrl.pathname.startsWith(path)) && !request.cookies.get("marketx_session")) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/dashboard/:path*", "/seller/:path*", "/admin/:path*", "/checkout/:path*"] };
