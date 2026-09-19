import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function isProtectedPath(pathname: string): boolean {
  return (
    pathname.startsWith("/account") ||
    pathname === "/wishlist" ||
    pathname === "/cart" ||
    pathname === "/checkout"
  );
}

/** Fast gate: cookie presence only. Profile validation runs on the page/API, not here. */
function hasAuthCookie(request: NextRequest): boolean {
  const token = request.cookies.get("token")?.value;
  return Boolean(token?.trim());
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const loggedIn = hasAuthCookie(request);

  if (loggedIn && pathname === "/signin") {
    const redirect = request.nextUrl.searchParams.get("redirect");
    const returnUrl =
      redirect && redirect.startsWith("/") && !redirect.startsWith("//")
        ? redirect
        : "/account";
    return NextResponse.redirect(new URL(returnUrl, request.url));
  }

  if (!loggedIn && isProtectedPath(pathname)) {
    const signinUrl = new URL("/signin", request.url);
    signinUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(signinUrl);
  }

  const response = NextResponse.next();
  response.headers.set("x-pathname", pathname);
  return response;
}

export const config = {
  matcher: ["/account/:path*", "/wishlist", "/signin", "/cart", "/checkout"],
};
