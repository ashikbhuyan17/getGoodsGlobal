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

async function isAuthenticatedFromApi(
  request: NextRequest,
): Promise<boolean> {
  const token = request.cookies.get("token")?.value;
  if (!token) return false;

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) return false;

    const res = await fetch(`${apiUrl}/user-profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) return false;
    const profile = await res.json();
    const data = profile?.data;
    const hasId = data?.id !== undefined && data?.id !== null && `${data.id}` !== "";
    return Boolean(hasId || data?.email || data?.phone);
  } catch (error) {
    console.error("Auth profile check failed:", error);
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  try {
    const status = await isAuthenticatedFromApi(request);

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

    if (status === false && isProtectedPath(pathname)) {
      const signinUrl = new URL("/signin", request.url);
      signinUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(signinUrl);
    }

    const response = NextResponse.next();
    response.headers.set("x-pathname", pathname);
    return response;
  } catch (error) {
    console.error("Proxy error:", error);
    if (isProtectedPath(pathname)) {
      const signinUrl = new URL("/signin", request.url);
      signinUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(signinUrl);
    }
    const response = NextResponse.next();
    response.headers.set("x-pathname", pathname);
    return response;
  }
}

export const config = {
  matcher: ["/account/:path*", "/wishlist", "/signin", "/cart", "/checkout"],
};
