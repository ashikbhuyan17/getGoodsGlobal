import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { fetcher } from "./lib/fetcher";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userProfile: any = await fetcher("/user-profile");

    const status = userProfile?.data?.email ? true : false;

    if (status === true) {
      if (pathname === "/signin") {
        const redirect = request.nextUrl.searchParams.get("redirect");
        const returnUrl =
          redirect && redirect.startsWith("/") && !redirect.startsWith("//")
            ? redirect
            : "/account";
        return NextResponse.redirect(new URL(returnUrl, request.url));
      }
    }

    if (status === false) {
      if (
        pathname.startsWith("/account") ||
        pathname === "/wishlist" ||
        pathname === "/cart" ||
        pathname === "/checkout"
      ) {
        const signinUrl = new URL("/signin", request.url);
        signinUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(signinUrl);
      }
    }

    const response = NextResponse.next();
    response.headers.set("x-pathname", pathname);
    return response;
  } catch (error) {
    console.error("Middleware error:", error);
    const response = NextResponse.next();
    response.headers.set("x-pathname", pathname);
    return response;
  }
}

export const config = {
  matcher: ["/account/:path*", "/wishlist", "/signin", "/cart", "/checkout"],
};
